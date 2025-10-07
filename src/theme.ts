// theme.js
import { theme as antdTheme } from 'antd';

const darkTheme = {
  // Set darkAlgorithm as the default
  algorithm: antdTheme.darkAlgorithm,

  // Seed Tokens: Mimic Shadcn's dark mode (e.g., slate-900 backgrounds, white-ish text)
  token: {
    // Primary colors (Shadcn-inspired, e.g., indigo-400 for vibrancy in dark mode)
    colorPrimary: '#1447e6', // Lighter indigo for dark mode
    colorSuccess: '#34d399', // Emerald 400
    colorWarning: '#fbbf24', // Amber 400
    colorError: '#f87171',   // Red 400
    colorInfo: '#22d3ee',    // Cyan 400

    // Backgrounds: Dark, slate-like (Shadcn uses ~hsl(240 10% 3.9%))
    colorBgContainer: 'transperent', // Slate-900 equivalent
    colorBgElevated: 'transperent',  // Slightly lighter for cards, modals
    colorBgLayout: 'transperent',    // Darker root background

    // Text: High contrast for readability
    colorText: '#f1f5f9',        // Slate-50, near-white
    colorTextSecondary: '#cbd5e1', // Slate-300
    colorTextTertiary: '#94a3b8',  // Slate-400

    // Borders & Radii: Soft, rounded like Shadcn
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    // Shadows: Subtle elevation (Shadcn’s minimal shadows)
    boxShadow: '0 1px 2px 0 rgba(255, 255, 255, 0.03)',
    boxShadowSecondary: '0 1px 3px 0 rgba(255, 255, 255, 0.05), 0 1px 2px -1px rgba(255, 255, 255, 0.05)',
    boxShadowTertiary: '0 0 0 1px rgba(255, 255, 255, 0.08)',

    // Typography & Spacing: Match Shadcn’s clean style
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    lineHeight: 1.5,
    sizeUnit: 4,
  },

  // Component-specific overrides
  components: {
    Button: {
      borderRadius: 6,
      paddingContentHorizontal: 16,
      defaultShadow: false, // Remove heavy AntD shadows
      colorBgContainer: 'transperent', // Darker button bg
      colorText: '#fff',
      controlHeight: 36, // Slightly smaller, Shadcn-like
    },
    Input: {
      borderRadius: 6,
      paddingInline: 12,
      colorBgContainer: 'transperent',
      colorText: '#f1f5f9',
      colorBorder: '#475569', // Slate-600
    },
    Card: {
      borderRadius: 8,
      boxShadow: '0 1px 3px 0 rgba(255, 255, 255, 0.05)',
      colorBgContainer: 'transperent',
    },
    Modal: {
      borderRadius: 8,
      colorBgElevated: '#1e293b',
      colorText: '#f1f5f9',
    },
    Table: {
      colorBgContainer: 'black',
      colorText: '#f1f5f9',
      borderRadius: 8,
    },
  },
};

export default darkTheme;