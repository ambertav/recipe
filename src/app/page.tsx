'use client';

import IngredientForm from '@/app/components/IngredientForm';
import InstructionForm from '@/app/components/InstructionForm';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-start justify-center p-8 bg-gray-50">
        <IngredientForm />
        <br />
        <br />
        <InstructionForm />
    </div>
  );
}
