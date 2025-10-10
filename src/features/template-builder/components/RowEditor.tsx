import { type ReactNode } from "react";
import { isValidHexColor, isValidUrl, safeString } from "../../../utils";

export function RowEditor({
  children,
  align = "left",
  backgroundColor = "#ffffff",
  padding = 0,
  borderWidth = 0,
  borderColor = "#000000",
  borderStyle = "solid",
  verticalAlign = "top",
  maxWidth = "100%",
  margin = 0,
  backgroundImage = "",
  stackOnMobile = true,
  backgroundOpacity = 1,
  borderRadius = 0,
  boxShadow = "none",
  minHeight = 50,
  textColor = "#000000",
  columnGap = 0,
  isVisible = true,
  zIndex = 0,
  hoverBackgroundColor = "",
  customClass = "",
  key,
}: {
  children: ReactNode;
  align?: "left" | "center" | "right";
  backgroundColor?: string;
  padding?: number;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: "solid" | "dashed" | "dotted";
  verticalAlign?: "top" | "middle" | "bottom";
  maxWidth?: string;
  margin?: number;
  backgroundImage?: string;
  stackOnMobile?: boolean;
  backgroundOpacity?: number;
  borderRadius?: number;
  boxShadow?: "none" | "light" | "medium";
  minHeight?: number;
  textColor?: string;
  columnGap?: number;
  isVisible?: boolean;
  zIndex?: number;
  hoverBackgroundColor?: string;
  customClass?: string;
  key?: string;
}) {
  if (!isVisible) return null;

  const validBgColor = isValidHexColor(backgroundColor) ? backgroundColor : "#ffffff";
  const validPadding = Math.max(0, Math.min(padding, 50));
  const validBorderWidth = Math.max(0, Math.min(borderWidth, 5));
  const validBorderColor = isValidHexColor(borderColor) ? borderColor : "#000000";
  const validBorderStyle = ["solid", "dashed", "dotted"].includes(borderStyle) ? borderStyle : "solid";
  const validVerticalAlign = ["top", "middle", "bottom"].includes(verticalAlign) ? verticalAlign : "top";
  const validMaxWidth = /^(\d+%|\d+px)$/.test(maxWidth) ? maxWidth : "100%";
  const validMargin = Math.max(0, Math.min(margin, 50));
  const validBgImage = isValidUrl(backgroundImage) ? `url(${backgroundImage})` : "none";
  const validOpacity = Math.max(0, Math.min(backgroundOpacity, 1));
  const validBorderRadius = Math.max(0, Math.min(borderRadius, 20));
  const validBoxShadow =
    boxShadow === "light" ? "0 1px 3px rgba(0,0,0,0.1)" :
    boxShadow === "medium" ? "0 2px 5px rgba(0,0,0,0.2)" : "none";
  const validMinHeight = Math.max(50, Math.min(minHeight, 500));
  const validTextColor = isValidHexColor(textColor) ? textColor : "#000000";
  const validColumnGap = Math.max(0, Math.min(columnGap, 50));
  const validZIndex = Math.max(0, Math.min(zIndex, 100));
  const validHoverBgColor = isValidHexColor(hoverBackgroundColor) ? hoverBackgroundColor : validBgColor;
  const validCustomClass = safeString(customClass).replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <table
      key={key}
      role="presentation"
      width="100%"
      style={{
        borderCollapse: "collapse",
        textAlign: align,
        backgroundColor: validBgColor,
        opacity: validOpacity,
        padding: `${validPadding}px`,
        border: validBorderWidth ? `${validBorderWidth}px ${validBorderStyle} ${validBorderColor}` : "none",
        borderRadius: `${validBorderRadius}px`,
        boxShadow: validBoxShadow,
        verticalAlign: validVerticalAlign,
        maxWidth: validMaxWidth,
        margin: `${validMargin}px auto`,
        backgroundImage: validBgImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: `${validMinHeight}px`,
        color: validTextColor,
        zIndex: validZIndex,
      }}
      className={`${stackOnMobile ? "stack-on-mobile" : ""} ${validCustomClass}`}
    >
      <tbody>
        <tr style={{ columnGap: `${validColumnGap}px` }}>{children}</tr>
      </tbody>
    </table>
  );
}