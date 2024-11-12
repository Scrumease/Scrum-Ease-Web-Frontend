import type { Config } from "tailwindcss";
import * as themes from "daisyui/src/theming/themes";
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...themes["light"],
          primary: "#00ad8a",
          "primary-content": "#000b07",
          secondary: "#00cec5",
          "secondary-content": "#000f0e",
          accent: "#d59400",
          "accent-content": "#100800",
          neutral: "#2d251c",
          "neutral-content": "#d1cfcc",
          "base-100": "#fffdff",
          "base-200": "#dedcde",
          "base-300": "#bebcbe",
          "base-content": "#161616",
          info: "#00ecff",
          "info-content": "#001316",
          success: "#54a900",
          "success-content": "#020a00",
          warning: "#bf4d00",
          "warning-content": "#f6dcd1",
          error: "#ec0048",
          "error-content": "#130002",
        },
        dark: {
          ...themes["dark"],
          primary: "#005eff",
          "primary-content": "#cfe2ff",
          secondary: "#00de00",
          "secondary-content": "#001200",
          accent: "#00a0ff",
          "accent-content": "#fad5cf",
          neutral: "#190b1d",
          "neutral-content": "#cbc8cd",
          "base-100": "#272e3d",
          "base-200": "#202734",
          "base-300": "#1a1f2b",
          "base-content": "#cfd1d5",
          info: "#00f0ff",
          "info-content": "#001416",
          success: "#2ECC40",
          "success-content": "#001209",
          warning: "#ef6800",
          "warning-content": "#140400",
          error: "#ff6e97",
          "error-content": "#160408",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
export default config;
