import dayjs from "./dayjs";

export function formatCompactNumber(num: number | null | undefined): string {
    if (num === null || num === undefined || Number.isNaN(num)) {
        return "0";
    }

    return new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(num);
}

export function formatRelativeDate(isoDate: string | null | undefined): string {
    if (!isoDate) {
        return "Unknown";
    }

    const parsed = dayjs(isoDate);
    if (!parsed.isValid()) {
        return "Unknown";
    }

    return parsed.fromNow();
}

export function formatAbsoluteDate(isoDate: string | null | undefined): string {
    if (!isoDate) {
        return "Unknown";
    }

    const parsed = dayjs(isoDate);
    if (!parsed.isValid()) {
        return "Unknown";
    }

    return parsed.format("ll");
}

export function getLanguageColor(language: string | null | undefined): string {
    if (!language) {
        return "#8F99B3";
    }

    const colors: Record<string, string> = {
        typescript: "#3178C6",
        javascript: "#F7DF1E",
        python: "#3572A5",
        rust: "#DEA584",
        go: "#00ADD8",
        java: "#B07219",
        "c++": "#F34B7D",
        c: "#555555",
        "c#": "#178600",
        ruby: "#701516",
        php: "#4F5D95",
        html: "#E34C26",
        css: "#563D7C",
        vue: "#41B883",
        swift: "#F05138",
        kotlin: "#A97BFF",
        dart: "#00B4AB",
        shell: "#89E051",
    };

    const key = language.toLowerCase();
    return colors[key] || "#7C9CFF";
}

