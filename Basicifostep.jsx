import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { User, ChevronRight } from 'lucide-react';

export default function BasicInfoStep({ data, onUpdate, onNext, onBack }) {
  const [formData, setFormData] = useState({
    age: data.age || '',
    height: data.height || '',
    weight: data.weight || '',
    body_type: data.body_type || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto px-6 py-12"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Step 1 of 3</p>
            <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
          </div>
        </div>
        <p className="text-gray-600">Tell us a bit about yourself</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="age" className="text-gray-700 font-medium">Age</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
              placeholder="25"
              required
              className="mt-2 h-12"
            />
          </div>

          <div>
            <Label htmlFor="body_type" className="text-gray-700 font-medium">Body Type</Label>
            <Select
              value={formData.body_type}
              onValueChange={(value) => setFormData({ ...formData, body_type: value })}
              required
            >
              <SelectTrigger className="mt-2 h-12">
                <SelectValue placeholder="Select body type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ectomorph">Ectomorph (Lean & Slender)</SelectItem>
                <SelectItem value="mesomorph">Mesomorph (Athletic & Muscular)</SelectItem>
                <SelectItem value="endomorph">Endomorph (Curvy & Fuller)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="height" className="text-gray-700 font-medium">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
              placeholder="170"
              required
              className="mt-2 h-12"
            />
          </div>

          <div>
            <Label htmlFor="weight" className="text-gray-700 font-medium">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
              placeholder="70"
              required
              className="mt-2 h-12"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="flex-1 h-12"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            Continue <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}