import { BaseEditor, Descendant, BaseRange } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

export interface IngredientUsageInput {
    id?: string;
    ingredient: string;
    quantity: number;
    unit: string;
    preparation: string;
    note: string;
}

export interface InstructionInput {
    id?: string;
    content: Descendant[];
    note: string;
    timerMinutes: number;
}

export type IngredientReferenceElement = {
    type: 'ingredient-usage-reference';
    ingredientUsageId: string;
    quantity: number;
    unit: string;
    percentage: number;
    children: CustomText[];
};

export type ParagraphElement = {
  type: 'paragraph';
  children: (CustomText | IngredientReferenceElement)[];
};


export type CustomElement = ParagraphElement | IngredientReferenceElement;

export interface CustomText {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
}

export type CustomTextKey = keyof Omit<CustomText, 'text'>;

export type CustomEditor = BaseEditor &
    ReactEditor &
    HistoryEditor & {
        nodeToDecorations?: Map<Element, Range[]>
    }

declare module 'slate' {
    interface CustomTypes {
        Editor: CustomEditor
        Element: CustomElement
        Text: CustomText
        Range: BaseRange & {
            [key: string]: unknown
        }
    }
}
