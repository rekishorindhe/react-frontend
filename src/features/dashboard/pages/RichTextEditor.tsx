import React, { useCallback, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import FloatingMenu from "@tiptap/extension-floating-menu";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import {TextStyle} from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import {Table} from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import clsx from "clsx";
import { Button, theme } from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  CodeOutlined,
  LinkOutlined,
  PictureOutlined,
  CheckSquareOutlined,
  UndoOutlined,
  RedoOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import "highlight.js/styles/github-dark.css";

interface AdvancedEditorProps {
  value: string;
  onChange: (v: string) => void;
  dark?: boolean;
}

const AdvancedRichTextEditor: React.FC<AdvancedEditorProps> = ({
  value,
  onChange,
  dark = true,
}) => {
  const [isDark, setIsDark] = useState(dark);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // replaced with lowlight
      }),
      Underline,
      Highlight,
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false }),
      Placeholder.configure({
        placeholder: "Type / for commands...",
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      // SlashCommand (if you have tiptap-pro)
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const uploadImage = useCallback(async () => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result as string }).run();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className={clsx(
        "rounded-xl border p-2 transition-all duration-300",
        isDark
          ? "bg-transparent border-gray-700 text-gray-200"
          : "bg-white border-gray-300 text-black"
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-2">
        <Button
          icon={<BoldOutlined />}
          onClick={() => editor.chain().focus().toggleBold().run()}
          type={editor.isActive("bold") ? "primary" : "default"}
        />
        <Button
          icon={<ItalicOutlined />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          type={editor.isActive("italic") ? "primary" : "default"}
        />
        <Button
          icon={<UnderlineOutlined />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          type={editor.isActive("underline") ? "primary" : "default"}
        />
        <Button
          icon={<StrikethroughOutlined />}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          type={editor.isActive("strike") ? "primary" : "default"}
        />
        <Button
          icon={<CodeOutlined />}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          type={editor.isActive("codeBlock") ? "primary" : "default"}
        />
        <Button
          icon={<LinkOutlined />}
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          type={editor.isActive("link") ? "primary" : "default"}
        />
        <Button
          icon={<PictureOutlined />}
          onClick={uploadImage}
        />
        <Button
          icon={<CheckSquareOutlined />}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          type={editor.isActive("taskList") ? "primary" : "default"}
        />
        <Button
          icon={<UndoOutlined />}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <Button
          icon={<RedoOutlined />}
          onClick={() => editor.chain().focus().redo().run()}
        />
        <Button
          icon={<BulbOutlined />}
          onClick={() => setIsDark(!isDark)}
        >
          {isDark ? "Light" : "Dark"}
        </Button>
      </div>

      {/* Floating formatting menu */}
      {/* <BubbleMenu editor={editor} tippyOptions={{ duration: 150 }}>
        <div className="bg-gray-700 text-white rounded-lg px-2 py-1 flex gap-1">
          <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
        </div>
      </BubbleMenu> */}

      {/* Slash menu */}
      {/* <FloatingMenu editor={editor} tippyOptions={{ duration: 200 }}>
        <div className="bg-gray-800 text-white rounded-md p-2 shadow-lg">
          <p className="text-xs opacity-70 mb-1">Quick Insert</p>
          <button
            className="hover:bg-gray-700 w-full text-left px-2 py-1 rounded"
            onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
          >
            Heading 1
          </button>
          <button
            className="hover:bg-gray-700 w-full text-left px-2 py-1 rounded"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            Bullet List
          </button>
          <button
            className="hover:bg-gray-700 w-full text-left px-2 py-1 rounded"
            onClick={uploadImage}
          >
            Image
          </button>
        </div>
      </FloatingMenu> */}

      {/* Editor content */}
      <EditorContent
        editor={editor}
        className={clsx(
          "min-h-[300px] outline-none p-3 rounded-md",
          isDark ? "text-gray-200" : "text-black"
        )}
      />
    </div>
  );
};

export default AdvancedRichTextEditor;
