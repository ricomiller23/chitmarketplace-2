import { AlertCircle, Loader2, CheckCircle2, X } from "lucide-react";
import { FACILITIES, BANK_ACCOUNTS } from "../constants.js";
import { fmtUSD, fmtCHIT } from "../helpers.js";

export default function Modal({
    modal, modalStep, modalAmount, setModalAmount,
    modalRecipient, setModalRecipient,
    modalFacility, setModalFacility,
    modalBank, setModalBank,
    modalError, data,
    onClose, onSubmit,
}) {
    if (!modal) return null;

    const isUSD = ["BUY", "CASH_DROP", "WIRE_OUT"].includes(modal);
    const isCHIT = ["SELL", "XFER", "CASH_PICKUP"].includes(modal);
    const prefix = isUSD ? "$" : "⌀";
    const usdBal = data ? data.user.alphaBal + data.user.betaBal : 0;
    const chitBal = data ? data.user.tradingBal : 0;
    const maxVal = isUSD ? usdBal : chitBal;
    const availLabel = isUSD ? fmtUSD(usdBal) : fmtCHIT(chitBal);

    const modalTitles = {
        BUY: "Buy CHITs",
        SELL: "Sell CHITs",
        XFER: "Transfer CHITs",
        CASH_PICKUP: "Schedule Cash Pick Up",
        CASH_DROP: "Schedule Cash Drop-Off",
        WIRE_OUT: "Wire Money Out",
    };

    const confirmColor = ["SELL", "CASH_DROP"].includes(modal) ? "#f87171" : "#ffffff";
    const confirmTextColor = ["SELL", "CASH_DROP"].includes(modal) ? "#ffffff" : "#000000";

    const handleBackdrop = () => {
        if (modalStep !== 2) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={handleBackdrop}
        >
            <div
                className="relative w-full max-w-md mx-4 rounded-2xl p-6 fade-in"
                style={{ background: "#1c1c1c", border: "1px solid #2a2a2a" }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                {modalStep !== 2 && (
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-white font-bold text-lg">{modalTitles[modal]}</h2>
                        <button onClick={onClose} style={{ color: "#9ca3af" }}>
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* STEP 1: INPUT */}
                {modalStep === 1 && (
                    <div className="space-y-4">
                        {/* Amount */}
                        <div>
                            <label style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
                                Amount
                            </label>
                            <div className="flex items-center gap-2" style={{ background: "#111", border: "1px solid #333", borderRadius: 8, padding: "10px 12px" }}>
                                <span className="mono" style={{ color: "#9ca3af", fontSize: 14 }}>{prefix}</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={modalAmount}
                                    onChange={e => setModalAmount(e.target.value)}
                                    placeholder="0.00"
                                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 16, fontFamily: "'IBM Plex Mono', monospace" }}
                                />
                                <button
                                    onClick={() => setModalAmount(String(maxVal))}
                                    style={{ background: "#2a2a2a", color: "#9ca3af", fontSize: 11, padding: "2px 8px", borderRadius: 4, border: "none", cursor: "pointer" }}
                                >
                                    MAX
                                </button>
                            </div>
                            <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>Available: {availLabel}</p>
                        </div>

                        {/* XFER: recipient */}
                        {modal === "XFER" && (
                            <div>
                                <label style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
                                    Recipient
                                </label>
                                <input
                                    type="text"
                                    value={modalRecipient}
                                    onChange={e => setModalRecipient(e.target.value)}
                                    placeholder="usr-XXXX or member string"
                                    style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "'IBM Plex Mono', monospace" }}
                                />
                            </div>
                        )}

                        {/* Facility select */}
                        {["CASH_PICKUP", "CASH_DROP"].includes(modal) && (
                            <div>
                                <label style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
                                    Facility Location
                                </label>
                                <select
                                    value={modalFacility}
                                    onChange={e => setModalFacility(e.target.value)}
                                    style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none" }}
                                >
                                    {FACILITIES.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                        )}

                        {/* Bank select */}
                        {modal === "WIRE_OUT" && (
                            <div>
                                <label style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
                                    Approved Bank Account
                                </label>
                                <select
                                    value={modalBank}
                                    onChange={e => setModalBank(e.target.value)}
                                    style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none" }}
                                >
                                    {BANK_ACCOUNTS.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                        )}

                        {/* Error */}
                        {modalError && (
                            <div className="flex items-center gap-2" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, padding: "10px 12px" }}>
                                <AlertCircle size={14} style={{ color: "#f87171", flexShrink: 0 }} />
                                <span style={{ color: "#f87171", fontSize: 13 }}>{modalError}</span>
                            </div>
                        )}

                        {/* Confirm button */}
                        <button
                            onClick={onSubmit}
                            style={{ width: "100%", background: confirmColor, color: confirmTextColor, border: "none", borderRadius: 10, padding: "13px", fontWeight: 700, fontSize: 14, cursor: "pointer", letterSpacing: "0.1em" }}
                        >
                            CONFIRM
                        </button>
                    </div>
                )}

                {/* STEP 2: PROCESSING */}
                {modalStep === 2 && (
                    <div className="flex flex-col items-center text-center py-8 gap-4">
                        <Loader2 size={40} style={{ color: "#4ade80" }} className="animate-spin" />
                        <div>
                            <p style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>Authenticating</p>
                            <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>Running Seed-to-Sale Origin Verification...</p>
                            <p className="mono" style={{ color: "#9ca3af", fontSize: 11, marginTop: 6 }}>AML Check · Oracle Signing · Enclave Processing</p>
                        </div>
                        <div className="flex gap-2 mt-2">
                            {[0, 1, 2].map(i => (
                                <span key={i} className="bounce-dot" style={{ width: 8, height: 8, background: "#4ade80", borderRadius: "50%", display: "inline-block" }} />
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 3: SUCCESS */}
                {modalStep === 3 && data && (
                    <div className="flex flex-col items-center text-center gap-4 py-4">
                        <CheckCircle2 size={48} style={{ color: "#4ade80" }} />
                        <div>
                            <p style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>Transaction Complete</p>
                            <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>Oracle has signed and recorded this transaction.</p>
                        </div>
                        <div style={{ width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: 10, padding: "14px 16px", textAlign: "left" }} className="space-y-2">
                            <div className="flex justify-between">
                                <span style={{ color: "#9ca3af", fontSize: 12 }}>USD Balance</span>
                                <span className="mono" style={{ color: "#fff", fontSize: 12 }}>{fmtUSD(data.user.alphaBal + data.user.betaBal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span style={{ color: "#9ca3af", fontSize: 12 }}>CHIT Balance</span>
                                <span className="mono" style={{ color: "#fff", fontSize: 12 }}>{fmtCHIT(data.user.tradingBal)}</span>
                            </div>
                            {data.transactions[0] && (
                                <div className="flex justify-between" style={{ borderTop: "1px solid #2a2a2a", paddingTop: 8, marginTop: 4 }}>
                                    <span style={{ color: "#9ca3af", fontSize: 12 }}>Receipt ID</span>
                                    <span className="mono" style={{ color: "#4ade80", fontSize: 12 }}>{data.transactions[0].receiptId}</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            style={{ width: "100%", background: "#fff", color: "#000", border: "none", borderRadius: 10, padding: "13px", fontWeight: 700, fontSize: 14, cursor: "pointer", letterSpacing: "0.1em" }}
                        >
                            DONE
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
