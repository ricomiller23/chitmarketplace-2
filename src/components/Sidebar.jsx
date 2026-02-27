import { MapPin, Terminal, BarChart3, Users, Database } from "lucide-react";
import { fmtUSD, fmtCHIT } from "../helpers.js";

export default function Sidebar({ data, activeView, setActiveView, bugs, consoleOpen, setConsoleOpen, onBuy, onSell, onXfer }) {
    if (!data) return null;
    const usdTotal = data.user.alphaBal + data.user.betaBal;

    return (
        <aside style={{ width: 320, flexShrink: 0, background: "#1c1c1c", borderRight: "1px solid #2a2a2a", display: "flex", flexDirection: "column", gap: 20, padding: 24, overflowY: "auto" }}>
            {/* Header */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span className="dot-glow" style={{ width: 8, height: 8, background: "#4ade80", borderRadius: "50%", flexShrink: 0, display: "inline-block" }} />
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "0.2em" }}>UTRADE</h1>
                </div>
                <p style={{ color: "#9ca3af", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>chit marketplace · az private club</p>
            </div>

            {/* Market Summary */}
            <div style={{ border: "1px solid #2a2a2a", borderRadius: 10, padding: 16, background: "#161616" }}>
                <p style={{ color: "#9ca3af", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>Market Summary</p>
                {[
                    ["Assurance Reserve", fmtUSD(data.treasury.usd)],
                    ["Treasury CHITs", fmtCHIT(data.treasury.chits)],
                    ["Listed for Sale", `⌀${data.treasury.listedForSale.toLocaleString()}`],
                    ["Circulation", `⌀${data.treasury.circulation.toLocaleString()}`],
                ].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                        <span style={{ color: "#9ca3af", fontSize: 12 }}>{label}</span>
                        <span className="mono" style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>{value}</span>
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                    { label: "BUY", bg: "#4ade80", fn: onBuy },
                    { label: "SELL", bg: "#f87171", fn: onSell },
                    { label: "XFER", bg: "#ffffff", fn: onXfer },
                ].map(({ label, bg, fn }) => (
                    <button
                        key={label}
                        onClick={fn}
                        style={{ background: bg, color: "#000", padding: "12px 0", borderRadius: 8, fontWeight: 700, fontSize: 13, letterSpacing: "0.15em", border: "none", cursor: "pointer", transition: "opacity 0.15s", fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}
                        onMouseDown={e => e.currentTarget.style.opacity = "0.8"}
                        onMouseUp={e => e.currentTarget.style.opacity = "1"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Pricing */}
            <div style={{ border: "1px solid #2a2a2a", borderRadius: 10, padding: 16, background: "#161616" }}>
                <p style={{ color: "#9ca3af", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>Pricing</p>
                {[["New Issue", "$1.00"], ["Market Price", "$1.00"], ["Redemption Price", "$1.00"]].map(([label, val]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                        <span style={{ color: "#9ca3af", fontSize: 12 }}>{label}</span>
                        <span className="mono" style={{ color: "#4ade80", fontSize: 14, fontWeight: 600 }}>{val}</span>
                    </div>
                ))}
            </div>

            {/* Funding Account */}
            <div style={{ border: "1px solid #2a2a2a", borderRadius: 10, padding: 16, background: "#161616" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                        <p style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>Funding Account</p>
                        <p style={{ color: "#9ca3af", fontSize: 10, marginTop: 2 }}>USD · Sub-accounts</p>
                    </div>
                    <span style={{ fontSize: 10, background: "#166534", color: "#4ade80", padding: "2px 8px", borderRadius: 99 }}>Active</span>
                </div>
                <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{fmtUSD(usdTotal)}</p>
                <div style={{ borderTop: "1px solid #2a2a2a", paddingTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                    {[["Alpha", data.user.alphaBal], ["Beta", data.user.betaBal]].map(([lbl, val]) => (
                        <div key={lbl} style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#9ca3af", fontSize: 12 }}>{lbl}</span>
                            <span className="mono" style={{ color: "#fff", fontSize: 12 }}>{fmtUSD(val)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trading Account */}
            <div style={{ border: "1px solid #333", borderRadius: 10, padding: 16, background: "linear-gradient(135deg, #1a1f2e 0%, #161616 100%)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                        <p style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>Trading Account</p>
                        <p style={{ color: "#9ca3af", fontSize: 10, marginTop: 2 }}>CHIT · Desktop Vault</p>
                    </div>
                    <span style={{ fontSize: 10, background: "#1e3a5f", color: "#93c5fd", padding: "2px 8px", borderRadius: 99 }}>Micro Commodity</span>
                </div>
                <p className="mono" style={{ fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{fmtCHIT(data.user.tradingBal)}</p>
                <p className="mono" style={{ color: "#9ca3af", fontSize: 10, marginTop: 4 }}>{data.user.vaultId}</p>
            </div>

            {/* Console Toggle */}
            <button
                onClick={() => setConsoleOpen(!consoleOpen)}
                style={{ display: "flex", alignItems: "center", gap: 8, color: "#9ca3af", fontSize: 12, border: "1px solid #2a2a2a", borderRadius: 8, padding: "8px 12px", background: "none", cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}
            >
                <Terminal size={12} />
                <span>ORACLE CONSOLE</span>
                {bugs.length > 0 && (
                    <span style={{ marginLeft: "auto", background: "#f87171", color: "#000", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 99 }}>{bugs.length}</span>
                )}
            </button>

            {/* Bottom Nav */}
            <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid #2a2a2a", display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                    { id: "dashboard", label: "Dashboard", Icon: BarChart3 },
                    { id: "customers", label: "Members", Icon: Users },
                    { id: "treasury", label: "Treasury", Icon: Database },
                ].map(({ id, label, Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveView(id)}
                        style={{
                            display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                            borderRadius: 8, fontSize: 12, border: "none", cursor: "pointer",
                            background: activeView === id ? "#fff" : "transparent",
                            color: activeView === id ? "#000" : "#9ca3af",
                            fontWeight: activeView === id ? 600 : 400,
                            fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                            transition: "all 0.15s",
                        }}
                    >
                        <Icon size={12} />
                        {label}
                    </button>
                ))}
            </div>
        </aside>
    );
}
