const STORAGE_KEY = "fakebank_state_v1";
const USERS_KEY = "fakebank_users_v1";
const SESSION_KEY = "fakebank_session_v1";
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const CATEGORIES = [
  "Housing",
  "Vehicles",
  "Equipment",
  "Businesses",
  "Store",
  "Boosts",
  "Skills",
  "Bills",
  "Reputation",
  "Casino"
];

const HOUSING = [
  { id: "studio", name: "Studio", cost: 5000, payoutBonus: 0.02, rentPerDay: 200, utilityMult: 1.0 },
  { id: "one-bedroom", name: "1 Bedroom", cost: 25000, payoutBonus: 0.05, rentPerDay: 800, utilityMult: 1.4 },
  { id: "luxury-loft", name: "Luxury Loft", cost: 150000, payoutBonus: 0.12, rentPerDay: 3000, utilityMult: 2.0 },
  { id: "penthouse", name: "Penthouse", cost: 1000000, payoutBonus: 0.25, rentPerDay: 15000, utilityMult: 3.0 }
];

const VEHICLES = [
  { id: "used-car", name: "Used Car", cost: 8000, durationReduction: 0.05, insurancePerDay: 120 },
  { id: "delivery-van", name: "Delivery Van", cost: 40000, durationReduction: 0.1, insurancePerDay: 350 },
  { id: "sports-car", name: "Sports Car", cost: 200000, durationReduction: 0.18, insurancePerDay: 900 },
  { id: "hypercar", name: "Hypercar", cost: 2000000, durationReduction: 0.3, insurancePerDay: 2500 }
];

const EQUIPMENT = [
  { id: "better-laptop", name: "Better Laptop", cost: 15000, desc: "Unlock Remote Tech jobs +3% payout.", effects: { payoutMultAdd: 0.03, unlocks: { remoteJobs: true } } },
  { id: "warehouse-tools", name: "Warehouse Tools", cost: 30000, desc: "+10% labor payout.", effects: { categoryPayoutBonus: { labor: 0.1 } } },
  { id: "investment-software", name: "Investment Software", cost: 80000, desc: "Improves risky odds.", effects: { riskyLuckBonusAdd: 0.06 } },
  { id: "business-license", name: "Business License", cost: 120000, desc: "Unlock businesses.", effects: { unlocks: { businesses: true } } }
];

const STORE_ITEMS = [
  { id: "designer-watch", name: "Designer Watch", cost: 60000, stackable: false, desc: "+3% payout.", effects: { payoutMultAdd: 0.03 } },
  { id: "gaming-setup", name: "Gaming Setup", cost: 85000, stackable: false, desc: "+5% XP gain.", effects: { xpMultAdd: 0.05 } },
  { id: "safe", name: "Safe", cost: 120000, stackable: false, desc: "+2% interest effectiveness.", effects: { interestMultAdd: 0.02 } },
  { id: "led-lights", name: "LED Lights", cost: 8000, stackable: false, desc: "Cosmetic only.", effects: {} },
  { id: "rare-cards", name: "Rare Collectible Cards", cost: 2000, stackable: true, desc: "Collectible stack item.", effects: {} }
];

const BUSINESSES = [
  { id: "lemonade-stand", name: "Lemonade Stand", cost: 10000, intervalMs: 10 * MINUTE, basePayout: 50, desc: "Pays every 10 minutes." },
  { id: "online-shop", name: "Online Shop", cost: 100000, intervalMs: 10 * MINUTE, basePayout: 300, desc: "Pays every 10 minutes." },
  { id: "investment-firm", name: "Investment Firm", cost: 1000000, intervalMs: 10 * MINUTE, basePayout: 900, desc: "High-end passive every 10 minutes." }
];

const BOOSTS = [
  { id: "focus", name: "Work Focus", baseCost: 2500, durationMs: 5 * MINUTE, desc: "+15% payout for 5m", effects: { payoutMultMul: 1.15 } },
  { id: "drink", name: "Energy Drink", baseCost: 3000, durationMs: 5 * MINUTE, desc: "-15% duration for 5m", effects: { durationMultMul: 0.85 } },
  { id: "charm", name: "Lucky Charm", baseCost: 4000, durationMs: 5 * MINUTE, desc: "+risk luck for 5m", effects: { riskyLuckBonusAdd: 0.1 } }
];

const QUICK_TASKS = [
  { id: "survey", name: "Answer Survey", durationSec: 45, basePay: 35 },
  { id: "sorting", name: "Package Sorting", durationSec: 30, basePay: 25 },
  { id: "sprint", name: "Delivery Sprint", durationSec: 60, basePay: 60 },
  { id: "support", name: "Customer Support Reply", durationSec: 50, basePay: 45 }
];

const OPPORTUNITY_TEMPLATE = {
  id: "flash-contract",
  title: "Flash Contract",
  durationMin: 2,
  basePay: 140
};

const REPUTATION_OFFERS = [
  { id: "ad-campaign", name: "Advertising Campaign", cost: 20000, repGain: 5, cooldownMs: DAY, desc: "+5 rep" },
  { id: "charity-donation", name: "Charity Donation", cost: 100000, repGain: 20, cooldownMs: 3 * DAY, desc: "+20 rep" }
];

const BASE_JOBS = [
  { id: "data-entry", name: "Data Entry", durationMin: 2, basePay: 40, unlockLevel: 1, category: "general" },
  { id: "deliver-package", name: "Deliver Package", durationMin: 5, basePay: 90, unlockLevel: 1, category: "labor" },
  { id: "fast-food", name: "Fast Food Shift", durationMin: 10, basePay: 180, unlockLevel: 1, category: "labor" },
  { id: "warehouse", name: "Warehouse Shift", durationMin: 30, basePay: 700, unlockLevel: 3, category: "labor" },
  { id: "delivery-route", name: "Delivery Route", durationMin: 45, basePay: 1100, unlockLevel: 4, category: "labor" },
  { id: "night-shift", name: "Night Shift", durationMin: 60, basePay: 1500, unlockLevel: 5, category: "labor" },
  { id: "crypto-trading", name: "Crypto Trading", durationMin: 20, basePay: 800, unlockLevel: 7, category: "risky", riskType: "crypto" },
  { id: "investment-flip", name: "Investment Flip", durationMin: 60, basePay: 1800, unlockLevel: 8, category: "risky", riskType: "flip" },
  { id: "high-stakes", name: "High Stakes Contract", durationMin: 120, basePay: 2800, unlockLevel: 10, category: "risky", riskType: "contract" }
];

const REMOTE_JOBS = [
  { id: "bug-fix", name: "Bug Fixing Contract", durationMin: 15, basePay: 400, unlockLevel: 4, category: "tech" },
  { id: "website-qa", name: "Website QA", durationMin: 25, basePay: 650, unlockLevel: 5, category: "tech" }
];

const CORPORATE_JOBS = [
  { id: "office-assistant", name: "Office Assistant", durationMin: 20, basePay: 500, unlockLevel: 6, category: "corporate" },
  { id: "project-coordinator", name: "Project Coordinator", durationMin: 45, basePay: 1400, unlockLevel: 8, category: "corporate" }
];

const INSIDER_JOBS = [
  { id: "insider-tip", name: "Insider Tip Trade", durationMin: 30, basePay: 2200, unlockLevel: 10, category: "corporate", riskType: "insider" }
];

const INITIAL_STATE = {
  bankBalance: 500,
  bankLevel: 1,
  bankXP: 0,
  reputation: 0,
  activeJobId: null,
  jobAcceptedAt: null,
  jobFinishAt: null,
  jobCooldownUntil: null,
  lastDailyBonusAt: null,
  lastInterestAt: null,
  txLog: [],

  ownedHousingId: null,
  ownedVehicleId: null,
  ownedEquipment: {},
  ownedStoreItems: {},
  ownedBusinesses: {},

  skillPoints: 0,
  trainingsBought: 0,
  skills: { efficiency: 0, speed: 0, luck: 0, charisma: 0 },

  bills: { rentTierId: null, rentDueAt: null, utilitiesDueAt: null, insuranceDueAt: null, missedPayments: 0 },

  casinoStats: { wins: 0, losses: 0 },
  reputationBoosters: {},
  repBoostCooldowns: {},

  quickTaskActiveId: null,
  quickTaskAcceptedAt: null,
  quickTaskFinishAt: null,
  quickTasksUsedInWindow: 0,
  quickTaskWindowResetAt: null,

  mainStreak: 0,
  streakWindowUntil: null,
  lastMainJobClaimAt: null,

  activeOpportunity: null,
  nextOpportunityCheckAt: null,

  activeBoostId: null,
  boostEndsAt: null,

  expectedActiveHourlySnapshot: 8000
};

const dom = {
  authOverlay: document.getElementById("authOverlay"),
  authUsername: document.getElementById("authUsername"),
  authPassword: document.getElementById("authPassword"),
  authMessage: document.getElementById("authMessage"),
  loginBtn: document.getElementById("loginBtn"),
  signupBtn: document.getElementById("signupBtn"),
  accountBadge: document.getElementById("accountBadge"),
  logoutBtn: document.getElementById("logoutBtn"),

  balanceDisplay: document.getElementById("balanceDisplay"),
  levelDisplay: document.getElementById("levelDisplay"),
  reputationDisplay: document.getElementById("reputationDisplay"),
  xpText: document.getElementById("xpText"),
  xpFill: document.getElementById("xpFill"),
  activeEffectsSummary: document.getElementById("activeEffectsSummary"),
  streakStatus: document.getElementById("streakStatus"),
  streakTimer: document.getElementById("streakTimer"),
  dailyStatus: document.getElementById("dailyStatus"),
  dailyBtn: document.getElementById("dailyBtn"),
  interestStatus: document.getElementById("interestStatus"),
  interestBtn: document.getElementById("interestBtn"),
  activeJobCard: document.getElementById("activeJobCard"),
  cooldownStatus: document.getElementById("cooldownStatus"),
  riskyToggle: document.getElementById("riskyToggle"),
  jobBoard: document.getElementById("jobBoard"),

  quickQuotaStatus: document.getElementById("quickQuotaStatus"),
  quickTaskActive: document.getElementById("quickTaskActive"),
  quickTaskBoard: document.getElementById("quickTaskBoard"),

  opportunityPanel: document.getElementById("opportunityPanel"),

  txLog: document.getElementById("txLog"),
  resetBtn: document.getElementById("resetBtn"),
  navBankBtn: document.getElementById("navBankBtn"),
  navSpendBtn: document.getElementById("navSpendBtn"),
  bankView: document.getElementById("bankView"),
  spendView: document.getElementById("spendView"),

  spendFilters: document.getElementById("spendFilters"),
  spendCards: document.getElementById("spendCards"),
  inventoryPanel: document.getElementById("inventoryPanel"),
  trainingCostText: document.getElementById("trainingCostText"),
  buyTrainingBtn: document.getElementById("buyTrainingBtn"),
  skillPointsDisplay: document.getElementById("skillPointsDisplay"),
  skillsPanel: document.getElementById("skillsPanel"),

  coinFlipMaxBet: document.getElementById("coinFlipMaxBet"),
  coinFlipBetInput: document.getElementById("coinFlipBetInput"),
  coinHeadsBtn: document.getElementById("coinHeadsBtn"),
  coinTailsBtn: document.getElementById("coinTailsBtn"),
  coinFlipResult: document.getElementById("coinFlipResult"),
  casinoStats: document.getElementById("casinoStats"),

  billsPanel: document.getElementById("billsPanel"),
  confettiRoot: document.getElementById("confettiRoot")
};

let currentUser = null;
let state = structuredClone(INITIAL_STATE);
let selectedCategory = "Housing";
let activeView = "bank";
let balanceDisplayValue = state.bankBalance;
let secondTicker = null;
let economyTicker = null;
let gameHandlersAttached = false;

function userStateKey(username) {
  return `${STORAGE_KEY}:${username}`;
}

function normalizeUsername(name) {
  return String(name || "").trim().toLowerCase();
}

function simpleHash(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadStateForUser(username) {
  try {
    const raw = localStorage.getItem(userStateKey(username));
    if (!raw) return structuredClone(INITIAL_STATE);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(INITIAL_STATE),
      ...parsed,
      ownedEquipment: { ...(parsed.ownedEquipment || {}) },
      ownedStoreItems: { ...(parsed.ownedStoreItems || {}) },
      ownedBusinesses: { ...(parsed.ownedBusinesses || {}) },
      skills: { ...INITIAL_STATE.skills, ...(parsed.skills || {}) },
      bills: { ...INITIAL_STATE.bills, ...(parsed.bills || {}) },
      casinoStats: { ...INITIAL_STATE.casinoStats, ...(parsed.casinoStats || {}) },
      reputationBoosters: { ...(parsed.reputationBoosters || {}) },
      repBoostCooldowns: { ...(parsed.repBoostCooldowns || {}) },
      txLog: Array.isArray(parsed.txLog) ? parsed.txLog.slice(0, 25) : []
    };
  } catch {
    return structuredClone(INITIAL_STATE);
  }
}

function saveState() {
  if (!currentUser) return;
  state.txLog = state.txLog.slice(0, 25);
  localStorage.setItem(userStateKey(currentUser), JSON.stringify(state));
}

function nowMs() {
  return Date.now();
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatMoney(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.round(n));
}

function formatNum(n) {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

function formatDuration(ms) {
  if (ms <= 0) return "00:00";
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatDate(ts) {
  if (!ts) return "-";
  return new Date(ts).toLocaleString();
}

function addTx(type, amount, meta = {}) {
  state.txLog.unshift({ ts: nowMs(), type, amount, meta });
  state.txLog = state.txLog.slice(0, 25);
}

function animateBalance(toValue) {
  const from = balanceDisplayValue;
  const start = performance.now();
  const dur = 300;

  function step(t) {
    const p = clamp((t - start) / dur, 0, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const cur = from + (toValue - from) * eased;
    dom.balanceDisplay.textContent = formatMoney(cur);
    if (p < 1) {
      requestAnimationFrame(step);
    } else {
      balanceDisplayValue = toValue;
      dom.balanceDisplay.textContent = formatMoney(toValue);
    }
  }

  requestAnimationFrame(step);
}

function spawnConfetti() {
  for (let i = 0; i < 26; i++) {
    const el = document.createElement("span");
    el.className = "confetti-piece";
    el.style.left = `${randInt(15, 85)}%`;
    el.style.top = `${randInt(25, 50)}%`;
    el.style.background = ["#22d3ee", "#34d399", "#f59e0b", "#f87171", "#60a5fa"][randInt(0, 4)];
    el.style.setProperty("--dx", `${randInt(-220, 220)}px`);
    el.style.setProperty("--dy", `${randInt(-220, 220)}px`);
    dom.confettiRoot.appendChild(el);
    setTimeout(() => el.remove(), 820);
  }
}

function getHousingById(id) {
  return HOUSING.find((x) => x.id === id) || null;
}

function getVehicleById(id) {
  return VEHICLES.find((x) => x.id === id) || null;
}

function getStoreItemById(id) {
  return STORE_ITEMS.find((x) => x.id === id) || null;
}

function getBusinessById(id) {
  return BUSINESSES.find((x) => x.id === id) || null;
}

function getBoostById(id) {
  return BOOSTS.find((x) => x.id === id) || null;
}

function getReputationOfferById(id) {
  return REPUTATION_OFFERS.find((x) => x.id === id) || null;
}

function getQuickTaskById(id) {
  return QUICK_TASKS.find((x) => x.id === id) || null;
}

function getStreakBonusPct() {
  const s = state.mainStreak || 0;
  if (s >= 10) return 0.15;
  if (s >= 5) return 0.08;
  if (s >= 2) return 0.03;
  return 0;
}

function getTrainingCost() {
  return Math.round(25000 * Math.pow(1.25, state.trainingsBought || 0));
}

function getOverdueBills(now = nowMs()) {
  return {
    rent: !!state.bills.rentDueAt && now > state.bills.rentDueAt,
    utilities: !!state.bills.utilitiesDueAt && now > state.bills.utilitiesDueAt,
    insurance: !!state.bills.insuranceDueAt && now > state.bills.insuranceDueAt
  };
}

function cleanupExpiredBoost(now = nowMs()) {
  if (state.activeBoostId && state.boostEndsAt && now >= state.boostEndsAt) {
    state.activeBoostId = null;
    state.boostEndsAt = null;
  }
}

function getModifiers(s, now = nowMs()) {
  const mods = {
    payoutMult: 1,
    durationMult: 1,
    xpMult: 1,
    interestMult: 1,
    riskyLuckBonus: 0,
    repGainBonus: 0,
    unlocks: {
      remoteJobs: false,
      corporateJobs: false,
      insiderContracts: false,
      businesses: false,
      riskyBlocked: false
    },
    categoryPayoutBonus: { general: 0, labor: 0, tech: 0, corporate: 0, risky: 0 }
  };

  const housing = getHousingById(s.ownedHousingId);
  if (housing) mods.payoutMult += housing.payoutBonus;

  const vehicle = getVehicleById(s.ownedVehicleId);
  if (vehicle) mods.durationMult -= vehicle.durationReduction;

  for (const eq of EQUIPMENT) {
    if (!s.ownedEquipment[eq.id]) continue;
    if (eq.effects.payoutMultAdd) mods.payoutMult += eq.effects.payoutMultAdd;
    if (eq.effects.xpMultAdd) mods.xpMult += eq.effects.xpMultAdd;
    if (eq.effects.interestMultAdd) mods.interestMult += eq.effects.interestMultAdd;
    if (eq.effects.riskyLuckBonusAdd) mods.riskyLuckBonus += eq.effects.riskyLuckBonusAdd;

    if (eq.effects.categoryPayoutBonus) {
      for (const [k, v] of Object.entries(eq.effects.categoryPayoutBonus)) {
        mods.categoryPayoutBonus[k] = (mods.categoryPayoutBonus[k] || 0) + v;
      }
    }

    if (eq.effects.unlocks) {
      for (const [k, v] of Object.entries(eq.effects.unlocks)) {
        if (v) mods.unlocks[k] = true;
      }
    }
  }

  for (const item of STORE_ITEMS) {
    const qty = s.ownedStoreItems[item.id] || 0;
    if (!qty) continue;
    if (item.effects.payoutMultAdd) mods.payoutMult += item.effects.payoutMultAdd;
    if (item.effects.xpMultAdd) mods.xpMult += item.effects.xpMultAdd;
    if (item.effects.interestMultAdd) mods.interestMult += item.effects.interestMultAdd;
  }

  const efficiency = clamp(s.skills.efficiency || 0, 0, 10);
  const speed = clamp(s.skills.speed || 0, 0, 10);
  const luck = clamp(s.skills.luck || 0, 0, 10);
  const charisma = Math.max(0, s.skills.charisma || 0);

  mods.payoutMult += efficiency * 0.02;
  mods.durationMult -= speed * 0.02;
  mods.riskyLuckBonus += Math.min(0.15, luck * 0.015);
  mods.repGainBonus += Math.floor(charisma / 3);

  if (charisma >= 6 && s.reputation >= 25) mods.unlocks.corporateJobs = true;
  if (s.reputation >= 60) mods.unlocks.insiderContracts = true;

  if (s.activeBoostId && s.boostEndsAt && now < s.boostEndsAt) {
    const boost = getBoostById(s.activeBoostId);
    if (boost) {
      if (boost.effects.payoutMultMul) mods.payoutMult *= boost.effects.payoutMultMul;
      if (boost.effects.durationMultMul) mods.durationMult *= boost.effects.durationMultMul;
      if (boost.effects.riskyLuckBonusAdd) mods.riskyLuckBonus += boost.effects.riskyLuckBonusAdd;
    }
  }

  const overdue = getOverdueBills(now);
  const overdueCount = Object.values(overdue).filter(Boolean).length;
  if (overdueCount > 0) mods.payoutMult *= 1 - 0.04 * overdueCount;
  if (overdue.insurance) mods.unlocks.riskyBlocked = true;

  mods.durationMult = Math.max(0.6, mods.durationMult);
  mods.payoutMult = Math.min(2.5, Math.max(0.5, mods.payoutMult));
  mods.interestMult = clamp(mods.interestMult, 1, 2);
  mods.xpMult = clamp(mods.xpMult, 0.6, 2);
  mods.riskyLuckBonus = clamp(mods.riskyLuckBonus, 0, 0.25);

  return mods;
}

function getBaseReward(job) {
  const timeMultiplier = Math.min(1 + job.durationMin / 20, 6);
  const levelMultiplier = Math.min(1 + (state.bankLevel - 1) * 0.06, 2.5);
  return Math.round(job.basePay * timeMultiplier * levelMultiplier);
}

function withTax(amount) {
  const tax = Math.floor(amount * 0.1);
  return { tax, payout: Math.max(0, amount - tax) };
}

function isDailyAvailable(now = nowMs()) {
  return !state.lastDailyBonusAt || now - state.lastDailyBonusAt >= DAY;
}

function isInterestAvailable(now = nowMs()) {
  return !state.lastInterestAt || now - state.lastInterestAt >= HOUR;
}

function cooldownRemaining(now = nowMs()) {
  return 0;
}

function canAfford(cost) {
  return state.bankBalance >= cost;
}

function spendMoney(cost, type, meta = {}) {
  if (cost <= 0) return true;
  if (!canAfford(cost)) return false;
  state.bankBalance -= cost;
  addTx(type, -cost, meta);
  return true;
}

function creditMoney(amount, type, meta = {}) {
  if (amount <= 0) return;
  state.bankBalance += amount;
  addTx(type, amount, meta);
  if (amount > 5000) spawnConfetti();
}

function computeJobGrossReward(job, mods) {
  const base = getBaseReward(job);
  const catBonus = mods.categoryPayoutBonus[job.category] || 0;
  return Math.round(base * mods.payoutMult * (1 + catBonus));
}

function riskyOutcome(job, gross, mods) {
  const luck = mods.riskyLuckBonus;

  if (job.riskType === "crypto") {
    const p1 = clamp(0.6 - luck * 0.9, 0.35, 0.6);
    const p2 = clamp(0.3 - luck * 0.35, 0.2, 0.35);
    const p3 = clamp(0.09 + luck * 0.85, 0.09, 0.28);
    const r = Math.random();
    if (r < p1) return { reward: randInt(0, 400), repDelta: 1, outcome: "crypto common" };
    if (r < p1 + p2) return { reward: randInt(400, 1200), repDelta: 1, outcome: "crypto uncommon" };
    if (r < p1 + p2 + p3) return { reward: randInt(1200, 3000), repDelta: 1, outcome: "crypto big" };
    return { reward: randInt(3000, 5000), repDelta: 2, outcome: "crypto jackpot" };
  }

  if (job.riskType === "flip") {
    const winChance = clamp(0.7 + luck, 0.7, 0.9);
    const win = Math.random() < winChance;
    return { reward: Math.round(gross * (win ? 1.6 : 0.7)), repDelta: win ? 1 : -2, outcome: win ? "flip win" : "flip loss" };
  }

  if (job.riskType === "contract") {
    const successChance = clamp(0.65 + luck, 0.65, 0.9);
    const success = Math.random() < successChance;
    return { reward: success ? Math.round(gross * 2.2) : 0, repDelta: success ? 2 : -4, outcome: success ? "contract success" : "contract fail" };
  }

  if (job.riskType === "insider") {
    const successChance = clamp(0.45 + luck, 0.45, 0.75);
    const success = Math.random() < successChance;
    return { reward: success ? Math.round(gross * 3) : Math.round(gross * 0.25), repDelta: success ? 2 : -3, outcome: success ? "insider hit" : "insider miss" };
  }

  return { reward: gross, repDelta: 1, outcome: "standard" };
}

function getAllJobs() {
  const mods = getModifiers(state);
  let jobs = [...BASE_JOBS];
  if (mods.unlocks.remoteJobs) jobs = jobs.concat(REMOTE_JOBS);
  if (mods.unlocks.corporateJobs) jobs = jobs.concat(CORPORATE_JOBS);
  if (mods.unlocks.insiderContracts) jobs = jobs.concat(INSIDER_JOBS);
  return jobs;
}

function getJobById(id) {
  return getAllJobs().find((j) => j.id === id) || null;
}

function resetQuickWindowIfNeeded(now = nowMs()) {
  if (!state.quickTaskWindowResetAt || now >= state.quickTaskWindowResetAt) {
    state.quickTasksUsedInWindow = 0;
    state.quickTaskWindowResetAt = now + 5 * MINUTE;
  }
}

function quickTasksLeft(now = nowMs()) {
  resetQuickWindowIfNeeded(now);
  return Math.max(0, 3 - (state.quickTasksUsedInWindow || 0));
}

function claimDailyBonus() {
  const now = nowMs();
  if (!isDailyAvailable(now)) return;
  const amount = randInt(300, 700);
  creditMoney(amount, "daily_bonus", { source: "daily bonus" });
  state.lastDailyBonusAt = now;
  saveState();
  renderAll();
}

function applyInterest(manual = true) {
  const now = nowMs();
  if (!isInterestAvailable(now)) return;
  const mods = getModifiers(state, now);
  const rate = 0.01 * mods.interestMult;
  const gross = Math.floor(state.bankBalance * rate);
  const interest = Math.min(gross, 5000);
  if (interest > 0) creditMoney(interest, "interest", { source: manual ? "manual" : "auto", rate, gross, cap: 5000 });
  state.lastInterestAt = now;
  saveState();
  renderAll();
}

function updateStreakOnMainAccept(now = nowMs()) {
  if (!state.lastMainJobClaimAt) {
    state.mainStreak = 0;
    return;
  }

  if (state.streakWindowUntil && now <= state.streakWindowUntil) {
    state.mainStreak += 1;
  } else {
    state.mainStreak = 0;
  }
}

function canAcceptMainJob(job, mods, now = nowMs()) {
  if (state.activeJobId) return { ok: false, reason: "Main job active." };
  if (state.bankLevel < job.unlockLevel) return { ok: false, reason: `Need level ${job.unlockLevel}` };
  if (job.category === "corporate" && state.reputation < 25) return { ok: false, reason: "Need rep 25" };
  if (job.riskType && mods.unlocks.riskyBlocked) return { ok: false, reason: "Pay overdue insurance" };
  return { ok: true, reason: "Accept" };
}

function acceptMainJob(jobId, fromOpportunity = false) {
  const now = nowMs();
  const job = getJobById(jobId) || (fromOpportunity && state.activeOpportunity && state.activeOpportunity.id === jobId ? {
    id: state.activeOpportunity.id,
    name: state.activeOpportunity.title,
    durationMin: state.activeOpportunity.durationMin,
    basePay: state.activeOpportunity.basePay,
    unlockLevel: 1,
    category: "general"
  } : null);

  if (!job) return;
  const mods = getModifiers(state, now);
  const can = canAcceptMainJob(job, mods, now);
  if (!can.ok) {
    alert(can.reason);
    return;
  }

  updateStreakOnMainAccept(now);

  const durationMs = Math.max(MINUTE, Math.round(job.durationMin * MINUTE * mods.durationMult));
  state.activeJobId = job.id;
  state.jobAcceptedAt = now;
  state.jobFinishAt = now + durationMs;

  if (fromOpportunity) state.activeOpportunity = null;

  saveState();
  renderAll();
}

function atomicClearMainJob() {
  const cleared = {
    id: state.activeJobId,
    acceptedAt: state.jobAcceptedAt,
    finishAt: state.jobFinishAt
  };
  state.activeJobId = null;
  state.jobAcceptedAt = null;
  state.jobFinishAt = null;
  return cleared;
}

function claimMainJob() {
  const now = nowMs();
  if (!state.activeJobId || !state.jobFinishAt || now < state.jobFinishAt) return;

  const jobId = state.activeJobId;
  const job = getJobById(jobId) || (jobId === OPPORTUNITY_TEMPLATE.id ? {
    id: OPPORTUNITY_TEMPLATE.id,
    name: OPPORTUNITY_TEMPLATE.title,
    durationMin: OPPORTUNITY_TEMPLATE.durationMin,
    basePay: OPPORTUNITY_TEMPLATE.basePay,
    unlockLevel: 1,
    category: "general"
  } : null);

  if (!job) {
    atomicClearMainJob();
    saveState();
    renderAll();
    return;
  }

  atomicClearMainJob();

  const mods = getModifiers(state, now);
  const grossBase = computeJobGrossReward(job, mods);
  const risk = job.riskType ? riskyOutcome(job, grossBase, mods) : { reward: grossBase, repDelta: 1, outcome: "standard" };
  const taxed = withTax(risk.reward);

  const streakBonusPct = getStreakBonusPct();
  const streakPayout = Math.round(taxed.payout * (1 + Math.min(0.2, streakBonusPct)));

  state.bankBalance += streakPayout;

  const xpBase = Math.ceil(job.durationMin / 2);
  const xp = Math.max(1, Math.round(xpBase * mods.xpMult));
  state.bankXP += xp;

  let threshold = state.bankLevel * 40;
  while (state.bankXP >= threshold) {
    state.bankXP -= threshold;
    state.bankLevel += 1;
    threshold = state.bankLevel * 40;
  }

  const repGain = risk.repDelta + mods.repGainBonus;
  state.reputation += repGain;

  state.lastMainJobClaimAt = now;
  state.jobCooldownUntil = null;
  state.streakWindowUntil = now + 60 * SECOND;

  addTx("job", streakPayout, {
    jobId: job.id,
    jobName: job.name,
    rewardBeforeTax: risk.reward,
    tax: taxed.tax,
    payoutAfterTax: taxed.payout,
    streakBonusPct,
    streakPayout,
    xp,
    repGain,
    outcome: risk.outcome
  });

  if (streakPayout > 5000) spawnConfetti();

  saveState();
  renderAll();
}

function acceptQuickTask(taskId) {
  const now = nowMs();
  const task = getQuickTaskById(taskId);
  if (!task) return;

  resetQuickWindowIfNeeded(now);

  if (state.quickTaskActiveId) return;
  if (state.quickTasksUsedInWindow >= 3) return;

  state.quickTaskActiveId = task.id;
  state.quickTaskAcceptedAt = now;
  state.quickTaskFinishAt = now + task.durationSec * SECOND;
  state.quickTasksUsedInWindow += 1;

  saveState();
  renderAll();
}

function atomicClearQuickTask() {
  const cleared = {
    id: state.quickTaskActiveId,
    acceptedAt: state.quickTaskAcceptedAt,
    finishAt: state.quickTaskFinishAt
  };
  state.quickTaskActiveId = null;
  state.quickTaskAcceptedAt = null;
  state.quickTaskFinishAt = null;
  return cleared;
}

function claimQuickTask() {
  const now = nowMs();
  if (!state.quickTaskActiveId || !state.quickTaskFinishAt || now < state.quickTaskFinishAt) return;

  const taskId = state.quickTaskActiveId;
  const task = getQuickTaskById(taskId);

  atomicClearQuickTask();

  if (!task) {
    saveState();
    renderAll();
    return;
  }

  const levelScale = 1 + (state.bankLevel - 1) * 0.03;
  const gross = Math.round(task.basePay * levelScale);
  const taxed = withTax(gross);

  state.bankBalance += taxed.payout;
  const xp = Math.max(1, Math.ceil(task.durationSec / 30));
  state.bankXP += xp;

  let threshold = state.bankLevel * 40;
  while (state.bankXP >= threshold) {
    state.bankXP -= threshold;
    state.bankLevel += 1;
    threshold = state.bankLevel * 40;
  }

  addTx("quick_task", taxed.payout, { taskId: task.id, taskName: task.name, gross, tax: taxed.tax, xp });

  saveState();
  renderAll();
}

function maybeExpireStreak(now = nowMs()) {
  if (state.streakWindowUntil && now > state.streakWindowUntil) {
    state.mainStreak = 0;
    state.streakWindowUntil = null;
  }
}

function setupOpportunityScheduler(now = nowMs()) {
  if (!state.nextOpportunityCheckAt) {
    state.nextOpportunityCheckAt = now + randInt(5 * MINUTE, 10 * MINUTE);
  }
}

function opportunityTick(now = nowMs()) {
  setupOpportunityScheduler(now);

  if (state.activeOpportunity && now >= state.activeOpportunity.offerExpiresAt) {
    state.activeOpportunity = null;
  }

  if (!state.activeOpportunity && now >= state.nextOpportunityCheckAt) {
    state.nextOpportunityCheckAt = now + randInt(5 * MINUTE, 10 * MINUTE);
    if (Math.random() < 0.2) {
      state.activeOpportunity = {
        id: OPPORTUNITY_TEMPLATE.id,
        title: OPPORTUNITY_TEMPLATE.title,
        durationMin: OPPORTUNITY_TEMPLATE.durationMin,
        basePay: OPPORTUNITY_TEMPLATE.basePay,
        offerExpiresAt: now + 30 * SECOND
      };
    }
  }
}

function acceptOpportunity() {
  if (!state.activeOpportunity) return;
  if (nowMs() >= state.activeOpportunity.offerExpiresAt) {
    state.activeOpportunity = null;
    saveState();
    renderAll();
    return;
  }
  acceptMainJob(state.activeOpportunity.id, true);
}

function calcBoostCost(boost) {
  return Math.round(boost.baseCost * (1 + (state.bankLevel - 1) * 0.08));
}

function buyBoost(id) {
  const now = nowMs();
  cleanupExpiredBoost(now);

  const boost = getBoostById(id);
  if (!boost) return;
  if (state.activeBoostId && state.boostEndsAt && now < state.boostEndsAt) return;

  const cost = calcBoostCost(boost);
  if (!spendMoney(cost, "boost_purchase", { boostId: boost.id, boostName: boost.name })) {
    alert("Not enough funds");
    return;
  }

  state.activeBoostId = boost.id;
  state.boostEndsAt = now + boost.durationMs;

  saveState();
  renderAll();
}

function buyTrainingPoint() {
  const cost = getTrainingCost();
  if (!spendMoney(cost, "training", { cost, points: 1 })) {
    alert("Not enough funds");
    return;
  }
  state.skillPoints += 1;
  state.trainingsBought += 1;
  saveState();
  renderAll();
}

function spendSkillPoint(skill) {
  if (!state.skillPoints) return;

  const caps = { efficiency: 10, speed: 10, luck: 10, charisma: 999 };
  const cur = state.skills[skill] || 0;
  if (cur >= caps[skill]) return;

  state.skillPoints -= 1;
  state.skills[skill] = cur + 1;
  addTx("skill_spend", 0, { skill, newValue: state.skills[skill] });
  saveState();
  renderAll();
}

function buyHousing(id) {
  const h = getHousingById(id);
  if (!h) return;

  const curIdx = HOUSING.findIndex((x) => x.id === state.ownedHousingId);
  const targetIdx = HOUSING.findIndex((x) => x.id === id);

  if (state.ownedHousingId === id) return;
  if (curIdx >= targetIdx && curIdx !== -1) return;

  if (!spendMoney(h.cost, "purchase", { category: "housing", itemId: h.id, itemName: h.name })) {
    alert("Not enough funds");
    return;
  }

  state.ownedHousingId = id;
  state.bills.rentTierId = id;
  if (!state.bills.rentDueAt) state.bills.rentDueAt = nowMs() + DAY;
  if (!state.bills.utilitiesDueAt) state.bills.utilitiesDueAt = nowMs() + 12 * HOUR;

  saveState();
  renderAll();
}

function buyVehicle(id) {
  const v = getVehicleById(id);
  if (!v) return;

  const curIdx = VEHICLES.findIndex((x) => x.id === state.ownedVehicleId);
  const targetIdx = VEHICLES.findIndex((x) => x.id === id);

  if (state.ownedVehicleId === id) return;
  if (curIdx >= targetIdx && curIdx !== -1) return;

  if (!spendMoney(v.cost, "purchase", { category: "vehicle", itemId: v.id, itemName: v.name })) {
    alert("Not enough funds");
    return;
  }

  state.ownedVehicleId = id;
  if (!state.bills.insuranceDueAt) state.bills.insuranceDueAt = nowMs() + DAY;

  saveState();
  renderAll();
}

function buyEquipment(id) {
  const eq = EQUIPMENT.find((x) => x.id === id);
  if (!eq || state.ownedEquipment[id]) return;

  if (!spendMoney(eq.cost, "purchase", { category: "equipment", itemId: eq.id, itemName: eq.name })) {
    alert("Not enough funds");
    return;
  }

  state.ownedEquipment[id] = true;
  saveState();
  renderAll();
}

function buyStoreItem(id) {
  const item = getStoreItemById(id);
  if (!item) return;

  const qty = state.ownedStoreItems[id] || 0;
  if (!item.stackable && qty > 0) return;

  if (!spendMoney(item.cost, "purchase", { category: "store", itemId: item.id, itemName: item.name })) {
    alert("Not enough funds");
    return;
  }

  state.ownedStoreItems[id] = qty + 1;
  saveState();
  renderAll();
}

function businessLevel(id) {
  return state.ownedBusinesses[id]?.level || 0;
}

function businessUpgradeCost(business, level) {
  return Math.round(business.cost * Math.pow(1.8, level));
}

function buyBusiness(id) {
  const b = getBusinessById(id);
  if (!b) return;

  const mods = getModifiers(state);
  if (!mods.unlocks.businesses) {
    alert("Business License required");
    return;
  }

  if (state.ownedBusinesses[id]) return;

  if (!spendMoney(b.cost, "purchase", { category: "business", itemId: b.id, itemName: b.name })) {
    alert("Not enough funds");
    return;
  }

  state.ownedBusinesses[id] = { level: 1, lastPaidAt: nowMs() };
  saveState();
  renderAll();
}

function upgradeBusiness(id) {
  const b = getBusinessById(id);
  const owned = state.ownedBusinesses[id];
  if (!b || !owned || owned.level >= 5) return;

  const cost = businessUpgradeCost(b, owned.level);
  if (!spendMoney(cost, "purchase", { category: "business-upgrade", itemId: b.id, itemName: b.name, targetLevel: owned.level + 1 })) {
    alert("Not enough funds");
    return;
  }

  owned.level += 1;
  saveState();
  renderAll();
}

function expectedActiveHourly(level = state.bankLevel) {
  const job = BASE_JOBS.find((j) => j.id === "delivery-route") || BASE_JOBS[2];
  const tMult = Math.min(1 + job.durationMin / 20, 6);
  const lMult = Math.min(1 + (level - 1) * 0.06, 2.5);
  const gross = Math.round(job.basePay * tMult * lMult);
  const net = withTax(gross).payout;
  const jobsPerHour = 60 / (job.durationMin + 5);
  return Math.max(3000, Math.round(net * jobsPerHour));
}

function applyPassiveIncome(now = nowMs()) {
  const mods = getModifiers(state, now);
  if (!mods.unlocks.businesses) return;

  const hourlyCap = Math.round(expectedActiveHourly(state.bankLevel) * 0.35);
  const maxPer10m = Math.floor(hourlyCap / 6);

  for (const b of BUSINESSES) {
    const owned = state.ownedBusinesses[b.id];
    if (!owned) continue;

    if (!owned.lastPaidAt) owned.lastPaidAt = now;
    if (now < owned.lastPaidAt + b.intervalMs) continue;

    const elapsed = now - owned.lastPaidAt;
    const intervals = Math.min(6, Math.floor(elapsed / b.intervalMs));
    if (intervals <= 0) continue;

    const levelMult = 1 + 0.35 * (owned.level - 1);
    const perInterval = Math.min(maxPer10m, Math.round(b.basePayout * levelMult));
    const total = perInterval * intervals;

    if (total > 0) {
      creditMoney(total, "passive_income", { businessId: b.id, businessName: b.name, intervals, perInterval, cappedBy: maxPer10m });
    }

    owned.lastPaidAt += intervals * b.intervalMs;
  }
}

function getRentAmount() {
  const h = getHousingById(state.ownedHousingId);
  return h ? h.rentPerDay : 150;
}

function getUtilityAmount() {
  const h = getHousingById(state.ownedHousingId);
  return Math.round(150 * (h ? h.utilityMult : 1));
}

function getInsuranceAmount() {
  const v = getVehicleById(state.ownedVehicleId);
  return v ? v.insurancePerDay : 90;
}

function ensureBillSchedule(now = nowMs()) {
  if (!state.bills.rentDueAt) state.bills.rentDueAt = now + DAY;
  if (!state.bills.utilitiesDueAt) state.bills.utilitiesDueAt = now + 12 * HOUR;
  if (!state.bills.insuranceDueAt) state.bills.insuranceDueAt = now + DAY;
}

function billTick(now = nowMs()) {
  ensureBillSchedule(now);

  if (state.bills.rentDueAt && now - state.bills.rentDueAt > DAY) {
    state.reputation -= 1;
    state.bills.rentDueAt += DAY;
  }
  if (state.bills.utilitiesDueAt && now - state.bills.utilitiesDueAt > 12 * HOUR) {
    state.reputation -= 1;
    state.bills.utilitiesDueAt += 12 * HOUR;
  }
  if (state.bills.insuranceDueAt && now - state.bills.insuranceDueAt > DAY) {
    state.reputation -= 2;
    state.bills.insuranceDueAt += DAY;
  }
}

function payBill(kind) {
  const now = nowMs();
  ensureBillSchedule(now);

  let amount = 0;
  let dueAt = null;
  let next = null;

  if (kind === "rent") {
    amount = getRentAmount();
    dueAt = state.bills.rentDueAt;
    next = now + DAY;
  }
  if (kind === "utilities") {
    amount = getUtilityAmount();
    dueAt = state.bills.utilitiesDueAt;
    next = now + 12 * HOUR;
  }
  if (kind === "insurance") {
    amount = getInsuranceAmount();
    dueAt = state.bills.insuranceDueAt;
    next = now + DAY;
  }

  if (!amount) return;
  if (!spendMoney(amount, "bill_payment", { billType: kind, overdue: dueAt && now > dueAt })) {
    alert("Not enough funds");
    return;
  }

  if (dueAt && now > dueAt) {
    state.bills.missedPayments += 1;
    state.reputation -= 1;
  }

  if (kind === "rent") state.bills.rentDueAt = next;
  if (kind === "utilities") state.bills.utilitiesDueAt = next;
  if (kind === "insurance") state.bills.insuranceDueAt = next;

  saveState();
  renderAll();
}

function buyReputationBoost(id) {
  const offer = getReputationOfferById(id);
  if (!offer) return;

  const last = state.repBoostCooldowns[id] || null;
  if (last && nowMs() - last < offer.cooldownMs) {
    alert("Still on cooldown");
    return;
  }

  if (!spendMoney(offer.cost, "reputation_spend", { offerId: offer.id, offerName: offer.name })) {
    alert("Not enough funds");
    return;
  }

  state.reputation += offer.repGain;
  state.reputationBoosters[id] = true;
  state.repBoostCooldowns[id] = nowMs();
  addTx("reputation_gain", 0, { repGain: offer.repGain, source: offer.name });

  saveState();
  renderAll();
}

function coinFlip(side) {
  const bet = Math.floor(Number(dom.coinFlipBetInput.value));
  const maxBet = Math.min(state.bankBalance, 5000 + state.bankLevel * 500);

  if (!Number.isFinite(bet) || bet < 10) {
    alert("Bet must be at least 10");
    return;
  }
  if (bet > maxBet) {
    alert(`Max bet is ${formatMoney(maxBet)}`);
    return;
  }

  if (!spendMoney(bet, "casino_bet", { game: "coin_flip", side, bet })) {
    alert("Not enough funds");
    return;
  }

  const outcome = Math.random() < 0.5 ? "heads" : "tails";
  const win = outcome === side;

  if (win) {
    const payout = Math.round(bet * 1.9);
    creditMoney(payout, "casino_win", { game: "coin_flip", side, outcome, bet, payout });
    state.casinoStats.wins += 1;
  } else {
    state.casinoStats.losses += 1;
  }

  dom.coinFlipResult.textContent = `Coin: ${outcome.toUpperCase()} (${win ? "WIN" : "LOSE"})`;
  saveState();
  renderAll();
}

function resetSave() {
  const ok = window.confirm("Reset all progress? This cannot be undone.");
  if (!ok) return;
  if (currentUser) localStorage.removeItem(userStateKey(currentUser));
  state = structuredClone(INITIAL_STATE);
  balanceDisplayValue = state.bankBalance;
  saveState();
  renderAll();
}

function setAuthMessage(msg) {
  dom.authMessage.textContent = msg || "";
}

function setAuthLocked(locked) {
  document.body.classList.toggle("auth-locked", locked);
  dom.authOverlay.classList.toggle("hidden", !locked);
}

function setAccountBadge() {
  if (currentUser) {
    dom.accountBadge.textContent = `@${currentUser}`;
    dom.accountBadge.classList.remove("locked");
    dom.logoutBtn.disabled = false;
  } else {
    dom.accountBadge.textContent = "Not signed in";
    dom.accountBadge.classList.add("locked");
    dom.logoutBtn.disabled = true;
  }
}

function stopGameLoop() {
  if (secondTicker) clearInterval(secondTicker);
  if (economyTicker) clearInterval(economyTicker);
  secondTicker = null;
  economyTicker = null;
}

function startSession(username) {
  currentUser = username;
  localStorage.setItem(SESSION_KEY, username);
  state = loadStateForUser(username);
  balanceDisplayValue = state.bankBalance;

  recoverState();
  setAccountBadge();
  setAuthLocked(false);
  setAuthMessage("");
  setView("bank");

  if (!gameHandlersAttached) {
    attachEvents();
    gameHandlersAttached = true;
  }

  applyInterest(false);
  economyTick();
  renderAll();

  stopGameLoop();
  secondTicker = setInterval(() => {
    renderDashboard();
    renderDailyInterest();
    renderMainJob();
    renderQuickTasks();
    renderOpportunity();
    renderSpendCards();
    renderBills();
  }, 1000);

  economyTicker = setInterval(economyTick, 30000);
}

function logout() {
  saveState();
  currentUser = null;
  localStorage.removeItem(SESSION_KEY);
  stopGameLoop();
  state = structuredClone(INITIAL_STATE);
  balanceDisplayValue = state.bankBalance;
  setAccountBadge();
  setAuthLocked(true);
  setAuthMessage("Signed out.");
}

function signUp() {
  const username = normalizeUsername(dom.authUsername.value);
  const password = dom.authPassword.value || "";

  if (username.length < 3) {
    setAuthMessage("Username must be at least 3 characters.");
    return;
  }
  if (password.length < 4) {
    setAuthMessage("Password must be at least 4 characters.");
    return;
  }

  const users = loadUsers();
  if (users[username]) {
    setAuthMessage("Username already exists. Sign in instead.");
    return;
  }

  users[username] = {
    passwordHash: simpleHash(password),
    createdAt: nowMs()
  };
  saveUsers(users);
  startSession(username);
}

function signIn() {
  const username = normalizeUsername(dom.authUsername.value);
  const password = dom.authPassword.value || "";

  if (!username || !password) {
    setAuthMessage("Enter username and password.");
    return;
  }

  const users = loadUsers();
  const user = users[username];
  if (!user || user.passwordHash !== simpleHash(password)) {
    setAuthMessage("Invalid username or password.");
    return;
  }

  startSession(username);
}

function restoreSession() {
  const sessionUser = normalizeUsername(localStorage.getItem(SESSION_KEY));
  if (!sessionUser) return false;
  const users = loadUsers();
  if (!users[sessionUser]) return false;
  startSession(sessionUser);
  return true;
}

function setView(view) {
  activeView = view;
  dom.bankView.classList.toggle("active", view === "bank");
  dom.spendView.classList.toggle("active", view === "spend");
  dom.navBankBtn.classList.toggle("btn-secondary", view !== "bank");
  dom.navSpendBtn.classList.toggle("btn-secondary", view !== "spend");
}

function renderDashboard() {
  const now = nowMs();
  cleanupExpiredBoost(now);
  maybeExpireStreak(now);

  animateBalance(state.bankBalance);

  dom.levelDisplay.textContent = String(state.bankLevel);
  dom.reputationDisplay.textContent = formatNum(state.reputation);

  const threshold = state.bankLevel * 40;
  dom.xpText.textContent = `${formatNum(state.bankXP)} / ${formatNum(threshold)}`;
  dom.xpFill.style.width = `${clamp((state.bankXP / threshold) * 100, 0, 100)}%`;

  const mods = getModifiers(state, now);
  dom.activeEffectsSummary.textContent = `Payout x${mods.payoutMult.toFixed(2)} | Duration x${mods.durationMult.toFixed(2)} | XP x${mods.xpMult.toFixed(2)} | Interest x${mods.interestMult.toFixed(2)}`;

  const streakPct = Math.round(getStreakBonusPct() * 100);
  dom.streakStatus.textContent = `Streak: ${state.mainStreak || 0} (+${streakPct}%)`;

  if (state.streakWindowUntil && now < state.streakWindowUntil) {
    dom.streakTimer.textContent = `Keep streak: start next job within ${formatDuration(state.streakWindowUntil - now)}`;
  } else if (state.lastMainJobClaimAt) {
    dom.streakTimer.textContent = "Streak window expired.";
  } else {
    dom.streakTimer.textContent = "No active streak window.";
  }
}

function renderDailyInterest() {
  const now = nowMs();

  const dailyReady = isDailyAvailable(now);
  dom.dailyBtn.disabled = !dailyReady;
  dom.dailyStatus.textContent = dailyReady ? "Daily bonus ready." : `Next daily in ${formatDuration(DAY - (now - state.lastDailyBonusAt))}`;

  const interestReady = isInterestAvailable(now);
  dom.interestBtn.disabled = !interestReady;
  dom.interestStatus.textContent = interestReady ? "Interest ready." : `Next interest in ${formatDuration(HOUR - (now - state.lastInterestAt))}`;
}

function renderMainJob() {
  const now = nowMs();
  dom.cooldownStatus.textContent = "Main-job cooldown disabled.";

  if (!state.activeJobId || !state.jobFinishAt) {
    dom.activeJobCard.classList.add("empty");
    dom.activeJobCard.innerHTML = "<p>No active main job.</p>";
    return;
  }

  const job = getJobById(state.activeJobId) || (state.activeJobId === OPPORTUNITY_TEMPLATE.id ? {
    id: OPPORTUNITY_TEMPLATE.id,
    name: OPPORTUNITY_TEMPLATE.title,
    category: "general"
  } : null);

  if (!job) {
    dom.activeJobCard.classList.add("empty");
    dom.activeJobCard.innerHTML = "<p>No active main job.</p>";
    return;
  }

  const rem = state.jobFinishAt - now;
  const ready = rem <= 0;

  dom.activeJobCard.classList.remove("empty");
  dom.activeJobCard.innerHTML = `
    <div class="job-top">
      <div>
        <strong>${job.name}</strong>
        <p class="small">Finish at ${formatDate(state.jobFinishAt)}</p>
      </div>
      <span class="tag ${job.riskType ? "risky" : ""}">${job.riskType ? "Risky" : "Main"}</span>
    </div>
    <p><strong>Countdown:</strong> ${ready ? "Ready" : formatDuration(rem)}</p>
    <button id="claimMainBtn" class="btn" ${ready ? "" : "disabled"}>Claim Main Job</button>
  `;

  const btn = document.getElementById("claimMainBtn");
  if (btn) btn.addEventListener("click", claimMainJob);
}

function renderJobBoard() {
  const now = nowMs();
  const mods = getModifiers(state, now);
  const jobs = getAllJobs();
  const showRisky = dom.riskyToggle.checked;

  dom.jobBoard.innerHTML = "";

  for (const job of jobs) {
    if (!showRisky && job.riskType) continue;

    const can = canAcceptMainJob(job, mods, now);
    const durationMs = Math.round(job.durationMin * MINUTE * mods.durationMult);
    const gross = computeJobGrossReward(job, mods);

    let expectedNet = withTax(gross).payout;
    if (job.riskType === "flip") {
      const wc = clamp(0.7 + mods.riskyLuckBonus, 0.7, 0.9);
      expectedNet = withTax(gross * (wc * 1.6 + (1 - wc) * 0.7)).payout;
    } else if (job.riskType === "contract") {
      const sc = clamp(0.65 + mods.riskyLuckBonus, 0.65, 0.9);
      expectedNet = withTax(gross * sc * 2.2).payout;
    } else if (job.riskType === "crypto") {
      expectedNet = withTax(590).payout;
    } else if (job.riskType === "insider") {
      const sc = clamp(0.45 + mods.riskyLuckBonus, 0.45, 0.75);
      expectedNet = withTax(gross * (sc * 3 + (1 - sc) * 0.25)).payout;
    }

    const min = Math.max(0, Math.floor(expectedNet * 0.85));
    const max = Math.max(min, Math.ceil(expectedNet * 1.15));

    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `
      <div class="job-top">
        <div>
          <strong>${job.name}</strong>
          <p class="small">Category: ${job.category}</p>
        </div>
        <span class="tag ${job.riskType ? "risky" : ""}">${job.riskType ? "Risky" : "Standard"}</span>
      </div>
      <p class="small">Lvl ${job.unlockLevel} | Effective duration ${(durationMs / MINUTE).toFixed(1)}m</p>
      <p class="small">Estimated payout ~${formatMoney(min)} - ${formatMoney(max)}</p>
      <button class="btn ${can.ok ? "" : "btn-secondary"}" ${can.ok ? "" : "disabled"}>${can.ok ? "Accept" : can.reason}</button>
    `;

    const btn = card.querySelector("button");
    if (btn && can.ok) btn.addEventListener("click", () => acceptMainJob(job.id));

    dom.jobBoard.appendChild(card);
  }
}

function renderQuickTasks() {
  const now = nowMs();
  resetQuickWindowIfNeeded(now);
  const left = quickTasksLeft(now);

  dom.quickQuotaStatus.textContent = `Quick tasks left in this window: ${left}/3 (reset ${formatDuration(state.quickTaskWindowResetAt - now)})`;

  if (!state.quickTaskActiveId || !state.quickTaskFinishAt) {
    dom.quickTaskActive.classList.add("empty");
    dom.quickTaskActive.innerHTML = "<p>No active quick task.</p>";
  } else {
    const task = getQuickTaskById(state.quickTaskActiveId);
    const rem = state.quickTaskFinishAt - now;
    const ready = rem <= 0;

    dom.quickTaskActive.classList.remove("empty");
    dom.quickTaskActive.innerHTML = `
      <strong>${task ? task.name : "Quick Task"}</strong>
      <p class="small">Finish at ${formatDate(state.quickTaskFinishAt)}</p>
      <p><strong>Countdown:</strong> ${ready ? "Ready" : formatDuration(rem)}</p>
      <button id="claimQuickBtn" class="btn" ${ready ? "" : "disabled"}>Claim Quick Task</button>
    `;

    const claimBtn = document.getElementById("claimQuickBtn");
    if (claimBtn) claimBtn.addEventListener("click", claimQuickTask);
  }

  dom.quickTaskBoard.innerHTML = "";

  for (const task of QUICK_TASKS) {
    const lvlScale = 1 + (state.bankLevel - 1) * 0.03;
    const est = withTax(Math.round(task.basePay * lvlScale)).payout;

    const disabled = !!state.quickTaskActiveId || left <= 0;

    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `
      <div class="job-top">
        <strong>${task.name}</strong>
        <span class="tag">Quick</span>
      </div>
      <p class="small">Duration: ${task.durationSec}s | Est payout: ${formatMoney(est)}</p>
      <button class="btn" ${disabled ? "disabled" : ""}>Accept</button>
    `;

    const btn = card.querySelector("button");
    if (btn && !disabled) btn.addEventListener("click", () => acceptQuickTask(task.id));

    dom.quickTaskBoard.appendChild(card);
  }
}

function renderOpportunity() {
  const now = nowMs();
  opportunityTick(now);

  if (!state.activeOpportunity) {
    dom.opportunityPanel.classList.add("empty");
    dom.opportunityPanel.innerHTML = "<p>No flash contract right now.</p>";
    return;
  }

  const rem = state.activeOpportunity.offerExpiresAt - now;
  if (rem <= 0) {
    state.activeOpportunity = null;
    saveState();
    dom.opportunityPanel.classList.add("empty");
    dom.opportunityPanel.innerHTML = "<p>No flash contract right now.</p>";
    return;
  }

  const mods = getModifiers(state, now);
  const pseudoJob = {
    id: state.activeOpportunity.id,
    name: state.activeOpportunity.title,
    durationMin: state.activeOpportunity.durationMin,
    basePay: state.activeOpportunity.basePay,
    unlockLevel: 1,
    category: "general"
  };

  const gross = computeJobGrossReward(pseudoJob, mods) * 2;
  const net = withTax(gross).payout;

  const can = canAcceptMainJob(pseudoJob, mods, now);

  dom.opportunityPanel.classList.remove("empty");
  dom.opportunityPanel.innerHTML = `
    <strong>Flash Contract available!</strong>
    <p class="small">Accept within ${formatDuration(rem)}</p>
    <p class="small">Duration: 2m | Est payout: ${formatMoney(net)}</p>
    <button id="acceptOppBtn" class="btn" ${can.ok ? "" : "disabled"}>${can.ok ? "Accept" : can.reason}</button>
  `;

  const btn = document.getElementById("acceptOppBtn");
  if (btn && can.ok) btn.addEventListener("click", acceptOpportunity);
}

function renderTxLog() {
  const recent = state.txLog.slice(0, 10);
  dom.txLog.innerHTML = "";

  if (!recent.length) {
    dom.txLog.innerHTML = '<p class="small">No transactions yet.</p>';
    return;
  }

  for (const tx of recent) {
    const el = document.createElement("div");
    el.className = "tx-item";

    const amountClass = tx.amount > 0 ? "plus" : tx.amount < 0 ? "minus" : "";
    const title = tx.type.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

    let details = "";
    if (tx.meta.jobName) details = tx.meta.jobName;
    else if (tx.meta.taskName) details = tx.meta.taskName;
    else if (tx.meta.businessName) details = `${tx.meta.businessName} x${tx.meta.intervals || 1}`;
    else if (tx.meta.itemName) details = tx.meta.itemName;
    else if (tx.meta.offerName) details = tx.meta.offerName;
    else if (tx.meta.game) details = tx.meta.game;
    else if (tx.meta.billType) details = tx.meta.billType;

    el.innerHTML = `
      <div class="tx-left">
        <strong>${title}</strong>
        <span class="small">${formatDate(tx.ts)}${details ? ` | ${details}` : ""}</span>
      </div>
      <span class="tx-amount ${amountClass}">${tx.amount === 0 ? "" : tx.amount > 0 ? "+" : ""}${formatMoney(tx.amount)}</span>
    `;

    dom.txLog.appendChild(el);
  }
}

function buildStoreCard({ title, desc, cost, effect, tag, disabled, buttonText, onClick }) {
  const card = document.createElement("div");
  card.className = "shop-card";

  card.innerHTML = `
    <div class="job-top">
      <strong>${title}</strong>
      <span class="tag ${tag === "Locked" ? "locked" : ""}">${tag}</span>
    </div>
    <p class="small">${desc}</p>
    <p class="small">Cost: ${formatMoney(cost)}</p>
    <p class="small">Effect: ${effect}</p>
    <button class="btn" ${disabled ? "disabled" : ""}>${buttonText}</button>
  `;

  const btn = card.querySelector("button");
  if (btn && !disabled) btn.addEventListener("click", onClick);
  return card;
}

function renderSpendFilters() {
  dom.spendFilters.innerHTML = "";
  for (const c of CATEGORIES) {
    const btn = document.createElement("button");
    btn.className = `btn ${selectedCategory === c ? "" : "btn-secondary"}`;
    btn.textContent = c;
    btn.addEventListener("click", () => {
      selectedCategory = c;
      renderSpendCards();
    });
    dom.spendFilters.appendChild(btn);
  }
}

function renderSpendCards() {
  const mods = getModifiers(state, nowMs());
  dom.spendCards.innerHTML = "";

  if (selectedCategory === "Housing") {
    for (let i = 0; i < HOUSING.length; i++) {
      const h = HOUSING[i];
      const curIdx = HOUSING.findIndex((x) => x.id === state.ownedHousingId);
      const owned = state.ownedHousingId === h.id;
      const canBuy = i > curIdx;

      dom.spendCards.appendChild(buildStoreCard({
        title: h.name,
        desc: `Rent ${formatMoney(h.rentPerDay)}/day`,
        cost: h.cost,
        effect: `+${Math.round(h.payoutBonus * 100)}% payout`,
        tag: owned ? "Owned" : canBuy ? "Available" : "Locked",
        disabled: owned || !canBuy || !canAfford(h.cost),
        buttonText: owned ? "Owned" : canBuy ? "Buy" : "Upgrade first",
        onClick: () => buyHousing(h.id)
      }));
    }
  }

  if (selectedCategory === "Vehicles") {
    for (let i = 0; i < VEHICLES.length; i++) {
      const v = VEHICLES[i];
      const curIdx = VEHICLES.findIndex((x) => x.id === state.ownedVehicleId);
      const owned = state.ownedVehicleId === v.id;
      const canBuy = i > curIdx;

      dom.spendCards.appendChild(buildStoreCard({
        title: v.name,
        desc: `Insurance ${formatMoney(v.insurancePerDay)}/day`,
        cost: v.cost,
        effect: `-${Math.round(v.durationReduction * 100)}% job duration`,
        tag: owned ? "Owned" : canBuy ? "Available" : "Locked",
        disabled: owned || !canBuy || !canAfford(v.cost),
        buttonText: owned ? "Owned" : canBuy ? "Buy" : "Upgrade first",
        onClick: () => buyVehicle(v.id)
      }));
    }
  }

  if (selectedCategory === "Equipment") {
    for (const eq of EQUIPMENT) {
      const owned = !!state.ownedEquipment[eq.id];
      dom.spendCards.appendChild(buildStoreCard({
        title: eq.name,
        desc: eq.desc,
        cost: eq.cost,
        effect: eq.desc,
        tag: owned ? "Owned" : "Available",
        disabled: owned || !canAfford(eq.cost),
        buttonText: owned ? "Owned" : "Buy",
        onClick: () => buyEquipment(eq.id)
      }));
    }
  }

  if (selectedCategory === "Businesses") {
    if (!mods.unlocks.businesses) {
      const p = document.createElement("p");
      p.className = "small";
      p.textContent = "Buy Business License to unlock businesses.";
      dom.spendCards.appendChild(p);
    } else {
      for (const b of BUSINESSES) {
        const owned = state.ownedBusinesses[b.id];
        if (!owned) {
          dom.spendCards.appendChild(buildStoreCard({
            title: b.name,
            desc: b.desc,
            cost: b.cost,
            effect: `${formatMoney(b.basePayout)} every 10m`,
            tag: "Available",
            disabled: !canAfford(b.cost),
            buttonText: "Buy",
            onClick: () => buyBusiness(b.id)
          }));
        } else {
          const upCost = owned.level >= 5 ? 0 : businessUpgradeCost(b, owned.level);
          dom.spendCards.appendChild(buildStoreCard({
            title: `${b.name} (Lv ${owned.level})`,
            desc: `Last paid ${formatDate(owned.lastPaidAt)}`,
            cost: upCost,
            effect: "Upgrade boosts payout (+35% per level)",
            tag: owned.level >= 5 ? "Max" : "Owned",
            disabled: owned.level >= 5 || !canAfford(upCost),
            buttonText: owned.level >= 5 ? "Max" : "Upgrade",
            onClick: () => upgradeBusiness(b.id)
          }));
        }
      }
    }
  }

  if (selectedCategory === "Store") {
    for (const s of STORE_ITEMS) {
      const qty = state.ownedStoreItems[s.id] || 0;
      const owned = qty > 0;
      dom.spendCards.appendChild(buildStoreCard({
        title: `${s.name}${s.stackable ? ` x${qty}` : ""}`,
        desc: s.desc,
        cost: s.cost,
        effect: s.desc,
        tag: s.stackable ? `Qty ${qty}` : owned ? "Owned" : "Available",
        disabled: (!s.stackable && owned) || !canAfford(s.cost),
        buttonText: s.stackable ? "Buy" : owned ? "Owned" : "Buy",
        onClick: () => buyStoreItem(s.id)
      }));
    }
  }

  if (selectedCategory === "Boosts") {
    cleanupExpiredBoost();

    const active = state.activeBoostId && state.boostEndsAt && nowMs() < state.boostEndsAt;

    for (const b of BOOSTS) {
      const cost = calcBoostCost(b);
      dom.spendCards.appendChild(buildStoreCard({
        title: b.name,
        desc: b.desc,
        cost,
        effect: active && state.activeBoostId === b.id ? `Active (${formatDuration(state.boostEndsAt - nowMs())})` : b.desc,
        tag: active && state.activeBoostId === b.id ? "Active" : "Available",
        disabled: active || !canAfford(cost),
        buttonText: active ? "Boost Active" : "Buy",
        onClick: () => buyBoost(b.id)
      }));
    }
  }

  if (selectedCategory === "Skills") {
    const p = document.createElement("p");
    p.className = "small";
    p.textContent = "Use the Skills & Training panel to buy and assign points.";
    dom.spendCards.appendChild(p);
  }

  if (selectedCategory === "Bills") {
    const overdue = getOverdueBills();
    const c = Object.values(overdue).filter(Boolean).length;
    const p = document.createElement("p");
    p.className = "small";
    p.textContent = c ? `${c} overdue bill(s): payout penalty active${overdue.insurance ? ", risky jobs blocked" : ""}.` : "No bill penalties active.";
    dom.spendCards.appendChild(p);
  }

  if (selectedCategory === "Reputation") {
    for (const r of REPUTATION_OFFERS) {
      const last = state.repBoostCooldowns[r.id] || null;
      const cooldownLeft = last ? Math.max(0, r.cooldownMs - (nowMs() - last)) : 0;
      const ready = cooldownLeft <= 0;

      dom.spendCards.appendChild(buildStoreCard({
        title: r.name,
        desc: r.desc,
        cost: r.cost,
        effect: ready ? `Gain +${r.repGain} reputation` : `Cooldown ${formatDuration(cooldownLeft)}`,
        tag: ready ? "Available" : "Locked",
        disabled: !ready || !canAfford(r.cost),
        buttonText: ready ? "Buy" : "Cooldown",
        onClick: () => buyReputationBoost(r.id)
      }));
    }
  }

  if (selectedCategory === "Casino") {
    const p = document.createElement("p");
    p.className = "small";
    p.textContent = "Coin Flip is available in the dedicated panel below.";
    dom.spendCards.appendChild(p);
  }
}

function renderInventory() {
  const mods = getModifiers(state);
  const lines = [];

  const h = getHousingById(state.ownedHousingId);
  const v = getVehicleById(state.ownedVehicleId);

  if (h) lines.push(`Housing: ${h.name}`);
  if (v) lines.push(`Vehicle: ${v.name}`);

  const eq = EQUIPMENT.filter((x) => state.ownedEquipment[x.id]).map((x) => x.name);
  if (eq.length) lines.push(`Equipment: ${eq.join(", ")}`);

  const store = STORE_ITEMS.filter((x) => (state.ownedStoreItems[x.id] || 0) > 0).map((x) => x.stackable ? `${x.name} x${state.ownedStoreItems[x.id]}` : x.name);
  if (store.length) lines.push(`Store: ${store.join(", ")}`);

  const biz = BUSINESSES.filter((x) => state.ownedBusinesses[x.id]).map((x) => `${x.name} Lv${state.ownedBusinesses[x.id].level}`);
  if (biz.length) lines.push(`Businesses: ${biz.join(", ")}`);

  if (state.activeBoostId && state.boostEndsAt && nowMs() < state.boostEndsAt) {
    const b = getBoostById(state.activeBoostId);
    if (b) lines.push(`Active boost: ${b.name} (${formatDuration(state.boostEndsAt - nowMs())})`);
  }

  if (!lines.length) lines.push("No owned assets yet.");

  lines.push(`Caps enforced: payout <= x2.5, duration reduction <= 40%`);
  lines.push(`Effective: payout x${mods.payoutMult.toFixed(2)}, duration x${mods.durationMult.toFixed(2)}, xp x${mods.xpMult.toFixed(2)}`);

  dom.inventoryPanel.innerHTML = "";
  for (const text of lines) {
    const el = document.createElement("div");
    el.className = "inventory-item";
    el.textContent = text;
    dom.inventoryPanel.appendChild(el);
  }
}

function renderSkills() {
  dom.skillPointsDisplay.textContent = `Skill Points: ${state.skillPoints}`;
  const tCost = getTrainingCost();
  dom.trainingCostText.textContent = `Training cost: ${formatMoney(tCost)} (trainings bought: ${state.trainingsBought})`;
  dom.buyTrainingBtn.disabled = !canAfford(tCost);

  const caps = { efficiency: 10, speed: 10, luck: 10, charisma: 999 };
  const desc = {
    efficiency: "+2% payout per point (cap +20%)",
    speed: "-2% duration per point (cap -20%)",
    luck: "risky odds bonus (cap +0.15)",
    charisma: "+1 rep per main job for each 3 points"
  };

  dom.skillsPanel.innerHTML = "";

  for (const key of Object.keys(state.skills)) {
    const value = state.skills[key] || 0;
    const capped = value >= caps[key];

    const row = document.createElement("div");
    row.className = "skill-row";
    row.innerHTML = `
      <div class="row-between">
        <strong>${key[0].toUpperCase()}${key.slice(1)}: ${value}${capped ? " (capped)" : ""}</strong>
        <button class="btn" ${state.skillPoints > 0 && !capped ? "" : "disabled"}>+1</button>
      </div>
      <p class="small">${desc[key]}</p>
    `;

    const btn = row.querySelector("button");
    if (btn && state.skillPoints > 0 && !capped) {
      btn.addEventListener("click", () => spendSkillPoint(key));
    }

    dom.skillsPanel.appendChild(row);
  }
}

function renderCoinFlip() {
  const maxBet = Math.min(state.bankBalance, 5000 + state.bankLevel * 500);
  dom.coinFlipMaxBet.textContent = `Max bet: ${formatMoney(maxBet)} | Payout: 1.9x`;
  dom.casinoStats.textContent = `Coin Flip stats: ${state.casinoStats.wins} wins / ${state.casinoStats.losses} losses`;
}

function renderBills() {
  ensureBillSchedule();
  dom.billsPanel.innerHTML = "";

  const entries = [
    { key: "rent", name: "Rent", amount: getRentAmount(), dueAt: state.bills.rentDueAt, interval: "24h" },
    { key: "utilities", name: "Utilities", amount: getUtilityAmount(), dueAt: state.bills.utilitiesDueAt, interval: "12h" },
    { key: "insurance", name: "Insurance", amount: getInsuranceAmount(), dueAt: state.bills.insuranceDueAt, interval: "24h" }
  ];

  for (const b of entries) {
    const overdue = b.dueAt && nowMs() > b.dueAt;

    const card = document.createElement("div");
    card.className = "bill-item";
    card.innerHTML = `
      <div class="job-top">
        <strong>${b.name}</strong>
        <span class="tag ${overdue ? "risky" : ""}">${overdue ? "Overdue" : "On time"}</span>
      </div>
      <p class="small">Amount: ${formatMoney(b.amount)} every ${b.interval}</p>
      <p class="small">Due: ${formatDate(b.dueAt)}</p>
      <button class="btn" ${canAfford(b.amount) ? "" : "disabled"}>Pay</button>
    `;

    const btn = card.querySelector("button");
    if (btn && canAfford(b.amount)) btn.addEventListener("click", () => payBill(b.key));

    dom.billsPanel.appendChild(card);
  }

  const info = document.createElement("div");
  info.className = "bill-item";
  const overdue = getOverdueBills();
  const count = Object.values(overdue).filter(Boolean).length;
  info.innerHTML = `<p class="small">Missed payments: ${state.bills.missedPayments}. Overdue: ${count}. Penalties are mild payout reductions; overdue insurance blocks risky jobs.</p>`;
  dom.billsPanel.appendChild(info);
}

function renderSpendArea() {
  renderSpendFilters();
  renderSpendCards();
  renderInventory();
  renderSkills();
  renderCoinFlip();
  renderBills();
}

function renderAll() {
  renderDashboard();
  renderDailyInterest();
  renderMainJob();
  renderJobBoard();
  renderQuickTasks();
  renderOpportunity();
  renderTxLog();
  renderSpendArea();
}

function economyTick() {
  if (!currentUser) return;
  const now = nowMs();
  cleanupExpiredBoost(now);
  maybeExpireStreak(now);
  opportunityTick(now);
  applyPassiveIncome(now);
  billTick(now);
  state.expectedActiveHourlySnapshot = expectedActiveHourly(state.bankLevel);
  saveState();
  renderAll();
}

function attachAuthEvents() {
  dom.loginBtn.addEventListener("click", signIn);
  dom.signupBtn.addEventListener("click", signUp);
  dom.authPassword.addEventListener("keydown", (e) => {
    if (e.key === "Enter") signIn();
  });
  dom.logoutBtn.addEventListener("click", logout);
}

function attachEvents() {
  dom.navBankBtn.addEventListener("click", () => setView("bank"));
  dom.navSpendBtn.addEventListener("click", () => setView("spend"));

  dom.resetBtn.addEventListener("click", resetSave);
  dom.dailyBtn.addEventListener("click", claimDailyBonus);
  dom.interestBtn.addEventListener("click", () => applyInterest(true));
  dom.riskyToggle.addEventListener("change", renderJobBoard);

  dom.buyTrainingBtn.addEventListener("click", buyTrainingPoint);
  dom.coinHeadsBtn.addEventListener("click", () => coinFlip("heads"));
  dom.coinTailsBtn.addEventListener("click", () => coinFlip("tails"));
}

function recoverState() {
  if (!state.activeJobId && (state.jobAcceptedAt || state.jobFinishAt)) {
    state.jobAcceptedAt = null;
    state.jobFinishAt = null;
  }

  if (state.activeJobId && !getJobById(state.activeJobId) && state.activeJobId !== OPPORTUNITY_TEMPLATE.id) {
    state.activeJobId = null;
    state.jobAcceptedAt = null;
    state.jobFinishAt = null;
  }

  if (state.quickTaskActiveId && !getQuickTaskById(state.quickTaskActiveId)) {
    state.quickTaskActiveId = null;
    state.quickTaskAcceptedAt = null;
    state.quickTaskFinishAt = null;
  }

  state.jobCooldownUntil = null;

  if (!Array.isArray(state.txLog)) state.txLog = [];
  state.txLog = state.txLog.slice(0, 25);

  ensureBillSchedule();
  setupOpportunityScheduler();
  cleanupExpiredBoost();
  resetQuickWindowIfNeeded();
}

function init() {
  attachAuthEvents();
  setAccountBadge();
  window.addEventListener("beforeunload", saveState);

  const resumed = restoreSession();
  if (!resumed) {
    setAuthLocked(true);
    setAuthMessage("Sign in to continue.");
    renderAll();
  }
}

init();
