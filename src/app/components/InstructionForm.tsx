'use client';

import { useState, useRef, useEffect } from 'react';
import { createEditor, Descendant, Editor, Range } from 'slate';
import {
  Slate,
  Editable,
  withReact,
  useSlate,
  useFocused,
  RenderLeafProps,
} from 'slate-react';
import * as instructionService from '@/lib/instructions/service';

import { InstructionInput, CustomTextKey } from '@/types';

export default function InstructionForm() {
  const [instructionsGroup, setInstructionsGroup] = useState<
    InstructionInput[]
  >([
    {
      id: '',
      content: [{ type: 'paragraph', children: [{ text: '' }] }],
      note: '',
      timerMinutes: 0,
    },
  ]);

  const [editors, setEditors] = useState(() =>
    instructionsGroup.map(() => withReact(createEditor()))
  );

  const handleAddInstruction = () => {
    setInstructionsGroup((prev) => [
      ...prev,
      {
        id: '',
        content: [
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
        ] as Descendant[],
        note: '',
        timerMinutes: 0,
      },
    ]);

    setEditors((prev) => [...prev, withReact(createEditor())]);
  };

  const handleContentChange = (index: number, newValue: Descendant[]) => {
    setInstructionsGroup((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, content: newValue } : item
      )
    );
  };

  const handleSaveInstruction = (index: number) => {
    try {
      const entry = instructionsGroup[index];
      const saved = instructionService.createOrUpdate(entry);

      setInstructionsGroup((prev) => {
        const updated = [...prev];
        updated[index] = { ...entry, id: saved.id };
        return updated;
      });
    } catch (error) {
      console.error('Failed to save instruction:', error);
    }
  };

  useEffect(() => {
    const storedData = instructionService.getData();
    if (storedData && storedData.length > 0)
      setInstructionsGroup(storedData as InstructionInput[]);
  }, []);

  useEffect(() => {
    setEditors((prev) => {
      const newEditors = [...prev];
      while (newEditors.length < instructionsGroup.length) {
        newEditors.push(withReact(createEditor()));
      }
      return newEditors;
    });
  }, [instructionsGroup.length]);

  return (
    <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Instructions</h2>
      {instructionsGroup.map((instruction, index) => (
        <div key={index} className="mb-6 relative">
          <div className="flex items-start gap-4 w-full">
            <label className="block text-xl font-medium whitespace-nowrap mt-2">
              {index + 1}
            </label>
            <div className="flex-1 min-w-0">
              {editors[index] && (
                <Slate
                  key={instruction.id || index}
                  editor={editors[index]}
                  initialValue={instruction.content}
                  onChange={(newValue) => handleContentChange(index, newValue)}
                >
                  <HoveringToolbar />
                  <Editable
                    renderLeaf={(props) => <Leaf {...props} />}
                    placeholder="Instruction..."
                    onDOMBeforeInput={(event: InputEvent) => {
                      switch (event.inputType) {
                        case 'formatBold':
                          event.preventDefault();
                          return toggleMark(editors[index], 'bold');
                        case 'formatItalic':
                          event.preventDefault();
                          return toggleMark(editors[index], 'italic');
                        case 'formatUnderline':
                          event.preventDefault();
                          return toggleMark(editors[index], 'underline');
                      }
                    }}
                    className="max-h-[75px] overflow-y-auto border border-gray-300 rounded px-3 py-2 w-full"
                    onBlur={() => handleSaveInstruction(index)}
                  />
                </Slate>
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleAddInstruction}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        type="button"
      >
        + Add
      </button>
    </div>
  );
}

const isMarkActive = (editor: Editor, format: CustomTextKey) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: Editor, format: CustomTextKey) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) Editor.removeMark(editor, format);
  else Editor.addMark(editor, format, true);
};

const FormatButton = ({
  format,
  icon,
}: {
  format: CustomTextKey;
  icon: string;
}) => {
  const editor = useSlate();
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
      className="text-black mr-2 cursor-pointer select-none bg-transparent border-none mx-3"
      aria-label={format}
      type="button"
    >
      {icon}
    </button>
  );
};

const HoveringToolbar = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const editor: Editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) return;

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
      return;
    }

    el.style.opacity = '1';
    el.style.pointerEvents = 'auto';
  }, [editor.selection, inFocus]);

  return (
    <div
      ref={ref}
      className="absolute z-10 -mt-10 opacity-0 bg-white rounded-lg shadow-sm transition-opacity p-2 flex"
      onMouseDown={(e) => {
        // prevent toolbar from taking focus away from editor
        e.preventDefault();
      }}
    >
      <FormatButton format="bold" icon="B" />
      <FormatButton format="italic" icon="I" />
      <FormatButton format="underline" icon="U" />
    </div>
  );
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};
