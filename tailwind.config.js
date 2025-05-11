import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  safelist: [
    {
      pattern: /bg-(blue|purple|pink|rose|sky|stone|teal|emerald|lime|zinc|red|yellow|orange)-(100|200|300|400|500|600|700)/,
    },
    {
      pattern: /text-(blue|purple|pink|rose|sky|stone|teal|emerald|lime|zinc|red|yellow|orange)-(100|200|300|400|500|600|700)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
