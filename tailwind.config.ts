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
                canvas: {
                    base: "var(--bg-base)",
                    solid: "var(--surface-solid)",
                },
                content: {
                    primary: "var(--text-primary)",
                    secondary: "var(--text-secondary)",
                    muted: "var(--text-muted)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    secondary: "var(--accent-2)",
                },
                badge: {
                    star: "var(--star)",
                    success: "var(--success)",
                    danger: "var(--danger)",
                    warning: "var(--warning)",
                    merged: "var(--merged)",
                },
            },
            borderRadius: {
                sm: "var(--r-sm, 8px)",
                md: "var(--r-md, 14px)",
                lg: "var(--r-lg, 20px)",
            },
            boxShadow: {
                glass: "var(--glass-shadow)",
            },
            keyframes: {
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
            },
            animation: {
                shimmer: "shimmer 1.8s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};

export default config;

