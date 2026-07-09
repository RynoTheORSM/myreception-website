import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  corePlugins: {
    // The homepage CSS was verified pixel-for-pixel against the design;
    // preflight's resets would disturb it. Revisit if shadcn/ui lands here.
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        heading: ["Archivo", '"Helvetica Neue"', "Arial", "sans-serif"],
        body: ['"Libre Franklin"', '"Helvetica Neue"', "Arial", "sans-serif"],
      },
      colors: {
        "workshop-blue": {
          DEFAULT: "var(--workshop-blue)",
          hover: "var(--workshop-blue-hover)",
          active: "var(--workshop-blue-active)",
        },
        ink: "var(--ink)",
        "deep-navy": "var(--deep-navy)",
        "sky-tint": "var(--sky-tint)",
        slate: "var(--slate)",
        mist: {
          DEFAULT: "var(--mist)",
          border: "var(--mist-border)",
        },
        "navy-border": "var(--navy-border)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        raised: "var(--shadow-raised)",
      },
      maxWidth: {
        container: "var(--container-max)",
      },
    },
  },
  plugins: [],
} satisfies Config;
