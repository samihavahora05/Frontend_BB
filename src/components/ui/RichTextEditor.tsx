import { useState, useCallback, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Link2, Image as ImageIcon, List, ListOrdered, Quote, AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Undo, Redo, Type, Minus } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

export interface RichTextEditorRef {
  insertContent: (text: string) => void;
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(({ value, onChange, placeholder = "Start writing...", minHeight = "500px", onImageUpload }, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none min-h-[500px] focus:outline-none text-left editor-force-defaults',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      if (!editor.isFocused) {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  useImperativeHandle(ref, () => ({
    insertContent: (text: string) => {
      if (editor) {
        editor.chain().focus().insertContent(text).run();
      }
    }
  }));

  const handleInsertLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const handleInsertImage = async () => {
    if (onImageUpload && fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      const url = prompt("Enter image URL:", "https://");
      if (url && editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload && editor) {
      const toastId = (window as any).toast?.loading?.("Uploading image...") || "img-upload";
      try {
        const url = await onImageUpload(file);
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
        (window as any).toast?.success?.("Image uploaded", { id: toastId });
      } catch (err) {
        console.error("Image upload failed", err);
        (window as any).toast?.error?.("Upload failed", { id: toastId });
      }
    }
    if (e.target) e.target.value = "";
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!editor || !mounted) {
    return (
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col justify-center items-center" style={{ minHeight }}>
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-[#1B2A6B] rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-400">Loading editor...</span>
        </div>
      </div>
    );
  }

  const ToolbarButton = ({ onClick, isActive, icon: Icon, label }: any) => (
    <button
      onClick={onClick}
      title={label}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-xs ${
        isActive ? 'bg-[#1B2A6B] text-white' : 'text-slate-600 hover:bg-slate-200 hover:text-[#1B2A6B]'
      }`}
    >
      <Icon size={15} />
    </button>
  );

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} isActive={false} icon={Undo} label="Undo" />
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} isActive={false} icon={Redo} label="Redo" />
          <div className="w-px h-5 bg-slate-300 mx-1" />
          
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} icon={Heading1} label="Heading 1" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={Heading2} label="Heading 2" />
          <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} isActive={editor.isActive('paragraph')} icon={Type} label="Paragraph" />
          <div className="w-px h-5 bg-slate-300 mx-1" />

          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} label="Bold" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} label="Italic" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={UnderlineIcon} label="Underline" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} icon={Strikethrough} label="Strikethrough" />
          <div className="w-px h-5 bg-slate-300 mx-1" />

          <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={Code} label="Code Block" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Quote} label="Blockquote" />
          <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} isActive={false} icon={Minus} label="Divider" />
          <div className="w-px h-5 bg-slate-300 mx-1" />

          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} label="Bullet List" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} label="Numbered List" />
          <div className="w-px h-5 bg-slate-300 mx-1" />

          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} label="Align Left" />
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} label="Align Center" />
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={AlignRight} label="Align Right" />
          <div className="w-px h-5 bg-slate-300 mx-1" />

          <ToolbarButton onClick={handleInsertLink} isActive={editor.isActive('link')} icon={Link2} label="Insert Link" />
          <ToolbarButton onClick={handleInsertImage} isActive={editor.isActive('image')} icon={ImageIcon} label="Insert Image" />
        </div>
      
      {/* Editor Content Container */}
      <div className="flex-1 overflow-y-auto" style={{ minHeight }}>
        <div className="p-6 cursor-text" onClick={() => editor.chain().focus().run()}>
          <EditorContent editor={editor} />
        </div>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

      {/* Footer */}
      <div className="border-t border-slate-100 px-4 py-2 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-400">
        <span>Tiptap Editor · Markdown supported</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block"></span>
          Auto-save enabled
        </span>
      </div>

      <style>{`
        /* Force Editor Defaults */
        .editor-force-defaults, .editor-force-defaults *, .ProseMirror, .ProseMirror * {
          direction: ltr !important;
          writing-mode: horizontal-tb !important;
          text-align: left !important;
          unicode-bidi: normal !important;
          white-space: pre-wrap !important;
          word-break: break-word !important;
          overflow-wrap: anywhere !important;
        }

        .ProseMirror {
          min-height: 500px;
          outline: none !important;
          direction: ltr !important;
          text-align: left !important;
          caret-color: currentColor !important;
        }

        /* Tiptap Placeholder */
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #94a3b8;
          pointer-events: none;
          height: 0;
        }

        /* Tiptap Default Styles */
        .ProseMirror h1 { font-size: 1.875rem; font-weight: 900; color: #0f172a; margin: 1rem 0 0.5rem; }
        .ProseMirror h2 { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin: 0.75rem 0 0.5rem; }
        .ProseMirror blockquote { border-left: 4px solid #C9A227; padding-left: 1rem; color: #64748b; font-style: italic; margin: 0.75rem 0; }
        .ProseMirror pre { background: #0f172a; color: #e2e8f0; padding: 1rem; border-radius: 0.75rem; font-family: monospace; margin: 0.75rem 0; }
        .ProseMirror ul, .ProseMirror ol { padding-left: 1.5rem; margin: 0.5rem 0; }
        .ProseMirror ul { list-style-type: disc; }
        .ProseMirror ol { list-style-type: decimal; }
        .ProseMirror a { color: #1B2A6B; text-decoration: underline; cursor: pointer; }
        .ProseMirror img { max-width: 100%; border-radius: 0.75rem; margin: 0.75rem 0; }
        .ProseMirror hr { border: 1px dashed #e2e8f0; margin: 1rem 0; }
        
        /* Remove Tailwind Prose constraints that might mess up Tiptap */
        .prose :where(p):not(:where([class~="not-prose"] *)) {
            margin-top: 0.5em;
            margin-bottom: 0.5em;
        }
      `}</style>
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';
