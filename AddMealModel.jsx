import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Search, ScanBarcode, Sparkles, Plus, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FOOD_DATABASE = [
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving_size: '100g' },
  { name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.8, serving_size: '1 cup cooked' },
  { name: 'Salmon', calories: 208, protein: 20, carbs: 0, fat: 13, serving_size: '100g' },
  { name: 'Egg', calories: 78, protein: 6, carbs: 0.6, fat: 5, serving_size: '1 large' },
  { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0.7, serving_size: '170g' },
  { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving_size: '1 medium' },
  { name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3, serving_size: '1 cup cooked' },
  { name: 'Avocado', calories: 234, protein: 3, carbs: 12, fat: 21, serving_size: '1 medium' },
  { name: 'Sweet Potato', calories: 103, protein: 2, carbs: 24, fat: 0.1, serving_size: '100g' },
  { name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, serving_size: '28g' },
  { name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, serving_size: '1 cup' },
  { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, serving_size: '100g' },
  { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, serving_size: '1 medium' },
  { name: 'Milk (2%)', calories: 122, protein: 8, carbs: 12, fat: 5, serving_size: '1 cup' },
  { name: 'Whole Wheat Bread', calories: 81, protein: 4, carbs: 14, fat: 1, serving_size: '1 slice' },
  { name: 'Tuna', calories: 132, protein: 29, carbs: 0, fat: 1, serving_size: '100g' },
  { name: 'Quinoa', calories: 222, protein: 8, carbs: 39, fat: 3.5, serving_size: '1 cup cooked' },
  { name: 'Cottage Cheese', calories: 206, protein: 28, carbs: 6, fat: 9, serving_size: '1 cup' }
];

export default function AddMealModal({ open, onClose, mealType, selectedDate, userEmail }) {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [barcodeResult, setBarcodeResult] = useState(null);
  const [aiDescription, setAiDescription] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const filteredFoods = FOOD_DATABASE.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addFood = (food) => {
    setSelectedFoods([...selectedFoods, { ...food, id: Date.now() }]);
  };

  const removeFood = (id) => {
    setSelectedFoods(selectedFoods.filter(f => f.id !== id));
  };

  const handleBarcodeCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this barcode image and identify the food product. Extract nutritional information.
        If you can identify the product, provide its nutritional data per serving.
        If not clearly visible, make a reasonable estimate based on common products.`,
        file_urls: [file_url],
        response_json_schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            calories: { type: 'number' },
            protein: { type: 'number' },
            carbs: { type: 'number' },
            fat: { type: 'number' },
            serving_size: { type: 'string' },
            barcode: { type: 'string' }
          }
        }
      });
      
      setBarcodeResult(result);
      addFood(result);
    } catch (error) {
      console.error('Barcode scan error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIAnalyze = async () => {
    if (!aiDescription.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this food description and estimate nutritional values:
        "${aiDescription}"
        
        Provide realistic nutritional estimates for a typical serving.`,
        response_json_schema: {
          type: 'object',
          properties: {
            foods: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  calories: { type: 'number' },
                  protein: { type: 'number' },
                  carbs: { type: 'number' },
                  fat: { type: 'number' },
                  serving_size: { type: 'string' }
                }
              }
            }
          }
        }
      });
      
      setAiResult(result);
      if (result.foods) {
        result.foods.forEach(food => addFood(food));
      }
    } catch (error) {
      console.error('AI analysis error:', error);
    } finally {
      setIsLoading(false);
      setAiDescription('');
    }
  };

  const saveMeal = async () => {
    if (selectedFoods.length === 0) return;
    
    setIsLoading(true);
    try {
      const totals = selectedFoods.reduce((acc, food) => ({
        calories: acc.calories + (food.calories || 0),
        protein: acc.protein + (food.protein || 0),
        carbs: acc.carbs + (food.carbs || 0),
        fat: acc.fat + (food.fat || 0)
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

      // Check for existing meal of same type on same date
      const existingMeals = await base44.entities.MealLog.filter({
        created_by: userEmail,
        log_date: selectedDate,
        meal_type: mealType
      });

      if (existingMeals.length > 0) {
        // Update existing meal
        const existingMeal = existingMeals[0];
        const updatedFoods = [...(existingMeal.foods || []), ...selectedFoods.map(({ id, ...f }) => f)];
        await base44.entities.MealLog.update(existingMeal.id, {
          foods: updatedFoods,
          total_calories: (existingMeal.total_calories || 0) + totals.calories,
          total_protein: (existingMeal.total_protein || 0) + totals.protein,
          total_carbs: (existingMeal.total_carbs || 0) + totals.carbs,
          total_fat: (existingMeal.total_fat || 0) + totals.fat
        });
      } else {
        // Create new meal
        await base44.entities.MealLog.create({
          log_date: selectedDate,
          meal_type: mealType,
          foods: selectedFoods.map(({ id, ...f }) => f),
          total_calories: totals.calories,
          total_protein: totals.protein,
          total_carbs: totals.carbs,
          total_fat: totals.fat
        });
      }

      queryClient.invalidateQueries(['mealLogs']);
      queryClient.invalidateQueries(['weeklyMealLogs']);
      setSelectedFoods([]);
      onClose();
    } catch (error) {
      console.error('Save meal error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 border border-purple-400/30 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white capitalize">Add {mealType}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full glass-cosmic-strong border border-purple-400/30">
            <TabsTrigger value="search" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500 text-purple-200">
              <Search className="w-4 h-4 mr-1" /> Search
            </TabsTrigger>
            <TabsTrigger value="scan" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500 text-purple-200">
              <ScanBarcode className="w-4 h-4 mr-1" /> Scan
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500 text-purple-200">
              <Sparkles className="w-4 h-4 mr-1" /> AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-4">
            <Input
              placeholder="Search foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-purple-900/40 border-purple-400/30 text-white placeholder:text-purple-300/60 mb-3"
            />
            <div className="max-h-48 overflow-y-auto space-y-2">
              {filteredFoods.map((food, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-purple-900/30 border border-purple-400/20">
                  <div>
                    <p className="font-medium text-white">{food.name}</p>
                    <p className="text-xs text-purple-300">{food.serving_size} • {food.calories} kcal</p>
                  </div>
                  <Button size="icon" onClick={() => addFood(food)} className="h-8 w-8 bg-green-500/30 border border-green-400/50 hover:bg-green-500/50">
                    <Plus className="w-4 h-4 text-green-300" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scan" className="mt-4">
            <div className="text-center py-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleBarcodeCapture}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="w-full h-20 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-2 border-dashed border-purple-400/50 hover:border-cyan-400/50"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Camera className="w-8 h-8 text-cyan-300 mb-2" />
                    <span className="text-purple-200">Tap to scan barcode</span>
                  </div>
                )}
              </Button>
              <p className="text-xs text-purple-300/70 mt-2">Point camera at food barcode</p>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="mt-4">
            <div className="space-y-3">
              <Input
                placeholder="Describe your food (e.g., 'grilled chicken salad with olive oil dressing')"
                value={aiDescription}
                onChange={(e) => setAiDescription(e.target.value)}
                className="bg-purple-900/40 border-purple-400/30 text-white placeholder:text-purple-300/60"
              />
              <Button
                onClick={handleAIAnalyze}
                disabled={isLoading || !aiDescription.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Analyze with AI
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Selected Foods */}
        {selectedFoods.length > 0 && (
          <div className="mt-4 pt-4 border-t border-purple-400/30">
            <h4 className="font-semibold text-white mb-3">Selected Foods ({selectedFoods.length})</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              <AnimatePresence>
                {selectedFoods.map((food) => (
                  <motion.div
                    key={food.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex justify-between items-center p-2 rounded-lg bg-green-900/30 border border-green-400/30"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{food.name}</p>
                      <p className="text-xs text-purple-300">{food.calories} kcal</p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeFood(food.id)} className="h-7 w-7 text-red-400 hover:text-red-300">
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        <Button
          onClick={saveMeal}
          disabled={selectedFoods.length === 0 || isLoading}
          className="w-full mt-4 h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 font-bold"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Add ${selectedFoods.length} Item${selectedFoods.length !== 1 ? 's' : ''} to ${mealType}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}