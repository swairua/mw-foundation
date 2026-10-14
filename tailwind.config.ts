import type { Config } from "tailwindcss";

// Brand palette. Contrast pairs are verified by `tests/contrast.test.ts`.
// - forest-900 is the brand green (#15382c); forest-950 is used for deep sections.
// - gold-500 is the logo gold (#d2b35d). Use gold-300/400 for text on dark,
//   gold-700 for text on cream (never gold-500 text on light backgrounds).
// - cream-100 is the page background.
export default {
  content: ["./src/**/*.{ts,tsx}", "./plugins/**/*.ts"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        forest: {
          950: "#0b2019",
          900: "#15382c",
          800: "#1b4637",
          700: "#235a47",
          600: "#2e6f58",
          200: "#c9d8cf",
          100: "#e1eae4",
          50: "#f0f4f1",
        },
        gold: {
          200: "#f0e2bb",
          300: "#e6cf8e",
          400: "#dcbf6f",
          500: "#d2b35d",
          600: "#b8963d",
          700: "#83631a",
          800: "#6b5115",
        },
        cream: {
          50: "#fdfbf7",
          100: "#f8f4ec",
          150: "#f4eee2",
          200: "#f1eadb",
          300: "#e5dac4",
          400: "#d6c7a8",
        },
        ink: {
          DEFAULT: "#13261f",
          soft: "#384b43",
          mute: "#54655d",
        },
      },
      fontFamily: {
        sans: ['"Instrument Sans Variable"', '"Instrument Sans Fallback"', "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', '"Instrument Serif Fallback"', "Georgia", "serif"],
      },
      fontSize: {
        eyebrow: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.16em" }],
        "display-xl": ["clamp(2.75rem, 1.6rem + 5.2vw, 6rem)", { lineHeight: "0.98", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(2.4rem, 1.7rem + 3.2vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(1.95rem, 1.45rem + 2.1vw, 3.25rem)", { lineHeight: "1.06", letterSpacing: "-0.025em" }],
        "display-sm": ["clamp(1.5rem, 1.25rem + 1vw, 2.1rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        lead: ["clamp(1.125rem, 1.05rem + 0.35vw, 1.3rem)", { lineHeight: "1.6" }],
      },
      maxWidth: {
        shell: "1240px",
        prose: "68ch",
      },
      borderRadius: {
        card: "14px",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.2, 0.7, 0.2, 1)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(11,32,25,0.04), 0 8px 24px -8px rgba(11,32,25,0.12)",
        lift: "0 2px 4px rgba(11,32,25,0.05), 0 24px 48px -16px rgba(11,32,25,0.22)",
      },
    },
  },
  plugins: [],
} satisfies Config;
