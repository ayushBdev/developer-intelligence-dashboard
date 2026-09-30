import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                brand: {
                    50: "var(--primary-50)",
                    100: "var(--primary-100)",
                    200: "var(--primary-200)",
                    500: "var(--primary-500)",
                    600: "var(--primary-600)",
                    700: "var(--primary-700)",
                },
                canvas: {
                    base: "var(--bg)",
                    solid: "var(--surface)",
                },
                surface: {
                    DEFAULT: "var(--surface)",
                    muted: "var(--surface-muted)",
                },
                border: {
                    DEFAULT: "var(--border)",
                    strong: "var(--border-strong)",
                },
                content: {
                    primary: "var(--text)",
                    secondary: "var(--text-secondary)",
                    muted: "var(--text-muted)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    secondary: "var(--accent-2)",
                    link: "var(--link, #024ef3)",
                },
                badge: {
                    star: "var(--star)",
                    success: "var(--success)",
                    danger: "var(--danger)",
                    warning: "var(--warning)",
                    merged: "var(--closed)",
                },
            },
            borderRadius: {
                sm: "var(--r-sm, 6px)",
                md: "var(--r-md, 10px)",
                lg: "var(--r-lg, 14px)",
            },
            boxShadow: {
                sm: "var(--shadow-sm)",
                md: "var(--shadow-md)",
                glass: "var(--shadow-sm)",
            },
            keyframes: {
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
            },
            animation: {
                shimmer: "shimmer 1.6s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};

export default config;

