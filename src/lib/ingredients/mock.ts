import { Ingredient, Unit } from '@/lib/ingredients/schema';

const ingredientData: Ingredient[] = [
  {
    id: '1',
    title: 'Flour',
    alternateTitles: ['all-purpose flour', 'plain flour', 'wheat flour'],
  },
  {
    id: '2',
    title: 'Sugar',
    alternateTitles: ['granulated sugar', 'white sugar'],
  },
  {
    id: '3',
    title: 'Butter',
    alternateTitles: ['unsalted butter', 'salted butter'],
  },
  {
    id: '4',
    title: 'Salt',
    alternateTitles: ['table salt', 'sea salt'],
  },
  {
    id: '5',
    title: 'Milk',
    alternateTitles: ['whole milk', 'skim milk'],
  },
  {
    id: '6',
    title: 'Eggs',
    alternateTitles: ['large eggs', 'chicken eggs'],
  },
  {
    id: '7',
    title: 'Baking Powder',
    alternateTitles: [],
  },
  {
    id: '8',
    title: 'Vanilla Extract',
    alternateTitles: [],
  },
  {
    id: '9',
    title: 'Olive Oil',
    alternateTitles: ['extra virgin olive oil', 'EVOO'],
  },
  {
    id: '10',
    title: 'Cinnamon',
    alternateTitles: ['ground cinnamon', 'cassia'],
  },
];


const unitData: Unit[] = [
    { id: '1', title: 'cup', abbreviation: 'cup', pluralTitle: 'cups' },
    { id: '2', title: 'teaspoon', abbreviation: 'tsp', pluralTitle: 'teaspoons' },
    { id: '3', title: 'tablespoon', abbreviation: 'tbsp', pluralTitle: 'tablespoons' },
    { id: '4', title: 'ounce', abbreviation: 'oz', pluralTitle: 'ounces' },
    { id: '5', title: 'pound', abbreviation: 'lb', pluralTitle: 'pounds' },
];

export { ingredientData, unitData };