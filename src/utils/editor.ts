import { Editor } from 'slate';

import { CustomTextKey } from '@/types';

const isMarkActive = (editor: Editor, format: CustomTextKey) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor: Editor, format: CustomTextKey) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) Editor.removeMark(editor, format);
  else Editor.addMark(editor, format, true);
};


export const withInlines = (editor : Editor) => {
  const { isInline } = editor;

  editor.isInline = (element) =>
    element.type === 'ingredient-usage-reference' ? true : isInline(element);

  editor.isVoid = () => false;

  return editor;
};
