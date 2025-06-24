import { v4 as uuidv4 } from 'uuid';

import { IngredientUsageInput } from '@/types';
import { Ingredient, Unit, IngredientUsage } from './schema';
import { ingredientData, unitData } from './mock';

export function getIngredientByName(input: string): Ingredient | undefined {
    return ingredientData.find(ingredient =>
        input.toLowerCase() === ingredient.title.toLowerCase() ||
        ingredient.alternateTitles.some(alt => alt.toLowerCase() === input.toLowerCase())
    );
}

export function getUnitByName(input: string): Unit | undefined {
    // UI renders title (abbr) if abbr is available, have to split to compare to mock data
    const titlePart = input.split('(')[0].trim().toLowerCase();
    return unitData.find(unit => titlePart === unit.title.toLowerCase());
}

export function createOrUpdate(input: IngredientUsageInput) : IngredientUsage {
    const ingredient = getIngredientByName(input.ingredient);
    const unit = getUnitByName(input.unit);

    if (!ingredient || !unit || input.quantity <= 0) throw new Error('Missing or invalid input');

    const newUsage: IngredientUsage = {
        id: input.id && input.id !== '' ? input.id : uuidv4(),
        ingredient,
        unit,
        quantity: input.quantity,
        preparation: input.preparation,
        note: input.note
    }

    const existing: IngredientUsage[] = getData();

    const index = existing.findIndex((usage: IngredientUsage) => usage.id === newUsage.id);
    if (index === -1) existing.push(newUsage);
    else existing[index] = newUsage;

    localStorage.setItem('ingredientUsages', JSON.stringify(existing));

    return newUsage;
}

export function getData(): IngredientUsage[] {
    const data = localStorage.getItem('ingredientUsages');
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch (error: unknown) {
        console.error('Failed to parse ingredient usage data from local storage:', error);
        return [];
    }
}