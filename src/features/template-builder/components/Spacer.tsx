export function Spacer({ height, key }: { height: number; key?: string }) {
  const validHeight = Math.max(10, Math.min(height || 20, 200));
  return (
    <table
      key={key}
      role="presentation"
      width="100%"
      style={{ borderCollapse: "collapse" }}
    >
      <tbody>
        <tr>
          <td
            style={{
              height: `${validHeight}px`,
              lineHeight: `${validHeight}px`,
              fontSize: "1px",
            }}
          >
            &nbsp;
          </td>
        </tr>
      </tbody>
    </table>
  );
}