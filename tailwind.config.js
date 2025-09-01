/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["var(--font-nunito-sans)", "sans-serif"],
        fdemobold: ["var(--font-fdemo-bold)", "sans-serif"],
        fdemoregular: ["var(--font-fdemo-regular)", "sans-serif"],
        roboto: ["var(--font-roboto)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
        segeo: ["var(--font-segeo)", "sans-serif"],
        monserrat: ["var(--font-montserrat)", "sans-serif"],
        opensans: ["var(--font-open-sans)", "sans-serif"],
        monasans: ["var(--font-mona-sans)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        rubik: ["var(--font-rubik)", "sans-serif"],
      },
      lineClamp: {
        7: "7",
        8: "8",
        9: "9",
        10: "10",
      },
      width: {
        18: "4.5rem", // 18 * 4px = 72px
        34: "8.5rem",
        38: "9.5rem",
        100: "25rem",
      },
      height: {
        18: "4.5rem", // 18 * 4px = 72px
        34: "8.5rem",
        38: "9.5rem",
        100: "25rem",
      },
      spacing: {
        18: "4.5rem",
        22: "88px",
        42: "10.5rem", // 168px
      },
      scale: {
        70: "0.7",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "4xl": "2rem", // adds rounded-4xl
        "5xl": "2.5rem", // optional future-proof
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
