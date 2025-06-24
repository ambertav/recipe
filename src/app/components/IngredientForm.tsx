'use client';

import { useState, useEffect, MouseEvent } from 'react';
import { ingredientData, unitData } from '@/lib/ingredients/mock';
import { IngredientUsage } from '@/lib/ingredients/schema';
import { IngredientUsageInput } from '@/types';

import * as ingredientService from '@/lib/ingredients/service';

import AutoCompleteInput from '@/app/components/AutoCompleteInput';

export default function IngredientForm () {
      const ingredientSuggestions = ingredientData.flatMap((item) => [
    item.title,
    ...item.alternateTitles,
  ]);
  const unitSuggestions = unitData.flatMap((item) => [
    `${item.title} ${
      item.title !== item.abbreviation ? `(${item.abbreviation})` : ''
    }`,
  ]);

  const [ingredientGroup, setIngredientGroup] = useState<
    IngredientUsageInput[]
  >([
    {
      id: '',
      ingredient: '',
      quantity: 0,
      unit: '',
      preparation: '',
      note: '',
    },
  ]);

  const handleChange = (
    index: number,
    field: keyof IngredientUsage,
    value: string
  ) => {
    const updated = [...ingredientGroup];
    updated[index] = {
      ...updated[index],
      [field]: field === 'quantity' ? parseFloat(value) || 0 : value,
    };
    setIngredientGroup(updated);

    const entry = updated[index];
    const valid = entry.ingredient && entry.unit && entry.quantity > 0;

    if (valid) {
      try {
        const saved: IngredientUsage = ingredientService.createOrUpdate(entry);
        updated[index] = { ...entry, id: saved.id };
        setIngredientGroup(updated);
      } catch (error) {
        console.error('Failed to save ingredient usage:', error);
      }
    }
  };

  const handleAddIngredient = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setIngredientGroup([
      ...ingredientGroup,
      {
        id: '',
        ingredient: '',
        quantity: 0,
        unit: '',
        preparation: '',
        note: '',
      },
    ]);
  };

  useEffect(() => {
    const storedData = ingredientService.getData();
    if (storedData && storedData.length > 0) {
      const mapped = storedData.map((usage) => ({
        id: usage.id,
        ingredient: usage.ingredient.title,
        quantity: usage.quantity,
        unit: usage.unit.title,
        preparation: usage.preparation,
        note: usage.note,
      }));

      setIngredientGroup(mapped);
    }
  }, []);


    return (
          <form className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Ingredients</h3>

        {ingredientGroup.map((entry, index) => (
          <div key={index} className="flex gap-2 mb-3 flex-wrap md:flex-nowrap">
            <AutoCompleteInput
              placeholder="Ingredient"
              suggestions={ingredientSuggestions}
              value={entry.ingredient}
              onChange={(val) => handleChange(index, 'ingredient', val)}
            />
            <input
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              type="number"
              placeholder="Qty"
              value={entry.quantity}
              onChange={(e) => handleChange(index, 'quantity', e.target.value)}
            />
            <AutoCompleteInput
              placeholder="Unit"
              suggestions={unitSuggestions}
              value={entry.unit}
              onChange={(val) => handleChange(index, 'unit', val)}
            />
            <input
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              type="text"
              placeholder="Preparation"
              value={entry.preparation || ''}
              onChange={(e) =>
                handleChange(index, 'preparation', e.target.value)
              }
            />
            <input
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              type="text"
              placeholder="Note"
              value={entry.note || ''}
              onChange={(e) => handleChange(index, 'note', e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleAddIngredient}
        >
          + Add
        </button>
      </form>
    );
}