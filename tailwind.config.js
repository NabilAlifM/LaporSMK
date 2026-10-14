import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: {
                "on-primary": "#ffffff",
                "surface-container-high": "#e3eadf",
                "error": "#ba1a1a",
                "primary-container": "#00873a",
                "secondary-fixed": "#dbe1ff",
                "on-background": "#171d16",
                "on-secondary-container": "#fefcff",
                "inverse-primary": "#62df7d",
                "outline": "#6e7b6c",
                "surface-dim": "#d5dcd1",
                "surface": "#f4fcf0",
                "surface-container-low": "#eff6ea",
                "surface-container": "#e9f0e5",
                "on-primary-container": "#f7fff2",
                "on-tertiary-fixed-variant": "#5a00c6",
                "on-secondary-fixed": "#00174b",
                "on-surface-variant": "#3e4a3d",
                "surface-bright": "#f4fcf0",
                "on-error-container": "#93000a",
                "surface-container-highest": "#dde5d9",
                "secondary": "#0051d5",
                "on-tertiary": "#ffffff",
                "tertiary-container": "#8a4cfc",
                "tertiary-fixed-dim": "#d2bbff",
                "surface-container-lowest": "#ffffff",
                "on-primary-fixed-variant": "#005320",
                "on-tertiary-container": "#fffbff",
                "on-surface": "#171d16",
                "on-error": "#ffffff",
                "inverse-surface": "#2b322b",
                "primary-fixed-dim": "#62df7d",
                "on-secondary-fixed-variant": "#003ea8",
                "on-secondary": "#ffffff",
                "primary-fixed": "#7ffc97",
                "on-tertiary-fixed": "#25005a",
                "error-container": "#ffdad6",
                "inverse-on-surface": "#ecf3e7",
                "on-primary-fixed": "#002109",
                "secondary-fixed-dim": "#b4c5ff",
                "primary": "#006b2c",
                "background": "#f4fcf0",
                "tertiary-fixed": "#eaddff",
                "surface-tint": "#006e2d",
                "tertiary": "#712ae2",
                "secondary-container": "#316bf3",
                "outline-variant": "#bdcaba",
                "surface-variant": "#dde5d9"
            },
            borderRadius: {
                DEFAULT: "0px",
                lg: "0px",
                xl: "0px",
                full: "9999px"
            },
            spacing: {
                "container-max": "1280px",
                "margin-mobile": "16px",
                "shadow-offset": "4px",
                "border-width": "2px",
                "margin-desktop": "40px",
                "unit": "4px",
                "gutter": "24px"
            },
            fontFamily: {
                "body-lg": ["Hanken Grotesk", ...defaultTheme.fontFamily.sans],
                "display-lg": ["Bricolage Grotesque", ...defaultTheme.fontFamily.sans],
                "headline-lg": ["Bricolage Grotesque", ...defaultTheme.fontFamily.sans],
                "button-text": ["Bricolage Grotesque", ...defaultTheme.fontFamily.sans],
                "label-mono": ["JetBrains Mono", "monospace"],
                "headline-md": ["Bricolage Grotesque", ...defaultTheme.fontFamily.sans],
                "body-md": ["Hanken Grotesk", ...defaultTheme.fontFamily.sans],
                "headline-lg-mobile": ["Bricolage Grotesque", ...defaultTheme.fontFamily.sans]
            },
            fontSize: {
                "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "500" }],
                "display-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
                "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "800" }],
                "button-text": ["16px", { lineHeight: "1", fontWeight: "700" }],
                "label-mono": ["14px", { lineHeight: "1.2", fontWeight: "600" }],
                "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "700" }],
                "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
                "headline-lg-mobile": ["24px", { lineHeight: "1.2", fontWeight: "800" }]
            }
        },
    },

    plugins: [forms],
};
