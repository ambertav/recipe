import { v4 as uuidv4 } from 'uuid';

import { Instruction } from './schema';
import { InstructionInput } from '@/types';


export function createOrUpdate(input: InstructionInput): Instruction {
    console.log('create or update called');
    if (!input.id) input.id = uuidv4();

    const existing: Instruction[] = getData();
    const index = existing.findIndex((item) => item.id === input.id);

    if (index === -1) existing.push(input as Instruction);
    else existing[index] = { ...existing[index], ...input } as Instruction;

    localStorage.setItem('instructions', JSON.stringify(existing));
    console.log('updated local storage');

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
