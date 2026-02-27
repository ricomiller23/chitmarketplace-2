import { fmtUSD, fmtCHIT } from "../helpers.js";

function KYCBadge({ status }) {
    const ok = status === "Verified";
    return (
        <span style={{
            fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
            background: ok ? "#166534" : "#422006",
            color: ok ? "#4ade80" : "#fb923c",
        }}>
            {status}
        </span>
    );
}

function TierBadge({ tier }) {
    const full = tier === "Full Access";
    return (
        <span style={{
            fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 99,
            background: full ? "rgba(147,197,253,0.1)" : "rgba(255,255,255,0.06)",
            color: full ? "#93c5fd" : "#9ca3af",
        }}>
            {tier}
        </span>
    );
}

export default function Members({ data }) {
    if (!data) return null;

    const allRows = [
        { ...data.user, isMe: true },
        ...data.customers,
    ];

    return (
        <div style={{ padding: 32 }} className="fade-in">
            <div style={{ border: "1px solid #2a2a2a", borderRadius: 12, background: "#1c1c1c", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #2a2a2a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ color: "#9ca3af", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em" }}>KYC Member Registry</p>
                    <span style={{ color: "#9ca3af", fontSize: 11 }}>{allRows.length} members</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid #2a2a2a" }}>
                                {["ID", "Member", "USD Balance", "CHIT Balance", "State", "KYC", "Tier"].map(h => (
                                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#9ca3af", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500, whiteSpace: "nowrap" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {allRows.map((r) => (
                                <tr
                                    key={r.id}
                                    style={{
                                        borderBottom: "1px solid #1a1a1a",
                                        background: r.isMe ? "rgba(74,222,128,0.05)" : "transparent",
                                    }}
                                >
                                    <td className="mono" style={{ padding: "12px 16px", color: "#9ca3af", whiteSpace: "nowrap", fontSize: 11 }}>{r.id}</td>
                                    <td style={{ padding: "12px 16px", color: "#fff", fontWeight: r.isMe ? 600 : 400, whiteSpace: "nowrap" }}>
                                        {r.name}
                                        {r.isMe && <span style={{ color: "#4ade80", fontSize: 11, marginLeft: 8, fontWeight: 500 }}>(you)</span>}
                                    </td>
                                    <td className="mono" style={{ padding: "12px 16px", color: "#e5e7eb", textAlign: "right", whiteSpace: "nowrap" }}>
                                        {fmtUSD((r.alphaBal || 0) + (r.betaBal || 0))}
                                    </td>
                                    <td className="mono" style={{ padding: "12px 16px", color: "#e5e7eb", textAlign: "right", whiteSpace: "nowrap" }}>
                                        {fmtCHIT(r.tradingBal || 0)}
                                    </td>
                                    <td style={{ padding: "12px 16px", color: "#9ca3af" }}>{r.state || "AZ"}</td>
                                    <td style={{ padding: "12px 16px" }}><KYCBadge status={r.kycStatus} /></td>
                                    <td style={{ padding: "12px 16px" }}><TierBadge tier={r.tier} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
