/**
 * @jest-environment jsdom
 */

import * as ingredientService from '@/lib/ingredients/service';
import { ingredientData, unitData } from '@/lib/ingredients/mock';

describe('ingredient service', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    test('getIngredientByName returns correct ingredient by title or alternate titles', () => {
        const ingredient = ingredientService.getIngredientByName(ingredientData[0].title);
        expect(ingredient).toEqual(ingredientData[0]);

        const ingredientByAltTitle = ingredientService.getIngredientByName(ingredientData[0].alternateTitles[0]);
        expect(ingredientByAltTitle).toEqual(ingredientData[0]);
    });

    test('getUnitByName returns correct unit by title, regardless of abbreviation in input', () => {
        const unit = ingredientService.getUnitByName(unitData[0].title);
        expect(unit).toEqual(unitData[0]);

        // finding index first unit with an abbreviation
        const index = unitData.findIndex(unit => unit.abbreviation && unit.abbreviation.trim() !== '');
        const input = `${unitData[index].title} (${unitData[index].abbreviation})`; // formatting like in frontend

        const unitWithAbbr = ingredientService.getUnitByName(input);
        expect(unitWithAbbr).toEqual(unitData[index]);
    });

    test('createOrUpdate creates a new IngredientUseage when id is empty', () => {
        const input = { id: '', ingredient: ingredientData[0].title, unit: unitData[0].title, quantity: 1, preparation: '', note: '' };

        const usage = ingredientService.createOrUpdate(input);
        expect(usage.id).not.toBe('');

        const stored = JSON.parse(localStorage.getItem('ingredientUsages')!);
        expect(stored.length).toBe(1);
    });

    test('createOrUpdate updates an existing IngredientUseage when id is provided', () => {
        const input = { id: '', ingredient: ingredientData[0].title, unit: unitData[0].title, quantity: 1, preparation: '', note: '' };
        const original = ingredientService.createOrUpdate(input);

        const updatedInput = {
            ...input,
            id: original.id,
            quantity: 2,
            note: 'chopped'
        };

        const updated = ingredientService.createOrUpdate(updatedInput);
        expect(updated.id).toBe(original.id);

        const stored = JSON.parse(localStorage.getItem('ingredientUsages')!);
        expect(stored.length).toBe(1);
        expect(stored[0].quantity).toBe(2);
        expect(stored[0].note).toBe('chopped');
    });

    test('getData returns parsed data from localStorage', () => {
        const input = { id: '', ingredient: ingredientData[0].title, unit: unitData[0].title, quantity: 1, preparation: '', note: '' };
        const data = ingredientService.createOrUpdate(input);

        const stored = ingredientService.getData();
        
        expect(Array.isArray(stored)).toBe(true);
        expect(stored).toContainEqual(data);
    });
});