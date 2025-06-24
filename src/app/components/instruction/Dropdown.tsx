import { IngredientUsage } from '@/lib/ingredients/schema';

export default function IngredientDropdown({
  ingredients,
  selectedIndex,
  onSelect,
  onHover,
}: { ingredients: IngredientUsage[];
    selectedIndex: number;
    onSelect : (ingredients: IngredientUsage) => void;
    onHover: (index: number) => void;
}) {
  return (
    <ul className="absolute bg-white border border-gray-300 rounded shadow max-h-48 overflow-auto z-20">
      {ingredients.map((usage, i) => (
        <li
          key={usage.id}
          className={`px-3 py-1 cursor-pointer ${
            i === selectedIndex ? 'bg-blue-500 text-white' : 'bg-white text-black'
          }`}
          onMouseDown={(e) => {
            e.preventDefault(); // prevent editor blur
            onSelect(usage);
          }}
          onMouseEnter={() => onHover(i)}
        >
          {usage.ingredient.title}
        </li>
      ))}
    </ul>
  );
}
