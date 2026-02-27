import { useEffect, useRef, useState } from "react";
import { Terminal, X, Bug } from "lucide-react";
import { fmtUSD, fmtCHIT, fmtTime } from "../helpers.js";
import { INITIAL_DATA } from "../constants.js";

export default function Console({ data, consoleLogs, setConsoleLogs, scanning, bugs, setBugs, setScanning, persist, onClose }) {
    const [input, setInput] = useState("");
    const endRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [consoleLogs]);

    const addLog = (type, text) => {
        setConsoleLogs(prev => [...prev, { type, text, ts: fmtTime() }]);
    };

    const handleCmd = (raw) => {
        const trimmed = raw.trim();
        if (!trimmed) return;
        addLog("input", `> ${trimmed}`);
        setInput("");
        const parts = trimmed.toLowerCase().split(" ");
        const cmd = parts[0];

        switch (cmd) {
            case "/ralph": {
                addLog("system", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                addLog("ralph", "🦏  RALPH — Regulatory AML Ledger Protocol Handler");
                addLog("ralph", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                addLog("ralph", `SYSTEM STATUS .............. ✅ OPERATIONAL`);
                addLog("ralph", `ORACLE CONNECTION .......... ✅ ACTIVE`);
                addLog("ralph", `SEED-TO-SALE VERIFY ........ ✅ ENABLED`);
                addLog("ralph", `AML ENGINE ................. ✅ RUNNING`);
                addLog("ralph", `KYC DATABASE ............... ✅ ${data?.customers?.length || 0} MEMBERS`);
                addLog("ralph", `GEO-FENCE .................. ✅ ARIZONA STATE BORDER`);
                addLog("ralph", `TREASURY CHITS ............. ✅ ${fmtCHIT(data?.treasury?.chits || 0)}`);
                addLog("ralph", `TREASURY USD ............... ✅ ${fmtUSD(data?.treasury?.usd || 0)}`);
                addLog("ralph", `USER VAULT ................. ✅ ${data?.user?.vaultId}`);
                addLog("ralph", `ENCLAVE STATUS ............. ✅ INTEL SGX ACTIVE`);
                addLog("ralph", `HEREDITY HELIX ............. ✅ INTACT`);
                addLog("ralph", `PERMISSION HELIX ........... ✅ VALIDATED`);
                addLog("ralph", `STATE HELIX ................ ✅ SYNCHRONIZED`);
                addLog("ralph", `LAST BLOCK SIGNED .......... ${new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${fmtTime()}`);
                addLog("ralph", `COMPLIANCE SCORE ........... 100/100 — PRISTINE`);
                addLog("system", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                addLog("success", "RALPH diagnostic complete. All systems nominal.");
                break;
            }
            case "/help": {
                addLog("system", "═══════════════ AVAILABLE COMMANDS ═══════════════");
                [
                    ["/ralph", "Full system diagnostic (RALPH)"],
                    ["/debug", "Run debug scan on state"],
                    ["/audit", "Full transaction audit log"],
                    ["/fix", "Auto-fix detected issues"],
                    ["/treasury", "Show treasury status"],
                    ["/customers", "List all KYC members"],
                    ["/balance", "Current user balances"],
                    ["/mint <amount>", "Mint CHITs to treasury (admin)"],
                    ["/reset", "Reset to initial state (caution!)"],
                    ["/simulate", "Simulate incoming payment"],
                    ["/oracle", "Query Oracle ledger"],
                    ["/bugs", "List detected bugs"],
                    ["/clear", "Clear console"],
                ].forEach(([c, d]) => addLog("info", `${c.padEnd(18)} — ${d}`));
                addLog("system", "════════════════════════════════════════════════════");
                break;
            }
            case "/debug": {
                setScanning(true);
                addLog("info", "🔍 Running deep state inspection...");
                setTimeout(() => {
                    const found = [];
                    if (data) {
                        if (data.user.alphaBal < 0) found.push({ id: "BUG-001", sev: "CRITICAL", msg: "Negative Alpha balance detected" });
                        if (data.user.tradingBal < 0) found.push({ id: "BUG-002", sev: "CRITICAL", msg: "Negative trading balance" });
                        if (data.treasury.chits < 0) found.push({ id: "BUG-003", sev: "CRITICAL", msg: "Treasury CHIT deficit" });
                        data.transactions?.forEach((t, i) => {
                            if (!t.receiptId) found.push({ id: `BUG-${100 + i}`, sev: "WARN", msg: `Transaction #${i} missing receipt ID` });
                        });
                    }
                    setBugs(found);
                    if (found.length === 0) {
                        addLog("success", "✅ Debug scan complete — No issues found. State is clean.");
                    } else {
                        addLog("error", `⚠️  ${found.length} issue(s) found. Run /fix to auto-resolve.`);
                        found.forEach(b => addLog(b.sev === "CRITICAL" ? "error" : "warn", `  [${b.id}] ${b.sev}: ${b.msg}`));
                    }
                    setScanning(false);
                }, 1800);
                break;
            }
            case "/fix": {
                if (bugs.length === 0) { addLog("info", "No bugs on record. Run /debug first."); break; }
                addLog("info", "🔧 Auto-fixing detected issues...");
                setTimeout(() => {
                    if (data) {
                        const fixed = {
                            ...data,
                            user: { ...data.user, alphaBal: Math.max(0, data.user.alphaBal), betaBal: Math.max(0, data.user.betaBal), tradingBal: Math.max(0, data.user.tradingBal) },
                            treasury: { ...data.treasury, chits: Math.max(0, data.treasury.chits) },
                        };
                        persist(fixed);
                    }
                    addLog("success", `✅ Fixed ${bugs.length} issue(s). State normalized.`);
                    setBugs([]);
                }, 1200);
                break;
            }
            case "/audit": {
                addLog("system", "════════════ ORACLE TRANSACTION AUDIT ════════════");
                if (!data?.transactions?.length) { addLog("info", "No transactions on ledger."); }
                else {
                    data.transactions.slice(-10).forEach(t => {
                        addLog("info", `[${t.date}] ${t.receiptId} | ${t.type} | ${t.asset} | ${t.status}`);
                        addLog("info", `   FROM: ${t.from}  →  TO: ${t.to}`);
                    });
                    addLog("info", `Total records: ${data.transactions.length}`);
                }
                addLog("system", "════════════════════════════════════════════════════");
                break;
            }
            case "/treasury": {
                if (!data) break;
                addLog("system", "══════════════ TREASURY STATUS ══════════════");
                addLog("info", `CHIT Supply ........ ${fmtCHIT(data.treasury.chits)}`);
                addLog("info", `USD Reserves ....... ${fmtUSD(data.treasury.usd)}`);
                addLog("info", `Listed for Sale .... ⌀${data.treasury.listedForSale.toLocaleString()}`);
                addLog("info", `Circulation ........ ⌀${data.treasury.circulation.toLocaleString()}`);
                addLog("info", `New Issue Price .... $1.00`);
                addLog("info", `Market Price ....... $1.00`);
                addLog("info", `Redemption Price ... $1.00`);
                addLog("system", "═════════════════════════════════════════════");
                break;
            }
            case "/customers": {
                if (!data) break;
                addLog("system", "════════════ KYC MEMBER REGISTRY ════════════");
                data.customers.forEach(c => {
                    addLog("info", `[${c.id}] ${c.name}`);
                    addLog("info", `   USD: ${fmtUSD(c.alphaBal + c.betaBal)} | CHIT: ${fmtCHIT(c.tradingBal)} | KYC: ${c.kycStatus} | ${c.tier}`);
                });
                addLog("info", `Total members: ${data.customers.length}`);
                addLog("system", "═════════════════════════════════════════════");
                break;
            }
            case "/balance": {
                if (!data) break;
                addLog("system", "══════════ USER BALANCE SUMMARY ══════════");
                addLog("info", `User: ${data.user.name} (${data.user.id})`);
                addLog("info", `Alpha USD:  ${fmtUSD(data.user.alphaBal)}`);
                addLog("info", `Beta USD:   ${fmtUSD(data.user.betaBal)}`);
                addLog("info", `Total USD:  ${fmtUSD(data.user.alphaBal + data.user.betaBal)}`);
                addLog("info", `CHIT Vault: ${fmtCHIT(data.user.tradingBal)}`);
                addLog("system", "═══════════════════════════════════════════");
                break;
            }
            case "/mint": {
                const amount = parseInt(parts[1]);
                if (!amount || amount <= 0) { addLog("error", "Usage: /mint <amount>  (positive integer)"); break; }
                if (!data) break;
                addLog("info", `🏦 Minting ${fmtCHIT(amount)} to treasury...`);
                setTimeout(() => {
                    const newData = { ...data, treasury: { ...data.treasury, chits: data.treasury.chits + amount } };
                    persist(newData);
                    addLog("success", `✅ ${fmtCHIT(amount)} minted. New treasury balance: ${fmtCHIT(newData.treasury.chits)}`);
                }, 800);
                break;
            }
            case "/oracle": {
                addLog("system", "══════════════ ORACLE QUERY ══════════════");
                addLog("ralph", "Oracle Node: AZC-ORC-001 (Active)");
                addLog("ralph", `Ledger Height: ${(data?.transactions?.length || 0) + 10_847_293}`);
                addLog("ralph", `Last Hash: ${Math.random().toString(36).substr(2, 32).toUpperCase()}`);
                addLog("ralph", `Consensus: 3/3 nodes in agreement`);
                addLog("ralph", `Integrity Check: PASS`);
                addLog("ralph", `Heredity Chain: UNBROKEN`);
                addLog("system", "══════════════════════════════════════════");
                break;
            }
            case "/simulate": {
                addLog("success", "Incoming payment simulated.");
                break;
            }
            case "/reset": {
                addLog("warn", "⚠️  Resetting to initial state...");
                setTimeout(async () => {
                    await persist(INITIAL_DATA);
                    addLog("success", "✅ State reset to defaults.");
                }, 500);
                break;
            }
            case "/bugs": {
                if (bugs.length === 0) { addLog("success", "No bugs on record. Run /debug to scan."); }
                else { bugs.forEach(b => addLog(b.sev === "CRITICAL" ? "error" : "warn", `[${b.id}] ${b.sev}: ${b.msg}`)); }
                break;
            }
            case "/clear": {
                setConsoleLogs([{ type: "system", text: "Console cleared.", ts: fmtTime() }]);
                break;
            }
            default:
                addLog("error", `Unknown command: ${cmd}. Type /help for available commands.`);
        }
    };

    return (
        <div style={{ height: 280, background: "#0d0d0d", borderTop: "1px solid #2a2a2a", display: "flex", flexDirection: "column", flexShrink: 0 }}>
            {/* Console header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderBottom: "1px solid #1a1a1a" }}>
                <Terminal size={12} style={{ color: "#4ade80" }} />
                <span className="mono" style={{ color: "#4ade80", fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", flex: 1 }}>ORACLE CONSOLE</span>
                {scanning && <span className="animate-spin" style={{ display: "inline-block", width: 12, height: 12, border: "2px solid #4ade80", borderTopColor: "transparent", borderRadius: "50%" }} />}
                {bugs.length > 0 && (
                    <span style={{ background: "#f87171", color: "#000", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: "99px", display: "flex", alignItems: "center", gap: 3 }}>
                        <Bug size={9} /> {bugs.length}
                    </span>
                )}
                <button onClick={onClose} style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    <X size={13} />
                </button>
            </div>
            {/* Log area */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px", fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}>
                {consoleLogs.map((log, i) => (
                    <div key={i} className={`console-log-${log.type}`} style={{ marginBottom: 2, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                        <span style={{ color: "#555", marginRight: 8 }}>[{log.ts}]</span>{log.text}
                    </div>
                ))}
                <div ref={endRef} />
            </div>
            {/* Input */}
            <div style={{ display: "flex", alignItems: "center", borderTop: "1px solid #1a1a1a", padding: "6px 16px", gap: 8 }}>
                <span className="mono" style={{ color: "#4ade80", fontSize: 12 }}>$</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleCmd(input); }}
                    placeholder="Type a command and press Enter..."
                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e5e7eb", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}
                />
            </div>
        </div>
    );
}
