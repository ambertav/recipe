import { z } from 'zod';

export const unitSchema = z.object({
    id: z.string().describe('id of the unit'),
    title: z.string().describe('the title of the unit'),
    abbreviation: z.string().describe('abbreviation for the unit, e.g "tsp", "tbsp", etc...'),
    pluralTitle: z.string().describe('the title to use if unit is plural')
});
export type Unit = z.infer<typeof unitSchema>;

export const ingredientSchema = z.object({
    id: z.string().describe('id of the ingredient'),
    title: z.string().describe('title of the ingredient'),
    alternateTitles: z.array(z.string()).describe('alternate titles to match during user input')
});
export type Ingredient = z.infer<typeof ingredientSchema>;

export const ingredientUsageSchema = z.object({
    id: z.string().describe('id of the ingredient usage'),
    ingredient: ingredientSchema,
    quantity: z.number().describe('quantiy for the ingredient'),
    unit: unitSchema,
    preparation: z.string(),
    note: z.string(),
});
export type IngredientUsage = z.infer<typeof ingredientUsageSchema>;

export const ingredientUsageGroupsSchema = z.array(z.object({
    id: z.string().describe('the id of the ingredient group'),
    ingredientUsages: z.array(ingredientUsageSchema),
    title: z.string().describe('title of the ingredient usage group'),
}));
export type IngredientUsageGroups = z.infer<typeof ingredientUsageGroupsSchema>;

