import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        orange: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        shimmer: "shimmer 2s infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities }: { addUtilities: (utilities: Record<string, Record<string, string>>) => void }) {
      addUtilities({
        '.bg-background': { backgroundColor: 'hsl(var(--background))' },
        '.bg-card': { backgroundColor: 'hsl(var(--card))' },
        '.bg-popover': { backgroundColor: 'hsl(var(--popover))' },
        '.bg-muted': { backgroundColor: 'hsl(var(--muted))' },
        '.bg-accent': { backgroundColor: 'hsl(var(--accent))' },
        '.bg-secondary': { backgroundColor: 'hsl(var(--secondary))' },
        '.text-foreground': { color: 'hsl(var(--foreground))' },
        '.text-muted': { backgroundColor: 'hsl(var(--muted))' },
        '.text-card-foreground': { color: 'hsl(var(--card-foreground))' },
        '.text-popover-foreground': { color: 'hsl(var(--popover-foreground))' },
        '.text-secondary-foreground': { color: 'hsl(var(--secondary-foreground))' },
        '.text-accent-foreground': { color: 'hsl(var(--accent-foreground))' },
        '.border-border': { borderColor: 'hsl(var(--border))' },
        '.border-input': { borderColor: 'hsl(var(--input))' },
        '.ring-ring': { '--tw-ring-color': 'hsl(var(--ring))' },
        '.focus-visible:ring-ring': { '--tw-ring-color': 'hsl(var(--ring))' },
        '.focus-visible:ring-offset-background': { '--tw-ring-offset-background': 'hsl(var(--background))' },
        '.file:bg-background': { '--tw-file-bg-background': 'hsl(var(--background))' },
        '.placeholder\\:text-muted-foreground': { '--tw-placeholder-color': 'hsl(var(--muted-foreground))' },
      });
    },
  ],
} satisfies Config;
