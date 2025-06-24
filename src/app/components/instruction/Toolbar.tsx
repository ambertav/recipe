
import { useRef, useEffect } from 'react';
import { Editor, Range } from 'slate';
import { useSlate, useFocused } from 'slate-react';

import { toggleMark,  } from '@/utils/editor';

import { CustomTextKey } from '@/types';

export default function Toolbar ()  {
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
      onMouseDown={(e) => { e.preventDefault(); }}
    >
      <FormatButton format="bold" icon="B" />
      <FormatButton format="italic" icon="I" />
      <FormatButton format="underline" icon="U" />
    </div>
  );
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