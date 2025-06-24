import { ingredientSchema, unitSchema } from '@/lib/ingredients/schema';
import { ingredientData, unitData } from '@/lib/ingredients/mock';

describe('mock ingredient data' , () => {
    ingredientData.forEach((ingredient, index) => {
        test(`successfully validates mock ingredient object at index ${index}`, () => {
            const result = ingredientSchema.safeParse(ingredient);
            expect(result.success).toBe(true);
        });
    });

    test('rejects invalid ingredient data', () => {
        const badData = [{ id: 1, title: null, alternateTitles: 'sugar' }];
        const result = ingredientSchema.safeParse(badData);
        expect(result.success).toBe(false);
    });
});

describe('mock unit data' , () => {
    unitData.forEach((unit, index) => {
        test(`successfully validates mock unit object at index ${index}`, () => {
            const result = unitSchema.safeParse(unit);
            expect(result.success).toBe(true);
        });
    })

    test('rejects invalid unit data', () => {
        const badData = [{ id: 1, title: null, abbreviation: null, pluralTitle: null }];
        const result = unitSchema.safeParse(badData);
        expect(result.success).toBe(false);
    });
});