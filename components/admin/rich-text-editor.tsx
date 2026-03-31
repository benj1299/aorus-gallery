'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Link as LinkIcon, Undo, Redo } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RichTextEditorProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}

export function RichTextEditor({ name, defaultValue = '', placeholder }: RichTextEditorProps) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? '',
      }),
    ],
    content: defaultValue,
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && defaultValue && !editor.getText().trim()) {
      editor.commands.setContent(defaultValue);
    }
  }, [editor, defaultValue]);

  const toggleLink = () => {
    if (!editor) return;

    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const url = window.prompt('URL:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className="tiptap-editor">
      <style>{`
        .tiptap-editor .ProseMirror {
          min-height: 120px;
          padding: 12px;
          outline: none;
        }
        .tiptap-editor .ProseMirror p {
          margin-bottom: 0.5em;
        }
        .tiptap-editor .ProseMirror a {
          color: #4BAF91;
          text-decoration: underline;
        }
        .tiptap-editor .ProseMirror strong {
          font-weight: 600;
        }
        .tiptap-editor .ProseMirror .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
      `}</style>

      {editor && (
        <div className="flex items-center gap-1 border border-gray-300 border-b-0 rounded-t-md bg-gray-50 px-2 py-1.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`flex items-center justify-center h-8 w-8 rounded ${
              editor.isActive('bold')
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`flex items-center justify-center h-8 w-8 rounded ${
              editor.isActive('italic')
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleLink}
            className={`flex items-center justify-center h-8 w-8 rounded ${
              editor.isActive('link')
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="flex items-center justify-center h-8 w-8 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="flex items-center justify-center h-8 w-8 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="border border-gray-300 rounded-b-md bg-white">
        <EditorContent editor={editor} />
      </div>

      <input type="hidden" name={name} value={html} />
    </div>
  );
}
