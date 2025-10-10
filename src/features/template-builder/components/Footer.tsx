import { isValidHexColor, safeString } from "../../../utils";

export function Footer({
  content,
  backgroundColor,
  key,
}: {
  content: string;
  backgroundColor: string;
  key?: string;
}) {
  const validBgColor = isValidHexColor(backgroundColor) ? backgroundColor : "#333333";
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
              textAlign: "center",
              padding: "18px 20px",
              fontSize: "12px",
              color: "#ffffff",
              fontFamily: "'Arial', sans-serif",
            }}
          >
            <p style={{ margin: 0 }}>{safeString(content)}</p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}