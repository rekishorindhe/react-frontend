import { DropZone } from "@measured/puck";
import { safeString } from "../../../utils";

export function ColumnEditor({ zoneId, key }: { zoneId: string; key?: string }) {
  return (
    <td key={key} style={{ verticalAlign: "top", padding: "10px" }}>
      <DropZone zone={safeString(zoneId)} />
    </td>
  );
}