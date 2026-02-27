export const fmtUSD = (n) =>
    `$${Number(Math.abs(n)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const fmtCHIT = (n) =>
    `⌀${Number(Math.abs(n)).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export const fmtShort = (n) => {
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
    return `$${n}`;
};

export const fmtReceiptId = () =>
    `RCP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

export const fmtDate = () =>
    new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

export const fmtTime = () =>
    new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

export const genChartData = (base = 50, variance = 30) =>
    Array.from({ length: 24 }, (_, i) => ({
        x: i,
        v: Math.max(5, base + (Math.random() - 0.5) * variance * 2),
    }));

export const randId = () => `usr-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
