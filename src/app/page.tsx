'use client';

import IngredientForm from '@/app/components/ingredient/IngredientForm';
import InstructionForm from '@/app/components/instruction/InstructionForm';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-start justify-center p-8 bg-gray-50">
      <button
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
      >
        Clear
      </button>
      <IngredientForm />
      <br />
      <br />
      <InstructionForm />
    </div>
  );
}
