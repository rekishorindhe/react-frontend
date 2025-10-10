import { safeString } from "../../../utils";

export function Image({ src, alt, width, height, isVisible, key }: { src: string; alt: string; width: number; height: number; isVisible: boolean; key?: string }) {
  if (!isVisible) return null;
  return (
    <table key={key} role="presentation" width="100%" style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td style={{ textAlign: "center", padding: "20px" }}>
            <img
              src={safeString(src)}
              alt={safeString(alt)}
              width={Math.min(width || 600, 600)}
              height={Math.min(height || 200, 600)}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}