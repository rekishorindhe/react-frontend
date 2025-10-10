import { safeString } from "../../../utils";

export function OTPBlock({ otpCode, key }: { otpCode: string; key?: string }) {
  return (
    <table
      key={key}
      role="presentation"
      width="100%"
      style={{ borderCollapse: "collapse" }}
    >
      <tbody>
        <tr>
          <td style={{ textAlign: "center", padding: "20px" }}>
            <p
              style={{
                fontSize: "16px",
                color: "#333333",
                margin: "0 0 10px",
                fontFamily: "'Arial', sans-serif",
              }}
            >
              Your One-Time Password (OTP):
            </p>
            <div
              style={{
                display: "inline-block",
                padding: "10px 20px",
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
                fontSize: "24px",
                fontWeight: 700,
                color: "#000000",
                letterSpacing: "2px",
                fontFamily: "'Arial', sans-serif",
              }}
            >
              {safeString(otpCode)}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}