import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Ruler, ChevronRight } from 'lucide-react';

export default function MetricsStep({ data, onUpdate, onNext, onBack }) {
  const [formData, setFormData] = useState({
    chest: data.chest || '',
    waist: data.waist || '',
    hips: data.hips || '',
    arms: data.arms || '',
    legs: data.legs || '',
    shoulder_width: data.shoulder_width || '',
    posture_notes: data.posture_notes || ''
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
          <div className="p-2 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-500">
            <Ruler className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Step 2 of 3</p>
            <h2 className="text-2xl font-bold text-gray-900">Body Measurements</h2>
          </div>
        </div>
        <p className="text-gray-600">Enter your measurements for personalized analysis</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="chest" className="text-gray-700 font-medium">Chest (cm)</Label>
            <Input
              id="chest"
              type="number"
              value={formData.chest}
              onChange={(e) => setFormData({ ...formData, chest: Number(e.target.value) })}
              placeholder="95"
              required
              className="mt-2 h-12"
            />
          </div>

          <div>
            <Label htmlFor="waist" className="text-gray-700 font-medium">Waist (cm)</Label>
            <Input
              id="waist"
              type="number"
              value={formData.waist}
              onChange={(e) => setFormData({ ...formData, waist: Number(e.target.value) })}
              placeholder="80"
              required
              className="mt-2 h-12"
            />
          </div>

          <div>
            <Label htmlFor="hips" className="text-gray-700 font-medium">Hips (cm)</Label>
            <Input
              id="hips"
              type="number"
              value={formData.hips}
              onChange={(e) => setFormData({ ...formData, hips: Number(e.target.value) })}
              placeholder="95"
              required
              className="mt-2 h-12"
            />
          </div>

          <div>
            <Label htmlFor="shoulder_width" className="text-gray-700 font-medium">Shoulder Width (cm)</Label>
            <Input
              id="shoulder_width"
              type="number"
              value={formData.shoulder_width}
              onChange={(e) => setFormData({ ...formData, shoulder_width: Number(e.target.value) })}
              placeholder="45"
              required
              className="mt-2 h-12"
            />
          </div>

          <div>
            <Label htmlFor="arms" className="text-gray-700 font-medium">Arms (cm)</Label>
            <Input
              id="arms"
              type="number"
              value={formData.arms}
              onChange={(e) => setFormData({ ...formData, arms: Number(e.target.value) })}
              placeholder="30"
              required
              className="mt-2 h-12"
            />
          </div>

          <div>
            <Label htmlFor="legs" className="text-gray-700 font-medium">Legs (cm)</Label>
            <Input
              id="legs"
              type="number"
              value={formData.legs}
              onChange={(e) => setFormData({ ...formData, legs: Number(e.target.value) })}
              placeholder="55"
              required
              className="mt-2 h-12"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="posture_notes" className="text-gray-700 font-medium">
            Posture & Mobility Notes (Optional)
          </Label>
          <Textarea
            id="posture_notes"
            value={formData.posture_notes}
            onChange={(e) => setFormData({ ...formData, posture_notes: e.target.value })}
            placeholder="E.g., Lower back pain, shoulder tension, knee discomfort..."
            className="mt-2 min-h-24"
          />
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
            className="flex-1 h-12 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600"
          >
            Continue <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}