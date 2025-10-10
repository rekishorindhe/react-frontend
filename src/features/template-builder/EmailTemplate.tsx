import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { saveAs } from "file-saver";
import { useCallback, useMemo, type JSX, type ReactNode } from "react";
import { type PuckData } from "./types";
import { buildConfig, initialData, renderToHTML } from "./components/editorConfig";

export default function EmailTemplate(): JSX.Element {
  const config = useMemo(() => buildConfig(), []);

  const handleExport = useCallback(
    (data: PuckData) => {
      try {
        console.log(
          "[OTPEmailEditor] Export data:",
          JSON.stringify(data, null, 2)
        );
        const timestamp = Date.now().toString(36);
        const { html, plaintext, preheader } = renderToHTML(data, config);

        const blobHtml = new Blob([html], { type: "text/html;charset=utf-8" });
        saveAs(blobHtml, `otp-email-template-${timestamp}.html`);

        const blobText = new Blob([plaintext], {
          type: "text/plain;charset=utf-8",
        });
        saveAs(blobText, `otp-email-template-${timestamp}.txt`);

        console.log("[OTPEmailEditor] Generated HTML:", html);
        console.log("[OTPEmailEditor] Plaintext:", plaintext);
        console.log("[OTPEmailEditor] Preheader:", preheader);

        alert("Exported HTML and plaintext. Check downloads.");
      } catch (err) {
        console.error("[OTPEmailEditor] Export failed:", err);
        alert("Export failed. See console for details.");
      }
    },
    [config]
  );

  const iframeOverride = ({ children }: { children: ReactNode }) => (
    <div
      style={{
        maxWidth: 640,
        margin: "24px auto",
        backgroundColor: "#f5f5f5",
        padding: 20,
        borderRadius: 8,
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "12px 16px",
            borderBottom: "1px solid #eee",
          }}
        >
          <strong style={{ fontFamily: "Arial, sans-serif" }}>
            OTP Email Preview
          </strong>
        </div>
        <div style={{ background: "#ffffff" }}>{children}</div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ margin: "12px 0" }}>Advanced OTP Email Editor</h2>
      <p style={{ marginTop: 0, color: "#444" }}>
        Drag blocks from the left, edit properties on the right (rich text with
        bold, italic, underline, links, color, alignment, font, and size). Click
        Publish to export HTML + plaintext.
      </p>
      <div
        style={{
          border: "1px solid #e6e6e6",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <Puck
          config={config}
          data={initialData}
          onPublish={handleExport}
          overrides={{ iframe: iframeOverride }}
        />
      </div>
    </div>
  );
}