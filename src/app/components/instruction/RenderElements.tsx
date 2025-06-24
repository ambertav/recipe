import { RenderLeafProps, RenderElementProps } from 'slate-react';

export const IngredientElement = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case 'ingredient-usage-reference':
      return (
        <span
          {...attributes}
          contentEditable={false}
          className="bg-yellow-200 px-1 rounded cursor-pointer"
          data-ingredient-id={element.ingredientUsageId}
        >{children} ({element.quantity * (element.percentage / 100)}{' '}{element.unit})
    </span>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};



export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  return <span {...attributes}>{children}</span>;
};
