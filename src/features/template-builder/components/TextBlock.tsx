import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import sanitizeHtml from "sanitize-html";
import { isValidHexColor, isValidUrl } from "../../../utils";

const RichTextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          style: "color: inherit; text-decoration: underline;",
        },
      }),
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      TextAlign.configure({
        types: ["paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      FontFamily.configure({ types: ["textStyle"] }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const fontOptions = [
    { value: "Arial, sans-serif", label: "Arial" },
    { value: "Helvetica, sans-serif", label: "Helvetica" },
    { value: "Times New Roman, serif", label: "Times New Roman" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "Verdana, sans-serif", label: "Verdana" },
  ];

  const fontSizeOptions = ["12px", "14px", "16px", "18px", "20px", "24px"];

  return (
    <div style={{ border: "1px solid #e6e6e6", borderRadius: 4, padding: 8 }}>
      <div
        style={{ marginBottom: 8, display: "flex", gap: 8, flexWrap: "wrap" }}
      >
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          style={{
            padding: "4px 8px",
            background: editor?.isActive("bold") ? "#007bff" : "#f0f0f0",
            color: editor?.isActive("bold") ? "#ffffff" : "#333",
            border: "1px solid #ccc",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          style={{
            padding: "4px 8px",
            background: editor?.isActive("italic") ? "#007bff" : "#f0f0f0",
            color: editor?.isActive("italic") ? "#ffffff" : "#333",
            border: "1px solid #ccc",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          style={{
            padding: "4px 8px",
            background: editor?.isActive("underline") ? "#007bff" : "#f0f0f0",
            color: editor?.isActive("underline") ? "#ffffff" : "#333",
            border: "1px solid #ccc",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Underline
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url && isValidUrl(url)) {
              editor?.chain().focus().setLink({ href: url }).run();
            } else {
              editor?.chain().focus().unsetLink().run();
            }
          }}
          style={{
            padding: "4px 8px",
            background: editor?.isActive("link") ? "#007bff" : "#f0f0f0",
            color: editor?.isActive("link") ? "#ffffff" : "#333",
            border: "1px solid #ccc",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Link
        </button>
        <input
          type="color"
          onChange={(e) =>
            editor?.chain().focus().setColor(e.target.value).run()
          }
          value={editor?.getAttributes("textStyle").color || "#000000"}
          style={{
            width: 32,
            height: 32,
            border: "1px solid #ccc",
            borderRadius: 4,
            cursor: "pointer",
          }}
        />
        <select
          onChange={(e) =>
            editor?.chain().focus().setTextAlign(e.target.value).run()
          }
          value={editor?.getAttributes("paragraph").textAlign || "left"}
          style={{
            padding: "4px 8px",
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
        <select
          onChange={(e) =>
            editor?.chain().focus().setFontFamily(e.target.value).run()
          }
          value={
            editor?.getAttributes("textStyle").fontFamily || "Arial, sans-serif"
          }
          style={{
            padding: "4px 8px",
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        >
          {fontOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          onChange={(e) =>
            editor?.chain().focus().setFontSize(e.target.value).run()
          }
          value={editor?.getAttributes("textStyle").fontSize || "16px"}
          style={{
            padding: "4px 8px",
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        >
          {fontSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .unsetAllMarks()
              .setTextAlign("left")
              .setFontFamily("Arial, sans-serif")
              .run()
          }
          style={{
            padding: "4px 8px",
            background: "#f0f0f0",
            color: "#333",
            border: "1px solid #ccc",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>
      <EditorContent
        editor={editor}
        style={{
          minHeight: 100,
          border: "1px solid #ccc",
          padding: 8,
          borderRadius: 4,
        }}
      />
    </div>
  );
};

export function TextBlock({
  content,
  backgroundColor,
  key,
}: {
  content: string;
  backgroundColor: string;
  key?: string;
}) {
  const validBgColor = isValidHexColor(backgroundColor)
    ? backgroundColor
    : "#000000";
  console.log("[renderToHTML] Rendering text block with content:", content);
  const sanitizedContent = sanitizeHtml(content, {
    allowedTags: ["p", "strong", "em", "u", "a", "span"],
    allowedAttributes: {
      a: ["href", "style"],
      span: ["style"],
      p: ["style"],
    },
    allowedStyles: {
      "*": {
        color: [
          /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
          /^rgba?\(\s*(\d{1,3}\s*,\s*){2}\d{1,3}\s*(,\s*(0|1|0?\.\d+))?\s*\)$/,
        ],
        "text-decoration": [/^underline$/],
        "text-align": [/^(left|center|right|justify)$/],
        "font-family": [
          /^(Arial|Helvetica|Times New Roman|Georgia|Verdana), ?(sans-serif|serif)$/,
        ],
        "font-size": [/^\d{1,2}px$/],
      },
    },
  });

  return (
    <table
      key={key}
      role="presentation"
      width="100%"
      style={{ backgroundColor: validBgColor, borderCollapse: "collapse" }}
    >
      <tbody>
        <tr>
          <td
            style={{
              padding: "20px",
              fontSize: "16px",
              lineHeight: "1.5",
              fontFamily: "'Arial', sans-serif",
              color: "#000000",
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export { RichTextEditor };
