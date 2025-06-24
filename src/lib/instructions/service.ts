import { v4 as uuidv4 } from 'uuid';
import { Editor, Transforms, Range } from 'slate';

import { Instruction } from './schema';
import { IngredientUsage } from '../ingredients/schema';
import { InstructionInput, IngredientReferenceElement } from '@/types';


export function createOrUpdate(input: InstructionInput): Instruction {
    if (!input.id) input.id = uuidv4();

    const existing: Instruction[] = getData();
    const index = existing.findIndex((item) => item.id === input.id);

    if (index === -1) existing.push(input as Instruction);
    else existing[index] = { ...existing[index], ...input } as Instruction;

    localStorage.setItem('instructions', JSON.stringify(existing));

    return existing[index !== -1 ? index : existing.length - 1];
}

export function getData(): Instruction[] {
    const data = localStorage.getItem('instructions');
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to parse instructions data from local storage');
        return [];
    }
}

export function insertIngredientReference(
  editor: Editor,
  ingredientUsage: IngredientUsage,
  percentage: number = 100,
  range: Range
) {
  const ingredientReference: IngredientReferenceElement = {
    type: 'ingredient-usage-reference',
    ingredientUsageId: ingredientUsage.id,
    quantity: ingredientUsage.quantity,
    unit: ingredientUsage.unit.title,
    percentage,
    children: [{ text: ingredientUsage.ingredient.title }],
  };

  Transforms.select(editor, range);
  Transforms.delete(editor);
  Transforms.insertNodes(editor, ingredientReference);
  Transforms.move(editor);
}
