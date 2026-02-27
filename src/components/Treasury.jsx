import { fmtUSD, fmtCHIT } from "../helpers.js";

export default function Treasury({ data }) {
    if (!data) return null;
    const { treasury } = data;

    const statCards = [
        { label: "CHIT Supply", value: fmtCHIT(treasury.chits), color: "#4ade80" },
        { label: "USD Reserves", value: fmtUSD(treasury.usd), color: "#93c5fd" },
        { label: "Circulation", value: `⌀${treasury.circulation.toLocaleString()}`, color: "#fbbf24" },
        { label: "Listed for Sale", value: `⌀${treasury.listedForSale.toLocaleString()}`, color: "#f87171" },
    ];

    return (
        <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }} className="fade-in">
            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
                {statCards.map(({ label, value, color }) => (
                    <div key={label} style={{ border: "1px solid #2a2a2a", borderRadius: 12, padding: 20, background: "#1c1c1c" }}>
                        <p style={{ color: "#9ca3af", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 10 }}>{label}</p>
                        <p className="mono" style={{ color, fontSize: 18, fontWeight: 700 }}>{value}</p>
                    </div>
                ))}
            </div>

            {/* CHIT Specs */}
            <div style={{ border: "1px solid #2a2a2a", borderRadius: 12, background: "#1c1c1c", overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #2a2a2a" }}>
                    <p style={{ color: "#9ca3af", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em" }}>CHIT Specifications</p>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <tbody>
                        {[
                            ["New Issue Price", "$1.00", "#4ade80"],
                            ["Market Price", "$1.00", "#4ade80"],
                            ["Redemption Price", "$1.00", "#4ade80"],
                            ["Asset Class", "Digital Micro-Commodity", "#e5e7eb"],
                            ["Jurisdiction", "Arizona State (Geo-Fenced)", "#e5e7eb"],
                            ["Standard", "Onli Gene OrganISM™ v2", "#e5e7eb"],
                        ].map(([label, value, color]) => (
                            <tr key={label} style={{ borderBottom: "1px solid #1a1a1a" }}>
                                <td style={{ padding: "12px 20px", color: "#9ca3af", width: "40%" }}>{label}</td>
                                <td className="mono" style={{ padding: "12px 20px", color, fontWeight: 500 }}>{value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Volume Summary */}
            <div style={{ border: "1px solid #2a2a2a", borderRadius: 12, background: "#1c1c1c", overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #2a2a2a" }}>
                    <p style={{ color: "#9ca3af", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em" }}>Volume Summary</p>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #2a2a2a" }}>
                            {["Type", "Volume (CHITs)", "Order Count"].map(h => (
                                <th key={h} style={{ padding: "10px 20px", textAlign: "left", color: "#9ca3af", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { label: "Buy Orders", vol: treasury.buyVolume, count: treasury.buyCount, color: "#4ade80" },
                            { label: "Sell Orders", vol: treasury.sellVolume, count: treasury.sellCount, color: "#f87171" },
                            { label: "Redemptions", vol: treasury.redemptions, count: treasury.redemptionCount, color: "#fbbf24" },
                        ].map(({ label, vol, count, color }) => (
                            <tr key={label} style={{ borderBottom: "1px solid #1a1a1a" }}>
                                <td style={{ padding: "12px 20px", color: "#e5e7eb" }}>{label}</td>
                                <td className="mono" style={{ padding: "12px 20px", color, fontWeight: 600 }}>{fmtCHIT(vol)}</td>
                                <td className="mono" style={{ padding: "12px 20px", color: "#9ca3af" }}>{count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
