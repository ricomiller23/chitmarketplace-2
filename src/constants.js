export const TREASURY_INITIAL_CHITS = 100_000_000;
export const CHIT_PRICE = 1.00;

export const FACILITIES = [
    "PHX-01 · Phoenix Central Vault",
    "TUC-01 · Tucson Secure Facility",
    "MES-01 · Mesa Distribution Hub",
    "SCO-01 · Scottsdale CIT Station",
    "FLG-01 · Flagstaff Regional Vault",
];

export const BANK_ACCOUNTS = [
    "****6789 (Chase Business)",
    "****2241 (Wells Fargo Commercial)",
    "****8834 (Bank of America)",
];

export const INITIAL_DATA = {
    version: "2.0.0",
    treasury: {
        chits: 100_000_000,
        usd: 10_999_217_368.64,
        listedForSale: 125_101,
        circulation: 9_985_243_683,
        buyVolume: 25_032_809_951,
        sellVolume: 10_030_678_193,
        redemptions: 14_032_076_695,
        buyCount: 126,
        sellCount: 208,
        redemptionCount: 144,
    },
    user: {
        id: "usr-EM001",
        name: "Eric Miller",
        alphaBal: 1_000_000,
        betaBal: 0,
        tradingBal: 0,
        tier: "Full Access",
        joinDate: "2024-01-15",
        kycStatus: "Verified",
        vaultId: "VLT-EM001-DX",
    },
    customers: [
        { id: "usr-A001", name: "Green Valley Dispensary", alphaBal: 250_000, betaBal: 0, tradingBal: 15_000, tier: "Full Access", kycStatus: "Verified", state: "AZ" },
        { id: "usr-A002", name: "Desert Bloom Cannabis", alphaBal: 180_000, betaBal: 0, tradingBal: 8_500, tier: "Full Access", kycStatus: "Verified", state: "AZ" },
        { id: "usr-A003", name: "Sonoran Wellness Co.", alphaBal: 320_000, betaBal: 50_000, tradingBal: 22_000, tier: "Full Access", kycStatus: "Verified", state: "AZ" },
        { id: "usr-A004", name: "AZ Harvest Hub", alphaBal: 95_000, betaBal: 0, tradingBal: 3_200, tier: "Standard", kycStatus: "Verified", state: "AZ" },
        { id: "usr-A005", name: "Phoenix Roots LLC", alphaBal: 450_000, betaBal: 120_000, tradingBal: 55_000, tier: "Full Access", kycStatus: "Verified", state: "AZ" },
        { id: "usr-A006", name: "High Desert Naturals", alphaBal: 75_000, betaBal: 0, tradingBal: 1_200, tier: "Standard", kycStatus: "Pending", state: "AZ" },
        { id: "usr-A007", name: "Saguaro Cannabis Club", alphaBal: 600_000, betaBal: 200_000, tradingBal: 88_000, tier: "Full Access", kycStatus: "Verified", state: "AZ" },
    ],
    transactions: [],
};
