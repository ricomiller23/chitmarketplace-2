import { useState, useEffect, useCallback } from "react";
import { MapPin, Menu, Terminal, Zap, ArrowDownLeft, ArrowUpRight, DollarSign, Loader2, Monitor } from "lucide-react";

import { INITIAL_DATA, FACILITIES, BANK_ACCOUNTS } from "./constants.js";
import { fmtUSD, fmtCHIT, fmtReceiptId, fmtDate, fmtTime, genChartData, randId } from "./helpers.js";

import Sidebar from "./components/Sidebar.jsx";
import Modal from "./components/Modal.jsx";
import Console from "./components/Console.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Members from "./components/Members.jsx";
import Treasury from "./components/Treasury.jsx";

// ── Mobile Blocker ────────────────────────────────────────────
function MobileBlocker() {
    return (
        <div style={{
            height: "100vh", width: "100vw", background: "#161616",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", padding: 32, textAlign: "center",
            fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
        }}>
            <div style={{
                background: "#1c1c1c", border: "1px solid #2a2a2a",
                borderRadius: 20, padding: "40px 32px", maxWidth: 340,
            }}>
                <Monitor size={48} style={{ color: "#4ade80", margin: "0 auto 20px", display: "block" }} />
                <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: "0.15em", marginBottom: 12 }}>
                    UTRADE
                </h1>
                <p style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
                    Sorry — you need a desktop to run this platform.
                </p>
                <div style={{
                    background: "#161616", border: "1px solid #2a2a2a",
                    borderRadius: 10, padding: "12px 16px",
                }}>
                    <p style={{ color: "#9ca3af", fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.05em" }}>
                        UTRADE is a desktop-only institutional trading platform. Please open this URL on a laptop or desktop computer.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    // ── Mobile Detection ─────────────────────────────────────
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // ── Core State ──────────────────────────────────────────
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // ── Modal State ──────────────────────────────────────────
    const [modal, setModal] = useState(null);
    const [modalStep, setModalStep] = useState(1);
    const [modalAmount, setModalAmount] = useState("");
    const [modalRecipient, setModalRecipient] = useState("");
    const [modalFacility, setModalFacility] = useState(FACILITIES[0]);
    const [modalBank, setModalBank] = useState(BANK_ACCOUNTS[0]);
    const [modalError, setModalError] = useState("");

    // ── UI State ─────────────────────────────────────────────
    const [activeView, setActiveView] = useState("dashboard");
    const [menuOpen, setMenuOpen] = useState(false);
    const [consoleOpen, setConsoleOpen] = useState(false);
    const [consoleLogs, setConsoleLogs] = useState([
        { type: "system", text: "CHIT Marketplace v2.0.0 — Oracle Connected", ts: fmtTime() },
        { type: "info", text: "Treasury initialized: ⌀100,000,000 CHITs deployed", ts: fmtTime() },
        { type: "info", text: "Type /ralph for system diagnostics. Type /help for all commands.", ts: fmtTime() },
    ]);

    // ── Bug & Scan State ─────────────────────────────────────
    const [bugs, setBugs] = useState([]);
    const [scanning, setScanning] = useState(false);

    // ── Chart Data (stable, generated once) ──────────────────
    const [chartData] = useState({
        buys: genChartData(60, 25),
        sells: genChartData(40, 20),
        xfers: genChartData(35, 18),
    });

    // ── Storage Init ─────────────────────────────────────────
    useEffect(() => {
        const init = async () => {
            try {
                const stored = await window.storage.get("chit-marketplace-v2");
                if (stored && stored.value) {
                    setData(JSON.parse(stored.value));
                } else {
                    setData(INITIAL_DATA);
                    await window.storage.set("chit-marketplace-v2", JSON.stringify(INITIAL_DATA));
                }
            } catch {
                setData(INITIAL_DATA);
            }
            setLoading(false);
        };
        init();
    }, []);

    const persist = useCallback(async (newData) => {
        setData(newData);
        try { await window.storage.set("chit-marketplace-v2", JSON.stringify(newData)); } catch { }
    }, []);

    // ── Modal Helpers ────────────────────────────────────────
    const openModal = (type) => {
        setModal(type);
        setModalStep(1);
        setModalAmount("");
        setModalRecipient("");
        setModalError("");
        setModalFacility(FACILITIES[0]);
        setModalBank(BANK_ACCOUNTS[0]);
        setMenuOpen(false);
    };

    const closeModal = () => { setModal(null); setModalStep(1); setModalError(""); };

    const submitModal = () => {
        const amount = parseFloat(modalAmount);
        if (!amount || amount <= 0) { setModalError("Please enter a valid amount."); return; }
        if (!data) return;
        const usdBal = data.user.alphaBal + data.user.betaBal;
        if (["BUY", "CASH_DROP", "WIRE_OUT"].includes(modal) && amount > usdBal) {
            setModalError(`Insufficient USD. Available: ${fmtUSD(usdBal)}`); return;
        }
        if (["SELL", "XFER"].includes(modal) && amount > data.user.tradingBal) {
            setModalError(`Insufficient CHIT. Available: ${fmtCHIT(data.user.tradingBal)}`); return;
        }
        if (modal === "CASH_PICKUP" && amount > data.treasury.chits) {
            setModalError("Treasury insufficient. Cannot fulfill pickup."); return;
        }
        if (modal === "XFER" && !modalRecipient.trim()) {
            setModalError("Recipient string is required."); return;
        }
        setModalStep(2);
        setTimeout(() => { setModalStep(3); applyTransaction(amount); }, 2200);
    };

    const applyTransaction = (amount) => {
        if (!data) return;
        let nd = { ...data, user: { ...data.user }, treasury: { ...data.treasury } };
        const txn = {
            id: Math.random().toString(36).substr(2, 9),
            receiptId: fmtReceiptId(),
            date: fmtDate(),
            type: modal,
            asset: "",
            status: "Delivered",
            from: "",
            to: "",
        };

        const deductFunding = (amt) => {
            if (nd.user.alphaBal >= amt) {
                nd.user.alphaBal -= amt;
            } else {
                const rem = amt - nd.user.alphaBal;
                nd.user.alphaBal = 0;
                nd.user.betaBal = Math.max(0, nd.user.betaBal - rem);
            }
        };

        switch (modal) {
            case "BUY":
                deductFunding(amount);
                nd.user.tradingBal += amount;
                nd.treasury.chits -= amount;
                txn.from = "Funding Accounts"; txn.to = "Trading Vault";
                txn.asset = fmtCHIT(amount); txn.status = "Delivered";
                break;
            case "SELL":
                nd.user.tradingBal -= amount;
                nd.user.alphaBal += amount;
                nd.treasury.chits += amount;
                txn.from = "Trading Vault"; txn.to = "Alpha Fund";
                txn.asset = fmtCHIT(amount); txn.status = "Delivered";
                break;
            case "XFER":
                nd.user.tradingBal -= amount;
                txn.from = data.user.name; txn.to = modalRecipient;
                txn.asset = fmtCHIT(amount); txn.status = "Pending";
                break;
            case "CASH_PICKUP":
                nd.user.tradingBal += amount;
                nd.treasury.chits -= amount;
                txn.from = modalFacility; txn.to = "Trading Vault";
                txn.asset = fmtCHIT(amount); txn.status = "Pending";
                break;
            case "CASH_DROP":
                deductFunding(amount);
                txn.from = "Funding Accounts"; txn.to = modalFacility;
                txn.asset = fmtUSD(amount); txn.status = "Pending";
                break;
            case "WIRE_OUT":
                deductFunding(amount);
                txn.from = "Funding Accounts"; txn.to = `Bank (${modalBank})`;
                txn.asset = fmtUSD(amount); txn.status = "Delivered";
                break;
            default: break;
        }

        nd.transactions = [txn, ...(nd.transactions || [])];
        persist(nd);
        console.log(`[ORACLE] ${txn.receiptId} — ${modal} ${txn.asset} — ${txn.status}`);
    };

    const triggerSimulate = () => {
        if (!data) return;
        const amount = Math.floor(Math.random() * 49_000 + 1_000);
        const sender = randId();
        const txn = {
            id: Math.random().toString(36).substr(2, 9),
            receiptId: fmtReceiptId(),
            date: fmtDate(),
            type: "BUY",
            asset: fmtCHIT(amount),
            status: "Delivered",
            from: sender,
            to: data.user.name,
        };
        const nd = {
            ...data,
            user: { ...data.user, tradingBal: data.user.tradingBal + amount },
            treasury: { ...data.treasury, chits: data.treasury.chits - amount },
            transactions: [txn, ...(data.transactions || [])],
        };
        persist(nd);
        console.log(`[SIMULATE] Incoming: ${fmtCHIT(amount)} from ${sender}`);
    };

    // ── Loading / Mobile Guard ────────────────────────────────
    if (isMobile) return <MobileBlocker />;

    if (loading || !data) {
        return (
            <div style={{ height: "100vh", background: "#161616", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <Loader2 size={32} style={{ color: "#fff", margin: "0 auto 16px" }} className="animate-spin" />
                    <p className="mono" style={{ color: "#9ca3af", fontSize: 13 }}>Connecting to Oracle...</p>
                </div>
            </div>
        );
    }

    const pageTitle = activeView === "dashboard" ? "Trade" : activeView === "customers" ? "Members" : "Treasury";

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#161616", color: "#e5e7eb", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", overflow: "hidden" }}>

            {/* ── MAIN ROW: Sidebar + Content ─────────────────── */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

                {/* Sidebar */}
                <Sidebar
                    data={data}
                    activeView={activeView}
                    setActiveView={setActiveView}
                    bugs={bugs}
                    consoleOpen={consoleOpen}
                    setConsoleOpen={setConsoleOpen}
                    onBuy={() => openModal("BUY")}
                    onSell={() => openModal("SELL")}
                    onXfer={() => openModal("XFER")}
                />

                {/* Main content */}
                <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

                    {/* Top Nav */}
                    <div style={{ flexShrink: 0, background: "#161616", borderBottom: "1px solid #2a2a2a", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>{pageTitle}</h2>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            {/* Access badge */}
                            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#166534", color: "#4ade80", padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 500 }}>
                                <MapPin size={10} />
                                Full Access · Arizona
                            </div>
                            {/* User pill */}
                            <div style={{ background: "#222", border: "1px solid #333", padding: "6px 12px", borderRadius: 8, fontSize: 12, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 6, height: 6, background: "#4ade80", borderRadius: "50%" }} />
                                {data.user.name}
                            </div>
                            {/* Hamburger */}
                            <div style={{ position: "relative" }}>
                                <button
                                    id="hamburger-btn"
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    style={{ background: "#fff", color: "#000", border: "none", borderRadius: 8, padding: "7px 9px", cursor: "pointer", display: "flex", alignItems: "center" }}
                                >
                                    <Menu size={16} />
                                </button>
                                {menuOpen && (
                                    <div style={{ position: "absolute", right: 0, top: 42, width: 260, background: "#222", border: "1px solid #333", borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.6)", zIndex: 50, overflow: "hidden", padding: 4 }} className="fade-in">
                                        {[
                                            { label: "Schedule Cash Pick Up (CIT)", Icon: ArrowDownLeft, color: "#4ade80", action: "CASH_PICKUP" },
                                            { label: "Schedule Cash Drop-Off (CIT)", Icon: ArrowUpRight, color: "#f87171", action: "CASH_DROP" },
                                            { label: "Wire Money Out (Fiat)", Icon: DollarSign, color: "#93c5fd", action: "WIRE_OUT" },
                                        ].map(({ label, Icon, color, action }) => (
                                            <button
                                                key={action}
                                                onClick={() => openModal(action)}
                                                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "none", border: "none", cursor: "pointer", borderRadius: 8, color: "#fff", fontSize: 13, fontFamily: "'IBM Plex Sans', system-ui, sans-serif", textAlign: "left" }}
                                                onMouseEnter={e => e.currentTarget.style.background = "#333"}
                                                onMouseLeave={e => e.currentTarget.style.background = "none"}
                                            >
                                                <Icon size={14} style={{ color, flexShrink: 0 }} />
                                                {label}
                                            </button>
                                        ))}
                                        <div style={{ borderTop: "1px solid #333", margin: "4px 0" }} />
                                        <button
                                            onClick={() => { triggerSimulate(); setMenuOpen(false); }}
                                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "none", border: "none", cursor: "pointer", borderRadius: 8, color: "#4ade80", fontSize: 13, fontFamily: "'IBM Plex Sans', system-ui, sans-serif", textAlign: "left" }}
                                            onMouseEnter={e => e.currentTarget.style.background = "#333"}
                                            onMouseLeave={e => e.currentTarget.style.background = "none"}
                                        >
                                            <Zap size={14} style={{ flexShrink: 0 }} />
                                            Simulate Incoming Payment
                                        </button>
                                        <button
                                            onClick={() => { setConsoleOpen(true); setMenuOpen(false); }}
                                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "none", border: "none", cursor: "pointer", borderRadius: 8, color: "#9ca3af", fontSize: 13, fontFamily: "'IBM Plex Sans', system-ui, sans-serif", textAlign: "left" }}
                                            onMouseEnter={e => e.currentTarget.style.background = "#333"}
                                            onMouseLeave={e => e.currentTarget.style.background = "none"}
                                        >
                                            <Terminal size={14} style={{ flexShrink: 0 }} />
                                            Open Oracle Console
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* View content */}
                    <div style={{ flex: 1, overflowY: "auto" }}>
                        {activeView === "dashboard" && <Dashboard data={data} chartData={chartData} />}
                        {activeView === "customers" && <Members data={data} />}
                        {activeView === "treasury" && <Treasury data={data} />}
                    </div>
                </main>
            </div>

            {/* ── ORACLE CONSOLE (docked bottom) ───────────────── */}
            {consoleOpen && (
                <Console
                    data={data}
                    consoleLogs={consoleLogs}
                    setConsoleLogs={setConsoleLogs}
                    scanning={scanning}
                    bugs={bugs}
                    setBugs={setBugs}
                    setScanning={setScanning}
                    persist={persist}
                    onClose={() => setConsoleOpen(false)}
                />
            )}

            {/* ── MODAL ────────────────────────────────────────── */}
            <Modal
                modal={modal}
                modalStep={modalStep}
                modalAmount={modalAmount} setModalAmount={setModalAmount}
                modalRecipient={modalRecipient} setModalRecipient={setModalRecipient}
                modalFacility={modalFacility} setModalFacility={setModalFacility}
                modalBank={modalBank} setModalBank={setModalBank}
                modalError={modalError}
                data={data}
                onClose={closeModal}
                onSubmit={submitModal}
            />

            {/* ── MENU CLICK-AWAY ───────────────────────────────── */}
            {menuOpen && (
                <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setMenuOpen(false)} />
            )}
        </div>
    );
}
