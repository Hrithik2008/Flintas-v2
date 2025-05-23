import React, { useState, useEffect } from 'react';
import { Plus, Edit3 } from 'lucide-react';
import { useStore, Habit, HabitCategory } from '../lib/store';
import { motion } from 'framer-motion';

interface HabitFormProps {
  habitToEdit?: Habit;
  onClose?: () => void; // Callback to close the form, useful when editing
  isOpenInitially?: boolean; // To control if the form is open by default
}

export function HabitForm({ habitToEdit, onClose, isOpenInitially = false }: HabitFormProps) {
  const [isOpen, setIsOpen] = useState(isOpenInitially || !!habitToEdit); // Open if editing or isOpenInitially is true
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Other');
  const [targetType, setTargetType] = useState<'boolean' | 'numerical'>('boolean');
  const [targetValue, setTargetValue] = useState<number | undefined>(undefined);
  const [targetUnit, setTargetUnit] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  const addHabit = useStore((state) => state.addHabit);
  const updateHabit = useStore((state) => state.updateHabit);

  const habitCategories: HabitCategory[] = ['Academic', 'Wellness', 'Social Engagement', 'Other'];

  useEffect(() => {
    if (habitToEdit) {
      setName(habitToEdit.name);
      setDescription(habitToEdit.description || '');
      setCategory(habitToEdit.category);
      setTargetType(habitToEdit.targetType || 'boolean');
      setTargetValue(habitToEdit.targetValue);
      setTargetUnit(habitToEdit.targetUnit || '');
      setReminderTime(habitToEdit.reminderTime || '');
      setIsOpen(true); // Ensure form is open when editing
    } else {
      // Reset form if not editing (e.g. if it was previously editing)
      setName('');
      setDescription('');
      setCategory('Other');
      setTargetType('boolean');
      setTargetValue(undefined);
      setTargetUnit('');
      setReminderTime('');
    }
  }, [habitToEdit]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const habitData = {
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        targetType,
        targetValue: targetType === 'numerical' ? Number(targetValue) || undefined : undefined,
        targetUnit: targetType === 'numerical' ? targetUnit.trim() || undefined : undefined,
        reminderTime: reminderTime || undefined,
      };

      if (habitToEdit) {
        updateHabit(habitToEdit.id, habitData);
      } else {
        addHabit(habitData);
      }
      
      // Reset fields only if not editing (or if editing and onClose is not provided, implying it's a standalone add form)
      if (!habitToEdit) {
        setName('');
        setDescription('');
        setCategory('Other');
        setTargetType('boolean');
        setTargetValue(undefined);
        setTargetUnit('');
        setReminderTime('');
        setIsOpen(false); // Close after adding
      }
      
      if (onClose) {
        onClose(); // Call onClose callback if provided (e.g., when editing in a modal)
      }
    }
  };
  
  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      setIsOpen(false);
       // Reset fields if not editing
      if (!habitToEdit) {
        setName('');
        setDescription('');
        setCategory('Other');
        setTargetType('boolean');
        setTargetValue(undefined);
        setTargetUnit('');
        setReminderTime('');
      }
    }
  };


  return (
    <div className="mb-6">
      {!isOpen && !habitToEdit && ( // Only show "Add New Habit" button if form is closed AND not in edit mode
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Habit</span>
        </motion.button>
      )}

      {isOpen && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 space-y-4"
        >
          <div>
            <label htmlFor="habitName" className="block text-sm font-medium text-gray-700 mb-1">Habit Name</label>
            <input
              id="habitName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Read for 30 minutes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              autoFocus={!habitToEdit} // Autofocus only when adding new habit
            />
          </div>

          <div>
            <label htmlFor="habitDescription" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              id="habitDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., To expand knowledge in software engineering"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none"
            />
          </div>
          
          <div>
            <label htmlFor="habitCategory" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="habitCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value as HabitCategory)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {habitCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="targetType" className="block text-sm font-medium text-gray-700 mb-1">Target Type</label>
            <select
              id="targetType"
              value={targetType}
              onChange={(e) => setTargetType(e.target.value as 'boolean' | 'numerical')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="boolean">Simple Check-off (Completed/Not)</option>
              <option value="numerical">Numerical Target (e.g., quantity, duration)</option>
            </select>
          </div>

          {targetType === 'numerical' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700 mb-1">Target Value</label>
                <input
                  id="targetValue"
                  type="number"
                  value={targetValue || ''}
                  onChange={(e) => setTargetValue(parseFloat(e.target.value))}
                  placeholder="e.g., 2, 5, 60"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="targetUnit" className="block text-sm font-medium text-gray-700 mb-1">Unit (Optional)</label>
                <input
                  id="targetUnit"
                  type="text"
                  value={targetUnit}
                  onChange={(e) => setTargetUnit(e.target.value)}
                  placeholder="e.g., hours, km, pages"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-1">Reminder Time (Optional)</label>
            <input
              id="reminderTime"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2"
            >
              {habitToEdit ? <><Edit3 size={16}/> Update Habit</> : <><Plus size={16}/> Add Habit</>}
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
}