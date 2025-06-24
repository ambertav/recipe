'use client';

import { useState, useEffect } from 'react';
import { createEditor, Descendant, Editor, Range, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import * as instructionService from '@/lib/instructions/service';
import * as ingredientService from '@/lib/ingredients/service';

import { toggleMark, withInlines } from '@/utils/editor';

import { InstructionInput } from '@/types';
import { IngredientUsage } from '@/lib/ingredients/schema';

import Toolbar from './Toolbar';
import { IngredientElement, Leaf } from './RenderElements';

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
  const [ingredientUsages, setIngredientUsages] = useState<IngredientUsage[]>(
    []
  );

  const [editors, setEditors] = useState(() =>
    instructionsGroup.map(() => withInlines(withReact(createEditor())))
  );

  const [targetRange, setTargetRange] = useState<Range | null>(null);
  const [search, setSearch] = useState('');
  const [ingredientIndex, setIngredientIndex] = useState(-1);
  const [dropdownEditorIndex, setDropdownEditorIndex] = useState<number | null>(
    null
  );

  // for delayed reference insertion, allowing to input percentage
  const [pendingReference, setPendingReference] = useState<{
    ingredient: IngredientUsage;
    editor: Editor;
    range: Range;
    editorIndex: number;
    timeoutId: NodeJS.Timeout;
  } | null>(null);

  const insertPendingReference = (percentage: number = 100) => {
    if (pendingReference) {
      clearTimeout(pendingReference.timeoutId);
      instructionService.insertIngredientReference(
        pendingReference.editor,
        pendingReference.ingredient,
        percentage,
        pendingReference.range
      );
      setPendingReference(null);
    }
  };

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    editor: Editor
  ) => {
    // handles pending reference state
    if (pendingReference) {
      switch (event.key) {
        case 'Tab':
        case 'Enter':
          event.preventDefault();
          insertPendingReference(100);
          return;
        case 'Escape':
          event.preventDefault();
          clearTimeout(pendingReference.timeoutId);
          setPendingReference(null);
          return;
      }
    }

    if (targetRange) {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          const nextIndex = (ingredientIndex + 1) % filteredIngredients.length;
          setIngredientIndex(nextIndex);
          break;
        case 'ArrowUp':
          event.preventDefault();
          const prevIndex =
            (ingredientIndex - 1 + filteredIngredients.length) %
            filteredIngredients.length;
          setIngredientIndex(prevIndex);
          break;
        case 'Tab':
        case 'Enter':
          event.preventDefault();
          if (ingredientIndex !== -1) {
            handleIngredientSelection(
              filteredIngredients[ingredientIndex],
              editor
            );
          }
          break;
        case 'Escape':
          event.preventDefault();
          setTargetRange(null);
          setSearch('');
          break;
      }
    }
  };

  const handleIngredientSelection = (
    ingredient: IngredientUsage,
    editor: Editor
  ) => {
    if (!targetRange) return;

    Transforms.select(editor, targetRange);
    Transforms.insertText(editor, `@${ingredient.ingredient.title}`);

    setTargetRange(null);
    setSearch('');
    setIngredientIndex(-1);
    setDropdownEditorIndex(null);

    const after = Editor.after(editor, targetRange.anchor, {
      distance: ingredient.ingredient.title.length + 1,
    });
    if (!after) return;

const currentRange = {
  anchor: targetRange.anchor,
  focus: after,
};

const currentReference = {
  ingredient,
  editor,
  range: currentRange,
  editorIndex: dropdownEditorIndex!,
};

const timeoutId = setTimeout(() => {
  instructionService.insertIngredientReference(
    currentReference.editor,
    currentReference.ingredient,
    100,
    currentReference.range
  );
  setPendingReference(null); // clear stale reference
}, 1000);

setPendingReference({
  ...currentReference,
  timeoutId,
});

  };

  const filteredIngredients = search
    ? ingredientUsages.filter(({ ingredient }) =>
        ingredient.title.toLowerCase().startsWith(search.toLowerCase())
      )
    : ingredientUsages;

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

    setEditors((prev) => [...prev, withInlines(withReact(createEditor()))]);
  };

  const handleChangeWithDetection = (
    editor: Editor,
    value: Descendant[],
    instructionIndex: number
  ) => {
    setInstructionsGroup((prev) =>
      prev.map((item, i) =>
        i === instructionIndex ? { ...item, content: value } : item
      )
    );

    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);

      if (
        pendingReference &&
        pendingReference.editorIndex === instructionIndex
      ) {
        const didUpdatePercentage = detectPercentageAfterIngredientName(editor);
        if (didUpdatePercentage) {
          return;
        }
      }

      const wordBefore = Editor.before(editor, start, { unit: 'word' });
      const beforeRange = wordBefore && Editor.range(editor, wordBefore, start);
      const beforeText = beforeRange && Editor.string(editor, beforeRange);

      if (beforeText?.includes('@')) {
        const atIndex = beforeText.lastIndexOf('@');
        const mentionStart = Editor.before(editor, selection!.focus, {
          distance: beforeText.length - atIndex,
        });
        if (mentionStart) {
          const mentionRange = Editor.range(
            editor,
            mentionStart,
            selection!.focus
          );
          const mentionText = Editor.string(editor, mentionRange).slice(1); // skip '@'
          setTargetRange(mentionRange);
          setSearch(mentionText);
          setIngredientIndex(-1);
          setDropdownEditorIndex(instructionIndex);
          return;
        }
      }
    }

    setTargetRange(null);
    setSearch('');
  };

  const detectPercentageAfterIngredientName = (editor: Editor) => {
    if (!pendingReference) return false;

    const { selection } = editor;
    if (!selection || !Range.isCollapsed(selection)) return false;

    const [anchor] = Range.edges(selection);

    const textFromReference = Editor.string(editor, {
      anchor: pendingReference.range.anchor,
      focus: anchor,
    });

    const match = textFromReference.match(/@([^(]+)\((\d{1,3})\)$/);
    if (match) {
      const percentage = Math.min(100, parseInt(match[2], 10));

      clearTimeout(pendingReference.timeoutId);

      const fullRange = {
        anchor: pendingReference.range.anchor,
        focus: anchor,
      };

      instructionService.insertIngredientReference(
        editor,
        pendingReference.ingredient,
        percentage,
        fullRange
      );

      setPendingReference(null);
      return true;
    }

    return false;
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
    const storedInstructions = instructionService.getData() || [];
    if (storedInstructions.length > 0)
      setInstructionsGroup(storedInstructions as []);

    const storedIngredients = ingredientService.getData() || [];
    setIngredientUsages(storedIngredients);
  }, []);

  useEffect(() => {
    setEditors((prev) => {
      const newEditors = [...prev];
      while (newEditors.length < instructionsGroup.length) {
        newEditors.push(withInlines(withReact(createEditor())));
      }
      return newEditors;
    });
  }, [instructionsGroup.length]);

  useEffect(() => {
    return () => {
      if (pendingReference) clearTimeout(pendingReference.timeoutId);
    };
  }, [pendingReference]);

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
                  onChange={(newValue) =>
                    handleChangeWithDetection(editors[index], newValue, index)
                  }
                >
                  <Toolbar />
                  <Editable
                    renderElement={IngredientElement}
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
                    onKeyDown={(event) => onKeyDown(event, editors[index])}
                  />
                  {dropdownEditorIndex === index &&
                    targetRange &&
                    filteredIngredients.length > 0 && (
                      <ul className="absolute bg-white border border-gray-300 rounded shadow max-h-48 overflow-auto z-20">
                        {filteredIngredients.map((usage, i) => (
                          <li
                            key={usage.id}
                            className={`px-3 py-1 cursor-pointer ${
                              i === ingredientIndex
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-black'
                            }`}
                            onMouseDown={(e) => {
                              e.preventDefault(); // prevent editor blur
                              handleIngredientSelection(usage, editors[index]);
                            }}
                            onMouseEnter={() => setIngredientIndex(i)}
                          >
                            {usage.ingredient.title}
                          </li>
                        ))}
                      </ul>
                    )}
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
