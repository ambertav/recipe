import { z } from 'zod';

export const textNodeSchema = z.object({
    text: z.string(),
});

export const referenceNodeSchema = z.object({
    type: z.literal('ingredient-usage-reference'),
    ingredientUsageId: z.string().describe('the id of the ingredient usage its referring to'),
    children: z.array(textNodeSchema)
});

export const paragraphSchema = z.object({
    type: z.literal('paragraph'),
    children: z.array(z.union([textNodeSchema, referenceNodeSchema]))
});

export const instructionSchema = z.object({
    id: z.string(),
    content: z
        .array(paragraphSchema)
        .describe('array of paragraph nodes representing the content of the recipe instruction, includes plain text and ingredient references'),
    note: z.string(),
    timerMinutes: z.number(),

});
export type Instruction = z.infer<typeof instructionSchema>;

export const instructionsGroupSchema = z.array(z.object({
    id: z.string(),
    instructions: z.array(instructionSchema),
    title: z.string(),
}));
export type InstructionGroup = z.infer<typeof instructionsGroupSchema>;
