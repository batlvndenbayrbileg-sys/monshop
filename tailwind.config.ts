import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#FFFFFF",
          soft: "#FFF5F5",
          secondary: "#FAF6F2",
          tertiary: "#F3ECE7",
          blush: "#FCE4EC",
          rose: "#F8D7DC",
          peach: "#FFE9E0",
          dark: "#1A1A1A",
          deepest: "#171717",
        },
        ink: {
          DEFAULT: "#1F1F1F",
          muted: "#6B6B6B",
          subtle: "#9B9B9B",
          faint: "#D8D8D8",
          inverse: "#FFFFFF",
        },
        brand: {
          pink: "#E91E63",       // primary rose/pink
          rose: "#F06292",
          blush: "#F8BBD0",
          coral: "#FF8A95",
          mauve: "#D87093",
          gold: "#E0BF7A",
          champagne: "#E0BF7A",
          green: "#5BA85D",
        },
        line: {
          DEFAULT: "#F0E0E4",
          dark: "#1F1F1F",
          subtle: "#F8E8EC",
        },
        state: {
          sale: "#E91E63",
          success: "#5BA85D",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      letterSpacing: {
        widest: "0.16em",
        ultra: "0.28em",
      },
      borderRadius: {
        pill: "999px",
        "3xl": "24px",
        "4xl": "32px",
      },
      maxWidth: {
        "8xl": "88rem",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 14s linear infinite",
        marquee: "marquee 35s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
