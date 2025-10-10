import { DropZone } from "@measured/puck";
import juice from "juice";
import { renderToStaticMarkup } from "react-dom/server";
import sanitizeHtml from "sanitize-html";
import { Hero } from "./Hero";
import { OTPBlock } from "./OTPBlock";
import { TextBlock, RichTextEditor } from "./TextBlock";
import { EmailButton } from "./EmailButton";
import { Spacer } from "./Spacer";
import { Footer } from "./Footer";
import { RowEditor } from "./RowEditor";
import { ColumnEditor } from "./ColumnEditor";
import { Image } from "./Image";
import { type PuckConfig, type PuckData } from "../types";
import { isValidHexColor, isValidUrl, safeString, safeTextToPlain, uid } from "../../../utils";

export const renderToHTML = (data: PuckData, config: PuckConfig) => {
  const renderComponentRecursive = (
    comp: PuckData["content"][0]
  ): React.ReactNode | null => {
    try {
      const compConfig = config.components[comp.type];
      if (!compConfig) {
        console.warn(`[renderToHTML] component ${comp.type} not found in config`);
        return null;
      }

      const props = {
        ...(compConfig.defaultProps || {}),
        ...(comp.props || {}),
        key: comp.props?.id || uid("comp"),
      };

      console.log(`[renderToHTML] Rendering ${comp.type} with props:`, props);

      Object.keys(props).forEach((key) => {
        if (props[key] === undefined || props[key] === null) {
          console.warn(
            `[renderToHTML] Undefined/null prop '${key}' in ${comp.type}, using fallback`
          );
          props[key] = compConfig.defaultProps?.[key] || "";
        }
      });

      if (
        comp.content &&
        Array.isArray(comp.content) &&
        comp.content.length > 0
      ) {
        props.children = comp.content
          .map((c) => renderComponentRecursive(c))
          .filter(Boolean);
      }

      return compConfig.render(props);
    } catch (err) {
      console.error(`[renderToHTML] Error rendering component ${comp.type}:`, err);
      return null;
    }
  };

  const rootChildren = (data.content || [])
    .map((c) => renderComponentRecursive(c))
    .filter(Boolean);

  const rootWidth = safeString(data.root?.props?.width, "600px");
  const rootElement = config.root.render({
    children: rootChildren,
    width: rootWidth,
  });

  const preheaderText = sanitizeHtml(safeString(data.preheader, ""), {
    allowedTags: [],
  });

  let html = `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Email</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f4f4f4; }
      table { borderCollapse: collapse; }
      img { border: 0; height: auto; lineHeight: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
      a { color: inherit; text-decoration: none; }
      p { margin: 0; }
      .stack-on-mobile:hover { background-color: inherit !important; }
      @media only screen and (max-width:600px) {
        .container { width: 100% !important; }
        .stack-column, .stack-column td { display: block !important; width: 100% !important; max-width: 100% !important; }
        .stack-on-mobile td { display: block !important; width: 100% !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f4;">
    <div style="display:none;max-height:0px;overflow:hidden;mso-hide:all;">${preheaderText}</div>
    <table role="presentation" class="container" align="center" width="${rootWidth}" style="width:${rootWidth};margin:0 auto;background-color:#ffffff;border-collapse:collapse;">
      <tbody>
        <tr>
          <td>
            ${renderToStaticMarkup(rootElement)}
          </td>
        </tr>
      </tbody>
    </table>
  </body>
  </html>
  `;

  console.log("[renderToHTML] Generated HTML before juice:", html);

  try {
    html = juice(html, {
      preserveImportant: true,
      webResources: { images: false },
      inlinePseudoElements: true,
      preserveFontFaces: true,
      preserveMediaQueries: true,
    });
    html = html.replace(/\s+/g, " ").replace(/> </g, "><").trim();
  } catch (err) {
    console.error("[renderToHTML] Error inlining CSS with juice:", err);
    throw err;
  }

  const plaintext = safeTextToPlain(html);

  return { html, plaintext, preheader: preheaderText };
};

export const buildConfig = (): PuckConfig => {
  const zoneA = uid("zone");
  const zoneB = uid("zone");
  const zoneC = uid("zone");

  return {
    components: {
      Hero: {
        fields: {
          title: { type: "text", label: "Title" },
          subtitle: { type: "text", label: "Subtitle" },
          backgroundColor: {
            type: "text",
            label: "Background Color (HEX)",
            placeholder: "#007bff",
            validate: (value: string) =>
              isValidHexColor(value) || "Invalid HEX color",
          },
        },
        defaultProps: {
          title: "Verify Your Account",
          subtitle: "Use the OTP below to complete your verification",
          backgroundColor: "#007bff",
        },
        render: ({ title, subtitle, backgroundColor, key }: any) => (
          <Hero
            key={key}
            title={safeString(title)}
            subtitle={safeString(subtitle)}
            backgroundColor={safeString(backgroundColor)}
          />
        ),
      },
      OTPBlock: {
        fields: {
          otpCode: { type: "text", label: "OTP Code", placeholder: "123456" },
        },
        defaultProps: {
          otpCode: "123456",
        },
        render: ({ otpCode, key }: any) => (
          <OTPBlock key={key} otpCode={safeString(otpCode)} />
        ),
      },
  
      Button: {
        fields: {
          text: { type: "text", label: "Button Text" },
          color: {
            type: "text",
            label: "Text Color (HEX)",
            placeholder: "#ffffff",
            validate: (value: string) =>
              isValidHexColor(value) || "Invalid HEX color",
          },
          backgroundColor: {
            type: "text",
            label: "Background Color (HEX)",
            placeholder: "#007bff",
            validate: (value: string) =>
              isValidHexColor(value) || "Invalid HEX color",
          },
          link: {
            type: "text",
            label: "Link URL",
            placeholder: "https://example.com/verify",
            validate: (value: string) => isValidUrl(value) || "Invalid URL",
          },
        },
        defaultProps: {
          text: "Verify Now",
          color: "#ffffff",
          backgroundColor: "#007bff",
          link: "https://example.com/verify",
        },
        render: ({ text, color, backgroundColor, link, key }: any) => (
          <EmailButton
            key={key}
            text={safeString(text)}
            color={safeString(color)}
            backgroundColor={safeString(backgroundColor)}
            link={safeString(link)}
          />
        ),
      },
      Spacer: {
        fields: {
          height: { type: "number", label: "Height (px)", min: 10, max: 200 },
        },
        defaultProps: {
          height: 20,
        },
        render: ({ height, key }: any) => (
          <Spacer key={key} height={height || 20} />
        ),
      },
      Footer: {
        fields: {
          content: { type: "text", label: "Footer Content" },
          backgroundColor: {
            type: "text",
            label: "Background Color (HEX)",
            placeholder: "#333333",
            validate: (value: string) =>
              isValidHexColor(value) || "Invalid HEX color",
          },
        },
        defaultProps: {
          content: "© 2025 Your Company. Contact us at support@example.com.",
          backgroundColor: "#333333",
        },
        render: ({ content, backgroundColor, key }: any) => (
          <Footer
            key={key}
            content={safeString(content)}
            backgroundColor={safeString(backgroundColor)}
          />
        ),
      },
      Row: {
        fields: {
          align: {
            type: "select",
            label: "Text Alignment",
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ],
          },
          backgroundColor: {
            type: "text",
            label: "Background Color (HEX)",
            placeholder: "#ffffff",
            validate: (value: string) => isValidHexColor(value) || "Invalid HEX color",
          },
          padding: {
            type: "number",
            label: "Padding (px)",
            min: 0,
            max: 50,
          },
          borderWidth: {
            type: "number",
            label: "Border Width (px)",
            min: 0,
            max: 5,
          },
          borderColor: {
            type: "text",
            label: "Border Color (HEX)",
            placeholder: "#000000",
            validate: (value: string) => isValidHexColor(value) || "Invalid HEX color",
          },
          borderStyle: {
            type: "select",
            label: "Border Style",
            options: [
              { value: "solid", label: "Solid" },
              { value: "dashed", label: "Dashed" },
              { value: "dotted", label: "Dotted" },
            ],
          },
          verticalAlign: {
            type: "select",
            label: "Vertical Alignment",
            options: [
              { value: "top", label: "Top" },
              { value: "middle", label: "Middle" },
              { value: "bottom", label: "Bottom" },
            ],
          },
          maxWidth: {
            type: "text",
            label: "Max Width (px or %)",
            placeholder: "100%",
            validate: (value: string) => /^(\d+%|\d+px)$/.test(value) || "Invalid width (e.g., 600px or 100%)",
          },
          margin: {
            type: "number",
            label: "Margin (px)",
            min: 0,
            max: 50,
          },
          backgroundImage: {
            type: "text",
            label: "Background Image URL",
            placeholder: "https://example.com/image.jpg",
            validate: (value: string) => !value || isValidUrl(value) || "Invalid URL",
          },
          stackOnMobile: {
            type: "radio",
            label: "Stack on Mobile",
            options: [
              { value: true, label: "Yes" },
              { value: false, label: "No" },
            ],
          },
          backgroundOpacity: {
            type: "number",
            label: "Background Opacity (0–1)",
            min: 0,
            max: 1,
            step: 0.1,
          },
          borderRadius: {
            type: "number",
            label: "Border Radius (px)",
            min: 0,
            max: 20,
          },
          boxShadow: {
            type: "select",
            label: "Box Shadow",
            options: [
              { value: "none", label: "None" },
              { value: "light", label: "Light" },
              { value: "medium", label: "Medium" },
            ],
          },
          minHeight: {
            type: "number",
            label: "Min Height (px)",
            min: 50,
            max: 500,
          },
          textColor: {
            type: "text",
            label: "Text Color (HEX)",
            placeholder: "#000000",
            validate: (value: string) => isValidHexColor(value) || "Invalid HEX color",
          },
          columnGap: {
            type: "number",
            label: "Column Gap (px)",
            min: 0,
            max: 50,
          },
          isVisible: {
            type: "radio",
            label: "Visibility",
            options: [
              { value: true, label: "Show" },
              { value: false, label: "Hide" },
            ],
          },
          zIndex: {
            type: "number",
            label: "Z-Index",
            min: 0,
            max: 100,
          },
          hoverBackgroundColor: {
            type: "text",
            label: "Hover Background Color (HEX)",
            placeholder: "#ffffff",
            validate: (value: string) => !value || isValidHexColor(value) || "Invalid HEX color",
          },
          customClass: {
            type: "text",
            label: "Custom Class",
            placeholder: "my-row",
            validate: (value: string) => !value || /^[a-zA-Z0-9_-]+$/.test(value) || "Invalid class name",
          },
        },
        defaultProps: {
          align: "left",
          backgroundColor: "#ffffff",
          padding: 0,
          borderWidth: 0,
          borderColor: "#000000",
          borderStyle: "solid",
          verticalAlign: "top",
          maxWidth: "100%",
          margin: 0,
          backgroundImage: "",
          stackOnMobile: true,
          backgroundOpacity: 1,
          borderRadius: 0,
          boxShadow: "none",
          minHeight: 50,
          textColor: "#000000",
          columnGap: 0,
          isVisible: true,
          zIndex: 0,
          hoverBackgroundColor: "",
          customClass: "",
        },
        render: ({
          children,
          align,
          backgroundColor,
          padding,
          borderWidth,
          borderColor,
          borderStyle,
          verticalAlign,
          maxWidth,
          margin,
          backgroundImage,
          stackOnMobile,
          backgroundOpacity,
          borderRadius,
          boxShadow,
          minHeight,
          textColor,
          columnGap,
          isVisible,
          zIndex,
          hoverBackgroundColor,
          customClass,
          key,
        }: any) => (
          <RowEditor
            key={key}
            align={align}
            backgroundColor={safeString(backgroundColor)}
            padding={padding}
            borderWidth={borderWidth}
            borderColor={safeString(borderColor)}
            borderStyle={borderStyle}
            verticalAlign={verticalAlign}
            maxWidth={safeString(maxWidth)}
            margin={margin}
            backgroundImage={safeString(backgroundImage)}
            stackOnMobile={stackOnMobile}
            backgroundOpacity={backgroundOpacity}
            borderRadius={borderRadius}
            boxShadow={boxShadow}
            minHeight={minHeight}
            textColor={safeString(textColor)}
            columnGap={columnGap}
            isVisible={isVisible}
            zIndex={zIndex}
            hoverBackgroundColor={safeString(hoverBackgroundColor)}
            customClass={safeString(customClass)}
          >
            {children}
          </RowEditor>
        ),
      },
      Column: {
        fields: {},
        defaultProps: {
          zoneId: zoneA,
        },
        render: ({ zoneId, key }: any) => (
          <ColumnEditor key={key} zoneId={safeString(zoneId, zoneA)} />
        ),
      },
      TwoColumn: {
        fields: {},
        defaultProps: {
          leftZone: zoneB,
          rightZone: zoneC,
        },
        render: ({ leftZone, rightZone, key }: any) => (
          <table
            key={key}
            role="presentation"
            width="100%"
            style={{ borderCollapse: "collapse" }}
          >
            <tbody>
              <tr>
                <td
                  width="50%"
                  className="stack-column"
                  style={{ verticalAlign: "top", padding: "10px" }}
                >
                  <DropZone zone={safeString(leftZone, zoneB)} />
                </td>
                <td
                  width="50%"
                  className="stack-column"
                  style={{ verticalAlign: "top", padding: "10px" }}
                >
                  <DropZone zone={safeString(rightZone, zoneC)} />
                </td>
              </tr>
            </tbody>
          </table>
        ),
      },
      ThreeColumn: {
        fields: {},
        defaultProps: {
          leftZone: zoneA,
          middleZone: zoneB,
          rightZone: zoneC,
        },
        render: ({ leftZone, middleZone, rightZone, key }: any) => (
          <table
            key={key}
            role="presentation"
            width="100%"
            style={{ borderCollapse: "collapse" }}
          >
            <tbody>
              <tr>
                <td
                  width="33.33%"
                  className="stack-column"
                  style={{ verticalAlign: "top", padding: "10px" }}
                >
                  <DropZone zone={safeString(leftZone, zoneA)} />
                </td>
                <td
                  width="33.33%"
                  className="stack-column"
                  style={{ verticalAlign: "top", padding: "10px" }}
                >
                  <DropZone zone={safeString(middleZone, zoneB)} />
                </td>
                <td
                  width="33.33%"
                  className="stack-column"
                  style={{ verticalAlign: "top", padding: "10px" }}
                >
                  <DropZone zone={safeString(rightZone, zoneC)} />
                </td>
              </tr>
            </tbody>
          </table>
        ),
      },
      Image: {
        fields: {
          src: { type: "text", label: "Image URL", validate: (value: string) => isValidUrl(value) || "Invalid URL" },
          alt: { type: "text", label: "Alt Text" },
          width: { type: "number", label: "Width (px)", min: 50, max: 600 },
          height: { type: "number", label: "Height (px)", min: 50, max: 600 },
          isVisible: { type: "radio", label: "Visibility", options: [{ value: true, label: "Show" }, { value: false, label: "Hide" }], defaultValue: true },
        },
        defaultProps: {
          src: "https://via.placeholder.com/600x200",
          alt: "Placeholder Image",
          width: 600,
          height: 200,
          isVisible: true,
        },
        render: Image,
      },
      Logo: {
        fields: {
          src: { type: "text", label: "Logo URL", validate: (value: string) => isValidUrl(value) || "Invalid URL" },
          alt: { type: "text", label: "Alt Text" },
          width: { type: "number", label: "Width (px)", min: 50, max: 300 },
          height: { type: "number", label: "Height (px)", min: 50, max: 300 },
          align: {
            type: "select",
            label: "Alignment",
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ],
          },
          link: { type: "text", label: "Link URL", validate: (value: string) => !value || isValidUrl(value) || "Invalid URL" },
        },
        defaultProps: {
          src: "https://via.placeholder.com/150x50",
          alt: "Company Logo",
          width: 150,
          height: 50,
          align: "center",
          link: "",
        },
        render: ({ src, alt, width, height, align, link, key }: any) => {
          const alignStyles: { [key: string]: string } = {
            left: "left",
            center: "center",
            right: "right",
          };
          const textAlign = alignStyles[align] || "center";

          return (
            <table
              key={key}
              role="presentation"
              width="100%"
              style={{ borderCollapse: "collapse" }}
              align={textAlign}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      textAlign,
                      padding: "10px",
                    }}
                  >
                    <table
                      role="presentation"
                      style={{
                        borderCollapse: "collapse",
                        margin: textAlign === "center" ? "0 auto" : textAlign === "right" ? "0 0 0 auto" : "0 auto 0 0",
                      }}
                      align={textAlign}
                    >
                      <tbody>
                        <tr>
                          <td>
                            {link ? (
                              <a href={safeString(link)}>
                                <img
                                  src={safeString(src)}
                                  alt={safeString(alt)}
                                  width={width || 150}
                                  height={height || 50}
                                  style={{
                                    display: "block",
                                    border: 0,
                                    margin: "0",
                                  }}
                                />
                              </a>
                            ) : (
                              <img
                                src={safeString(src)}
                                alt={safeString(alt)}
                                width={width || 150}
                                height={height || 50}
                                style={{
                                  display: "block",
                                  border: 0,
                                  margin: "0",
                                }}
                              />
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          );
        },
      },
      SocialMedia: {
        fields: {
          platforms: {
            type: "array",
            label: "Social Media Links",
            arrayFields: {
              platform: {
                type: "select",
                label: "Platform",
                options: [
                  { value: "facebook", label: "Facebook" },
                  { value: "twitter", label: "Twitter" },
                  { value: "linkedin", label: "LinkedIn" },
                  { value: "instagram", label: "Instagram" },
                ],
              },
              url: { type: "text", label: "URL", validate: (value: string) => isValidUrl(value) || "Invalid URL" },
            },
          },
          iconSize: { type: "number", label: "Icon Size (px)", min: 16, max: 48 },
          align: {
            type: "select",
            label: "Alignment",
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ],
          },
        },
        defaultProps: {
          platforms: [
            { platform: "facebook", url: "https://facebook.com" },
            { platform: "twitter", url: "https://twitter.com" },
          ],
          iconSize: 32,
          align: "center",
        },
        render: ({ platforms, iconSize, align, key }: any) => (
          <table
            key={key}
            role="presentation"
            width="100%"
            style={{ borderCollapse: "collapse" }}
          >
            <tbody>
              <tr>
                <td style={{ textAlign: safeString(align, "center") }}>
                  {platforms.map((p: any, i: number) => (
                    <a
                      key={i}
                      href={safeString(p.url)}
                      style={{ margin: "0 5px", display: "inline-block" }}
                    >
                      <img
                        src={`https://via.placeholder.com/${iconSize || 32}?text=${p.platform}`}
                        alt={p.platform}
                        width={iconSize || 32}
                        height={iconSize || 32}
                        style={{ display: "block", border: 0 }}
                      />
                    </a>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
        ),
      },
      Divider: {
        fields: {
          height: { type: "number", label: "Height (px)", min: 1, max: 10 },
          color: {
            type: "text",
            label: "Color (HEX)",
            placeholder: "#000000",
            validate: (value: string) => isValidHexColor(value) || "Invalid HEX color",
          },
          width: { type: "number", label: "Width (%)", min: 10, max: 100 },
        },
        defaultProps: {
          height: 2,
          color: "#000000",
          width: 100,
        },
        render: ({ height, color, width, key }: any) => (
          <table
            key={key}
            role="presentation"
            width={`${width || 100}%`}
            style={{ borderCollapse: "collapse", margin: "0 auto" }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    height: `${height || 2}px`,
                    backgroundColor: safeString(color, "#000000"),
                  }}
                ></td>
              </tr>
            </tbody>
          </table>
        ),
      },
      Video: {
        fields: {
          thumbnail: { type: "text", label: "Thumbnail URL", validate: (value: string) => isValidUrl(value) || "Invalid URL" },
          videoUrl: { type: "text", label: "Video URL", validate: (value: string) => isValidUrl(value) || "Invalid URL" },
          alt: { type: "text", label: "Alt Text" },
          width: { type: "number", label: "Width (px)", min: 100, max: 600 },
        },
        defaultProps: {
          thumbnail: "https://via.placeholder.com/600x300",
          videoUrl: "https://example.com/video",
          alt: "Video Thumbnail",
          width: 600,
        },
        render: ({ thumbnail, videoUrl, alt, width, key }: any) => (
          <table
            key={key}
            role="presentation"
            width="100%"
            style={{ borderCollapse: "collapse" }}
          >
            <tbody>
              <tr>
                <td style={{ textAlign: "center" }}>
                  <a href={safeString(videoUrl)}>
                    <img
                      src={safeString(thumbnail)}
                      alt={safeString(alt)}
                      width={width || 600}
                      style={{ display: "block", border: 0 }}
                    />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        ),
      },
      Testimonial: {
        fields: {
          quote: { type: "text", label: "Quote" },
          author: { type: "text", label: "Author" },
          backgroundColor: {
            type: "text",
            label: "Background Color (HEX)",
            placeholder: "#f9f9f9",
            validate: (value: string) => isValidHexColor(value) || "Invalid HEX color",
          },
          textColor: {
            type: "text",
            label: "Text Color (HEX)",
            placeholder: "#000000",
            validate: (value: string) => isValidHexColor(value) || "Invalid HEX color",
          },
        },
        defaultProps: {
          quote: "This product changed my life!",
          author: "John Doe",
          backgroundColor: "#f9f9f9",
          textColor: "#000000",
        },
        render: ({ quote, author, backgroundColor, textColor, key }: any) => (
          <table
            key={key}
            role="presentation"
            width="100%"
            style={{
              borderCollapse: "collapse",
              backgroundColor: safeString(backgroundColor, "#f9f9f9"),
              padding: "20px",
            }}
          >
            <tbody>
              <tr>
                <td style={{ color: safeString(textColor, "#000000"), padding: "20px" }}>
                  <p style={{ fontStyle: "italic" }}>{safeString(quote)}</p>
                  <p style={{ fontWeight: "bold", marginTop: "10px" }}>- {safeString(author)}</p>
                </td>
              </tr>
            </tbody>
          </table>
        ),
      },
      Countdown: {
        fields: {
          deadline: { type: "text", label: "Deadline (YYYY-MM-DD HH:MM)", placeholder: "2025-12-31 23:59" },
          text: { type: "text", label: "Countdown Text" },
          textColor: {
            type: "text",
            label: "Text Color (HEX)",
            placeholder: "#000000",
            validate: (value: string) => isValidHexColor(value) || "Invalid HEX color",
          },
        },
        defaultProps: {
          deadline: "2025-12-31 23:59",
          text: "Hurry! Offer ends soon!",
          textColor: "#000000",
        },
        render: ({ deadline, text, textColor, key }: any) => (
          <table
            key={key}
            role="presentation"
            width="100%"
            style={{ borderCollapse: "collapse", textAlign: "center" }}
          >
            <tbody>
              <tr>
                <td style={{ padding: "20px", color: safeString(textColor, "#000000") }}>
                  <p>{safeString(text)}</p>
                  <img
                    src={`https://via.placeholder.com/300x50?text=Countdown+to+${encodeURIComponent(safeString(deadline))}`}
                    alt="Countdown Timer"
                    style={{ display: "block", margin: "10px auto", border: 0 }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        ),
      },
      Header: {
        fields: {
          text: { type: "text", label: "Header Text" },
          backgroundColor: {
            type: "text",
            label: "Background Color (HEX)",
            placeholder: "#ffffff",
            validate: (value: string) => isValidHexColor(value) || "Invalid HEX color",
          },
          textColor: {
            type: "text",
            label: "Text Color (HEX)",
            placeholder: "#000000",
            validate: (value: string) => isValidHexColor(value) || "Invalid HEX color",
          },
          fontSize: { type: "number", label: "Font Size (px)", min: 16, max: 48 },
        },
        defaultProps: {
          text: "Welcome to Our Newsletter",
          backgroundColor: "#ffffff",
          textColor: "#000000",
          fontSize: 24,
        },
        render: ({ text, backgroundColor, textColor, fontSize, key }: any) => (
          <table
            key={key}
            role="presentation"
            width="100%"
            style={{
              borderCollapse: "collapse",
              backgroundColor: safeString(backgroundColor, "#ffffff"),
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    color: safeString(textColor, "#000000"),
                    fontSize: `${fontSize || 24}px`,
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  {safeString(text)}
                </td>
              </tr>
            </tbody>
          </table>
        ),
      },
      CTA: {
        fields: {
          text: { type: "text", label: "CTA Text" },
          link: { type: "text", label: "Link URL", validate: (value: string) => isValidUrl(value) || "Invalid URL" },
          backgroundColor: {
            type: "text",
            label: "Background Color (HEX)",
            placeholder: "#ff4500",
            validate: (value: string) => isValidHexColor(value) || "Invalid HEX color",
          },
          textColor: {
            type: "text",
            label: "Text Color (HEX)",
            placeholder: "#ffffff",
            validate: (value: string) => isValidHexColor(value) || "Invalid HEX color",
          },
          borderRadius: { type: "number", label: "Border Radius (px)", min: 0, max: 20 },
        },
        defaultProps: {
          text: "Shop Now",
          link: "https://example.com/shop",
          backgroundColor: "#ff4500",
          textColor: "#ffffff",
          borderRadius: 5,
        },
        render: ({ text, link, backgroundColor, textColor, borderRadius, key }: any) => (
          <table
            key={key}
            role="presentation"
            width="100%"
            style={{ borderCollapse: "collapse" }}
          >
            <tbody>
              <tr>
                <td style={{ textAlign: "center", padding: "20px" }}>
                  <a
                    href={safeString(link)}
                    style={{
                      backgroundColor: safeString(backgroundColor, "#ff4500"),
                      color: safeString(textColor, "#ffffff"),
                      padding: "15px 30px",
                      borderRadius: `${borderRadius || 5}px`,
                      display: "inline-block",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    {safeString(text)}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        ),
      },
      Accordion: {
        fields: {
          items: {
            type: "array",
            label: "Accordion Items",
            arrayFields: {
              title: { type: "text", label: "Title" },
              content: { type: "text", label: "Content" },
            },
          },
          backgroundColor: {
            type: "text",
            label: "Background Color (HEX)",
            placeholder: "#ffffff",
            validate: (value: string) => isValidHexColor(value) || "Invalid HEX color",
          },
        },
        defaultProps: {
          items: [
            { title: "Question 1", content: "Answer to question 1." },
            { title: "Question 2", content: "Answer to question 2." },
          ],
          backgroundColor: "#ffffff",
        },
        render: ({ items, backgroundColor, key }: any) => (
          <table
            key={key}
            role="presentation"
            width="100%"
            style={{
              borderCollapse: "collapse",
              backgroundColor: safeString(backgroundColor, "#ffffff"),
            }}
          >
            <tbody>
              {items.map((item: any, i: number) => (
                <tr key={i}>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    <strong>{safeString(item.title)}</strong>
                    <p>{safeString(item.content)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ),
      },
      DynamicContent: {
        fields: {
          placeholder: { type: "text", label: "Placeholder (e.g., {{user_name}})" },
          fallback: { type: "text", label: "Fallback Text" },
          textColor: {
            type: "text",
            label: "Text Color (HEX)",
            placeholder: "#000000",
            validate: (value: string) => isValidHexColor(value) || "Invalid HEX color",
          },
        },
        defaultProps: {
          placeholder: "{{user_name}}",
          fallback: "Customer",
          textColor: "#000000",
        },
        render: ({ placeholder, fallback, textColor, key }: any) => (
          <table
            key={key}
            role="presentation"
            width="100%"
            style={{ borderCollapse: "collapse" }}
          >
            <tbody>
              <tr>
                <td style={{ color: safeString(textColor, "#000000"), padding: "10px", textAlign: "center" }}>
                  {safeString(placeholder, fallback)}
                </td>
              </tr>
            </tbody>
          </table>
        ),
      },
    },
    root: {
      fields: {
        width: {
          type: "text",
          label: "Container Width (px)",
          placeholder: "600",
        },
      },
      defaultProps: { props: { width: "600px" } },
      render: ({
        children,
        width,
      }: {
        children: React.ReactNode;
        width?: string;
      }) => (
        <table
          role="presentation"
          width={safeString(width, "600")}
          style={{
            width: safeString(width, "600px"),
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td>{children}</td>
            </tr>
          </tbody>
        </table>
      ),
    },
  };
};

export const initialData: PuckData = {
  preheader: "Enter the OTP to finish signing in. Valid for 10 minutes.",
  root: { props: { width: "600px" } },
  content: [],
};