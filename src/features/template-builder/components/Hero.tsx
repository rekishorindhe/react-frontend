import { isValidHexColor, safeString } from "../../../utils";

export function Hero({
  title,
  subtitle,
  backgroundColor,
  key,
}: {
  title: string;
  subtitle: string;
  backgroundColor: string;
  key?: string;
}) {
  const validBgColor = isValidHexColor(backgroundColor) ? backgroundColor : "#007bff";
  return (
    <table
      key={key}
      role="presentation"
      width="100%"
      style={{ backgroundColor: validBgColor, borderCollapse: "collapse" }}
    >
      <tbody>
        <tr>
          <td style={{ textAlign: "center", padding: "28px 20px" }}>
            <h1
              style={{
                fontSize: "28px",
                color: "#ffffff",
                margin: 0,
                fontFamily: "'Arial', sans-serif",
              }}
            >
              {safeString(title)}
            </h1>
            <p
              style={{
                fontSize: "16px",
                color: "#ffffff",
                margin: "8px 0 0",
                fontFamily: "'Arial', sans-serif",
              }}
            >
              {safeString(subtitle)}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}