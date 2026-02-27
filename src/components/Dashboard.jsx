import { useState } from "react";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { fmtCHIT } from "../helpers.js";

function StatusBadge({ status }) {
    const isDelivered = status === "Delivered";
    return (
        <span style={{
            fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
            background: isDelivered ? "#166534" : "#1e3a5f",
            color: isDelivered ? "#4ade80" : "#93c5fd",
        }}>
            {status}
        </span>
    );
}

function ChartCard({ label, chartData, color, gradId }) {
    return (
        <div style={{ border: "1px solid #2a2a2a", borderRadius: 12, padding: 16, background: "#1c1c1c" }}>
            <p style={{ color: "#9ca3af", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>{label}</p>
            <div style={{ height: 70 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                        <defs>
                            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#${gradId})`} dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const TABS = ["Trades", "Listed", "Pending"];

export default function Dashboard({ data, chartData }) {
    const [activeTab, setActiveTab] = useState("Trades");
    if (!data) return null;

    const pendingCount = data.transactions.filter(t => t.status === "Pending").length;

    const filteredTxns = data.transactions.filter(t => {
        if (activeTab === "Trades") return ["BUY", "SELL"].includes(t.type);
        if (activeTab === "Listed") return t.type === "LIST";
        if (activeTab === "Pending") return t.status === "Pending";
        return true;
    }).slice(0, 20);

    return (
        <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }} className="fade-in">
            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                    { label: "Buy Orders", value: fmtCHIT(data.treasury.buyVolume), count: data.treasury.buyCount, Icon: TrendingUp, color: "#4ade80" },
                    { label: "Sell Orders", value: fmtCHIT(data.treasury.sellVolume), count: data.treasury.sellCount, Icon: TrendingDown, color: "#f87171" },
                    { label: "Redemptions", value: fmtCHIT(data.treasury.redemptions), count: data.treasury.redemptionCount, Icon: RefreshCw, color: "#fbbf24" },
                ].map(({ label, value, count, Icon, color }) => (
                    <div key={label} style={{ border: "1px solid #2a2a2a", borderRadius: 12, padding: 20, background: "#161616" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                            <span style={{ color: "#9ca3af", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em" }}>{label}</span>
                            <Icon size={14} style={{ color }} />
                        </div>
                        <p className="mono" style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{value}</p>
                        <p className="mono" style={{ color: "#9ca3af", fontSize: 11, marginTop: 4 }}>{count} transactions</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <ChartCard label="Buys" chartData={chartData.buys} color="#4ade80" gradId="grad-buys" />
                <ChartCard label="Sells" chartData={chartData.sells} color="#f87171" gradId="grad-sells" />
                <ChartCard label="Xfers" chartData={chartData.xfers} color="#93c5fd" gradId="grad-xfers" />
            </div>

            {/* Transaction Ledger */}
            <div style={{ border: "1px solid #2a2a2a", borderRadius: 12, background: "#1c1c1c", overflow: "hidden" }}>
                {/* Tabs */}
                <div style={{ display: "flex", borderBottom: "1px solid #2a2a2a", padding: "0 16px" }}>
                    {TABS.map(tab => {
                        const active = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: "12px 16px", fontSize: 12, fontWeight: active ? 600 : 400,
                                    color: active ? "#fff" : "#9ca3af", background: "none", border: "none", cursor: "pointer",
                                    borderBottom: active ? "2px solid #fff" : "2px solid transparent",
                                    display: "flex", alignItems: "center", gap: 6, marginBottom: -1,
                                    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                                }}
                            >
                                {tab}
                                {tab === "Pending" && pendingCount > 0 && (
                                    <span style={{ background: "#f87171", color: "#000", fontSize: 10, fontWeight: 700, padding: "1px 5px", borderRadius: 99 }}>{pendingCount}</span>
                                )}
                            </button>
                        );
                    })}
                    <span style={{ marginLeft: "auto", alignSelf: "center", color: "#9ca3af", fontSize: 11, paddingRight: 8 }}>
                        {filteredTxns.length} records
                    </span>
                </div>

                {/* Table */}
                {filteredTxns.length === 0 ? (
                    <div style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                        No {activeTab.toLowerCase()} records found.
                    </div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid #2a2a2a" }}>
                                    {["Date", "Receipt ID", "From", "To", "Asset", "Status"].map(h => (
                                        <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#9ca3af", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTxns.map((t, i) => (
                                    <tr key={t.id} style={{ borderBottom: "1px solid #1a1a1a", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                                        <td className="mono" style={{ padding: "10px 16px", color: "#9ca3af", whiteSpace: "nowrap" }}>{t.date}</td>
                                        <td className="mono" style={{ padding: "10px 16px", color: "#4ade80", whiteSpace: "nowrap" }}>{t.receiptId}</td>
                                        <td style={{ padding: "10px 16px", color: "#e5e7eb", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.from}</td>
                                        <td style={{ padding: "10px 16px", color: "#e5e7eb", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.to}</td>
                                        <td className="mono" style={{ padding: "10px 16px", color: "#fff", whiteSpace: "nowrap" }}>{t.asset}</td>
                                        <td style={{ padding: "10px 16px" }}><StatusBadge status={t.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
