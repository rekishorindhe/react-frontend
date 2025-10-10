import { isValidHexColor, isValidUrl, safeString } from "../../../utils";

export function EmailButton({
  text,
  color,
  backgroundColor,
  link,
  key,
}: {
  text: string;
  color: string;
  backgroundColor: string;
  link: string;
  key?: string;
}) {
  const validColor = isValidHexColor(color) ? color : "#ffffff";
  const validBgColor = isValidHexColor(backgroundColor) ? backgroundColor : "#007bff";
  const validLink = isValidUrl(link) ? link : "#";
  const sanitizedText = safeString(text, "Button");
  const sanitizedLink = safeString(validLink, "#");
  const vml = `
  <!--[if mso]>
  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${sanitizedLink}" style="height:40px;v-text-anchor:middle;width:200px;" arcsize="8%" strokecolor="${validBgColor}" fillcolor="${validBgColor}">
    <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <center style="color:${validColor};font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">
        ${sanitizedText}
      </center>
    </v:textbox>
  </v:roundrect>
  <![endif]-->
  `;

  return (
    <table
      key={key}
      role="presentation"
      style={{ margin: "0 auto", borderCollapse: "collapse" }}
    >
      <tbody>
        <tr>
          <td>
            <a
              href={validLink}
              style={{
                display: "inline-block",
                padding: "12px 24px",
                backgroundColor: validBgColor,
                color: validColor,
                textDecoration: "none",
                borderRadius: "4px",
                fontWeight: 700,
                fontSize: "16px",
                fontFamily: "'Arial', sans-serif",
              }}
              aria-label={sanitizedText}
            >
              {sanitizedText}
            </a>
          </td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td dangerouslySetInnerHTML={{ __html: vml }} />
        </tr>
      </tbody>
    </table>
  );
}