(() => {
  const STORAGE_KEY = "fakebank_state_v1";
  const LOCAL_USER_KEY = "fakebank_local_user";
  const REQUIRED_FIREBASE_KEYS = ["apiKey", "authDomain", "projectId", "appId"];

  const SCHEMA_VERSION = 2;
  const XP_PER_LEVEL_BASE = 40;
  const MAIN_COOLDOWN_MS = 5 * 60 * 1000;
  const QUICK_WINDOW_MS = 5 * 60 * 1000;
  const QUICK_MAX_IN_WINDOW = 3;
  const STREAK_WINDOW_MS = 60 * 1000;

  const MAIN_JOBS = [
    { id: "data_entry", name: "Data Entry", durationMin: 2, basePay: 40, unlockLevel: 1, category: "general" },
    { id: "deliver_package", name: "Deliver Package", durationMin: 5, basePay: 90, unlockLevel: 1, category: "labor" },
    { id: "fast_food", name: "Fast Food Shift", durationMin: 10, basePay: 180, unlockLevel: 1, category: "labor" },
    { id: "warehouse", name: "Warehouse Shift", durationMin: 30, basePay: 700, unlockLevel: 3, category: "labor" },
    { id: "route", name: "Delivery Route", durationMin: 45, basePay: 1100, unlockLevel: 4, category: "labor" },
    { id: "night_shift", name: "Night Shift", durationMin: 60, basePay: 1500, unlockLevel: 5, category: "general" },
    { id: "crypto", name: "Crypto Trading", durationMin: 20, basePay: 500, unlockLevel: 7, category: "risky", riskType: "crypto" },
    { id: "flip", name: "Investment Flip", durationMin: 60, basePay: 1500, unlockLevel: 8, category: "risky", riskType: "flip" },
    { id: "contract", name: "High Stakes Contract", durationMin: 120, basePay: 2800, unlockLevel: 10, category: "risky", riskType: "contract" }
  ];

  const QUICK_TASKS = [
    { id: "survey", name: "Answer Survey", durationSec: 45, basePay: 35 },
    { id: "sorting", name: "Package Sorting", durationSec: 30, basePay: 25 },
    { id: "sprint", name: "Delivery Sprint", durationSec: 60, basePay: 60 },
    { id: "support", name: "Customer Support Reply", durationSec: 50, basePay: 45 }
  ];

  const BOOST_SHOP = [
    { id: "focus", name: "Work Focus", baseCost: 2500, type: "moneyMultiplier", value: 0.15, durationMs: 5 * 60 * 1000 },
    { id: "drink", name: "Energy Drink", baseCost: 3000, type: "cooldownReduction", value: 0.15, durationMs: 5 * 60 * 1000 },
    { id: "charm", name: "Lucky Charm", baseCost: 4000, type: "luckBonus", value: 0.10, durationMs: 5 * 60 * 1000 }
  ];

  const ITEM_CATALOG = [
    {
      id: "energy_drink",
      name: "Energy Drink",
      price: 120,
      description: "Cuts cooldown and duration for a short burst.",
      maxStack: 25,
      icon: "⚡",
      boost: { type: "cooldownReduction", value: 0.12, durationMs: 21 * 60 * 60 * 1000 }
    },
    {
      id: "coffee",
      name: "Premium Coffee",
      price: 180,
      description: "Boosts payout multiplier for 4 minutes.",
      maxStack: 25,
      icon: "☕",
      boost: { type: "moneyMultiplier", value: 0.10, durationMs: 21 * 60 * 60 * 1000 }
    },
    {
      id: "protein_bar",
      name: "Protein Bar",
      price: 260,
      description: "Adds payout bonus for next 4 payout events.",
      maxStack: 20,
      icon: "🍫",
      boost: { type: "payoutBonusNextN", value: 0.08, durationMs: 21 * 60 * 60 * 1000, remainingUses: 4 }
    },
    {
      id: "lucky_coin",
      name: "Lucky Coin",
      price: 340,
      description: "Improves risky outcome odds for 6 minutes.",
      maxStack: 15,
      icon: "🪙",
      boost: { type: "luckBonus", value: 0.08, durationMs: 21 * 60 * 60 * 1000 }
    }
  ];

  const CARRIERS = ["USPS", "UPS", "FedEx", "DHL", "MegaShip"];

  const BUSINESSES = [
    { id: "lemonade", name: "Lemonade Stand", icon: "🍋", baseCost: 10000, intervalMs: 2 * 60 * 1000, basePayout: 50, unlockType: "totalEarned", unlockValue: 0 },
    { id: "hotdog", name: "Hotdog Stand", icon: "🌭", baseCost: 25000, intervalMs: 2 * 60 * 1000, basePayout: 120, unlockType: "totalEarned", unlockValue: 500 },
    { id: "pizza", name: "Pizza Delivery", icon: "🍕", baseCost: 75000, intervalMs: 2 * 60 * 1000, basePayout: 260, unlockType: "totalEarned", unlockValue: 2500 },
    { id: "coffee_shop", name: "Coffee Shop", icon: "☕", baseCost: 150000, intervalMs: 2 * 60 * 1000, basePayout: 420, unlockType: "totalEarned", unlockValue: 8000 },
    { id: "film_studio", name: "Film Studio", icon: "🎬", baseCost: 600000, intervalMs: 2 * 60 * 1000, basePayout: 1400, unlockType: "totalEarned", unlockValue: 25000 },
    { id: "firm", name: "Investment Firm", icon: "🏦", baseCost: 1000000, intervalMs: 2 * 60 * 1000, basePayout: 0, unlockType: "totalEarned", unlockValue: 70000 }
  ];

  const BUSINESS_UPGRADES = [
    { id: "profit_boost_1", name: "Profit Boost I", cost: 85000, desc: "x1.25 payout on all businesses." },
    { id: "speed_boost_1", name: "Speed Boost I", cost: 90000, desc: "Cycle time -10% on all businesses." }
  ];

  const SKILL_CAPS = { efficiency: 10, speed: 10, luck: 10, charisma: 30 };

  const dom = {
    authScreen: document.getElementById("authScreen"),
    gameScreen: document.getElementById("gameScreen"),
    usernameInput: document.getElementById("usernameInput"),
    passwordInput: document.getElementById("passwordInput"),
    loginBtn: document.getElementById("loginBtn"),
    signupBtn: document.getElementById("signupBtn"),
    guestBtn: document.getElementById("guestBtn"),
    logoutBtn: document.getElementById("logoutBtn"),
    whoami: document.getElementById("whoami"),
    authError: document.getElementById("authError"),
    setupMessage: document.getElementById("setupMessage"),

    tabBankBtn: document.getElementById("tabBankBtn"),
    tabSpendBtn: document.getElementById("tabSpendBtn"),
    tabStoreBtn: document.getElementById("tabStoreBtn"),
    tabInventoryBtn: document.getElementById("tabInventoryBtn"),
    tabOrdersBtn: document.getElementById("tabOrdersBtn"),

    bankTab: document.getElementById("bankTab"),
    spendTab: document.getElementById("spendTab"),
    storeTab: document.getElementById("storeTab"),
    inventoryTab: document.getElementById("inventoryTab"),
    ordersTab: document.getElementById("ordersTab"),

    saveStatus: document.getElementById("saveStatus"),
    saveNowBtn: document.getElementById("saveNowBtn"),
    resetSaveBtn: document.getElementById("resetSaveBtn"),

    balanceText: document.getElementById("balanceText"),
    levelText: document.getElementById("levelText"),
    xpText: document.getElementById("xpText"),
    repText: document.getElementById("repText"),
    xpBar: document.getElementById("xpBar"),
    dailyBtn: document.getElementById("dailyBtn"),
    interestBtn: document.getElementById("interestBtn"),
    dailyStatus: document.getElementById("dailyStatus"),
    interestStatus: document.getElementById("interestStatus"),

    mainJobStatus: document.getElementById("mainJobStatus"),
    mainSlotsText: document.getElementById("mainSlotsText"),
    mainJobTimer: document.getElementById("mainJobTimer"),
    mainFinishAt: document.getElementById("mainFinishAt"),
    claimMainJobBtn: document.getElementById("claimMainJobBtn"),
    activeJobsList: document.getElementById("activeJobsList"),
    cooldownStatus: document.getElementById("cooldownStatus"),
    streakText: document.getElementById("streakText"),
    streakWindowText: document.getElementById("streakWindowText"),
    jobBoard: document.getElementById("jobBoard"),

    quickQuotaText: document.getElementById("quickQuotaText"),
    quickTaskStatus: document.getElementById("quickTaskStatus"),
    quickTaskTimer: document.getElementById("quickTaskTimer"),
    claimQuickTaskBtn: document.getElementById("claimQuickTaskBtn"),
    quickTaskBoard: document.getElementById("quickTaskBoard"),

    opportunityStatus: document.getElementById("opportunityStatus"),
    opportunityTimer: document.getElementById("opportunityTimer"),
    acceptOpportunityBtn: document.getElementById("acceptOpportunityBtn"),
    nextOpportunityText: document.getElementById("nextOpportunityText"),

    txLog: document.getElementById("txLog"),

    boostStatus: document.getElementById("boostStatus"),
    boostShop: document.getElementById("boostShop"),
    skillPointText: document.getElementById("skillPointText"),
    trainingCostText: document.getElementById("trainingCostText"),
    buyTrainingBtn: document.getElementById("buyTrainingBtn"),
    parallelUpgradeText: document.getElementById("parallelUpgradeText"),
    buyParallelUpgradeBtn: document.getElementById("buyParallelUpgradeBtn"),
    skillsPanel: document.getElementById("skillsPanel"),
    businessPanel: document.getElementById("businessPanel"),
    businessMoneyBar: document.getElementById("businessMoneyBar"),
    restartBusinessesBtn: document.getElementById("restartBusinessesBtn"),
    bizTabBusinessesBtn: document.getElementById("bizTabBusinessesBtn"),
    bizTabUpgradesBtn: document.getElementById("bizTabUpgradesBtn"),
    bizTabManagersBtn: document.getElementById("bizTabManagersBtn"),
    bizTabStatsBtn: document.getElementById("bizTabStatsBtn"),
    bizPanelBusinesses: document.getElementById("bizPanelBusinesses"),
    bizPanelUpgrades: document.getElementById("bizPanelUpgrades"),
    bizPanelManagers: document.getElementById("bizPanelManagers"),
    bizPanelStats: document.getElementById("bizPanelStats"),
    businessUpgradesPanel: document.getElementById("businessUpgradesPanel"),
    businessManagersPanel: document.getElementById("businessManagersPanel"),
    businessStatsPanel: document.getElementById("businessStatsPanel"),

    coinBetInput: document.getElementById("coinBetInput"),
    coinFlipBtn: document.getElementById("coinFlipBtn"),
    coinFlipHint: document.getElementById("coinFlipHint"),
    coinFlipStats: document.getElementById("coinFlipStats"),

    storeList: document.getElementById("storeList"),
    shopLastUpdated: document.getElementById("shopLastUpdated"),
    inventoryList: document.getElementById("inventoryList"),
    activeBoostList: document.getElementById("activeBoostList"),
    effectiveModsText: document.getElementById("effectiveModsText"),
    ordersList: document.getElementById("ordersList"),
    trackPanel: document.getElementById("trackPanel"),
    trackingSearchInput: document.getElementById("trackingSearchInput"),
    trackingSearchBtn: document.getElementById("trackingSearchBtn"),

    toast: document.getElementById("toast"),
    confettiLayer: document.getElementById("confettiLayer")
  };

  const state = loadLocalState();
  let selectedTrackOrderId = null;
  let balanceDisplay = state.bankBalance;
  let gameStarted = false;

  let auth = null;
  let db = null;
  let currentUid = null;
  let firebaseReady = false;
  let localAuthMode = false;

  let tick1sHandle = null;
  let tick30sHandle = null;
  let tick12sHandle = null;
  let saveTimer = null;
  let saveInFlight = false;
  let cloudDirty = false;

  let purchaseLock = false;
  let serverSession = { username: "", password: "" };
  let serverShopSlots = [];
  let serverShopLastUpdatedAt = null;
  let serverOrders = [];
  let activeBusinessTab = "businesses";
  let serverMirrorSaveTimer = null;
  let serverReachable = false;

  let firebaseApi = {
    onAuthStateChanged: null,
    createUserWithEmailAndPassword: null,
    signInWithEmailAndPassword: null,
    signOut: null,
    doc: null,
    getDoc: null,
    setDoc: null,
    updateDoc: null,
    serverTimestamp: null
  };

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function uniqueId(prefix) {
    const n = crypto && crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(2)) : [Date.now(), Math.floor(Math.random() * 1e9)];
    return `${prefix}_${n[0].toString(36)}${n[1].toString(36)}`;
  }

  function trackingNumber() {
    let digits = "";
    for (let i = 0; i < 10; i += 1) digits += String(randInt(0, 9));
    return `MS${digits}`;
  }

  function fmtMoney(v) {
    return `$${Math.max(0, Math.floor(v)).toLocaleString()}`;
  }

  function fmtDur(ms) {
    if (!Number.isFinite(ms) || ms <= 0) return "00:00";
    const total = Math.floor(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function fmtTs(ts) {
    return ts ? new Date(ts).toLocaleString() : "--";
  }

  function toast(msg) {
    if (!dom.toast) return;
    dom.toast.textContent = msg;
    dom.toast.classList.remove("hidden");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => dom.toast.classList.add("hidden"), 2400);
  }

  function setSaveStatus(status, detail = "") {
    if (!dom.saveStatus) return;
    const suffix = detail ? ` (${detail})` : "";
    if (status === "saved") dom.saveStatus.textContent = `Save status: Saved${suffix}`;
    else if (status === "saving") dom.saveStatus.textContent = `Save status: Saving...${suffix}`;
    else if (status === "offline") dom.saveStatus.textContent = `Save status: Offline / pending${suffix}`;
    else dom.saveStatus.textContent = `Save status: Save failed${suffix}`;
  }

  function hasServerSession() {
    return Boolean(serverSession.username && serverSession.password);
  }

  function setServerSession(username, password) {
    serverSession = { username: String(username || ""), password: String(password || "") };
    if (serverSession.username) localStorage.setItem("server_shop_username", serverSession.username);
    if (serverSession.password) sessionStorage.setItem("server_shop_password", serverSession.password);
  }

  function clearServerSession() {
    serverSession = { username: "", password: "" };
    localStorage.removeItem("server_shop_username");
    sessionStorage.removeItem("server_shop_password");
  }

  async function postJson(url, payload) {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      const err = new Error(data?.error || `Request failed (${resp.status})`);
      err.status = resp.status;
      throw err;
    }
    return data;
  }

  function getDefaultState() {
    const now = Date.now();
    return {
      schemaVersion: SCHEMA_VERSION,
      bankBalance: 500,
      bankLevel: 1,
      bankXP: 0,
      reputation: 0,
      txLog: [],

      activeJobs: [],
      jobCooldownUntil: null,
      parallelJobUpgradeLevel: 0,

      quickTaskActiveId: null,
      quickTaskAcceptedAt: null,
      quickTaskFinishAt: null,
      quickTasksUsedInWindow: 0,
      quickTaskWindowResetAt: now + QUICK_WINDOW_MS,

      mainStreak: 0,
      streakWindowUntil: null,
      lastMainJobClaimAt: null,

      activeOpportunity: null,
      nextOpportunityCheckAt: now + randInt(5 * 60 * 1000, 10 * 60 * 1000),

      inventory: {},
      orders: {},
      activeBoosts: {},

      skillPoints: 0,
      trainingsBought: 0,
      skills: { efficiency: 0, speed: 0, luck: 0, charisma: 0 },
      totalEarned: 0,
      upgrades: {},

      ownedBusinesses: {},
      casinoStats: { wins: 0, losses: 0 },

      lastDailyBonusAt: null,
      lastInterestAt: null,

      passiveCapWindowStart: now,
      passiveEarnedInWindow: 0
    };
  }

  function deepMerge(defaultObj, loadedObj) {
    if (Array.isArray(defaultObj)) return Array.isArray(loadedObj) ? loadedObj : defaultObj;
    if (defaultObj && typeof defaultObj === "object") {
      const out = { ...defaultObj };
      if (loadedObj && typeof loadedObj === "object") {
        for (const key of Object.keys(loadedObj)) {
          out[key] = deepMerge(defaultObj[key], loadedObj[key]);
        }
      }
      return out;
    }
    return loadedObj === undefined ? defaultObj : loadedObj;
  }

  function migrateState(raw) {
    const defaults = getDefaultState();
    const merged = deepMerge(defaults, raw || {});
    if (!merged.schemaVersion || merged.schemaVersion < SCHEMA_VERSION) {
      merged.schemaVersion = SCHEMA_VERSION;
    }
    if (!merged.orders || typeof merged.orders !== "object") merged.orders = {};
    if (!merged.inventory || typeof merged.inventory !== "object") merged.inventory = {};
    if (!merged.activeBoosts || typeof merged.activeBoosts !== "object") merged.activeBoosts = {};
    if (!merged.upgrades || typeof merged.upgrades !== "object") merged.upgrades = {};
    if (!Number.isFinite(merged.totalEarned)) merged.totalEarned = 0;
    if (!merged.ownedBusinesses || typeof merged.ownedBusinesses !== "object") merged.ownedBusinesses = {};
    for (const [bizId, val] of Object.entries(merged.ownedBusinesses)) {
      if (!val || typeof val !== "object") {
        merged.ownedBusinesses[bizId] = { level: 0, lastPaidAt: Date.now(), hasManager: false, needsRestart: false };
        continue;
      }
      if (!Number.isFinite(val.level)) val.level = 0;
      if (!Number.isFinite(val.lastPaidAt)) val.lastPaidAt = Date.now();
      if (typeof val.hasManager !== "boolean") val.hasManager = false;
      if (typeof val.needsRestart !== "boolean") val.needsRestart = false;
    }
    if (!Array.isArray(merged.activeJobs)) {
      merged.activeJobs = [];
      if (merged.activeJobId && merged.jobFinishAt) {
        merged.activeJobs.push({
          runId: uniqueId("job"),
          jobId: merged.activeJobId,
          name: merged.activeJobMeta?.name || merged.activeJobId,
          durationMin: merged.activeJobMeta?.durationMin || 1,
          basePay: merged.activeJobMeta?.basePay || 1,
          riskType: merged.activeJobMeta?.riskType || null,
          category: merged.activeJobMeta?.category || "general",
          acceptedAt: merged.jobAcceptedAt || Date.now(),
          finishAt: merged.jobFinishAt
        });
      }
    }
    if (typeof merged.parallelJobUpgradeLevel !== "number" || merged.parallelJobUpgradeLevel < 0) {
      merged.parallelJobUpgradeLevel = 0;
    }
    return merged;
  }

  function loadLocalState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return getDefaultState();
      return migrateState(JSON.parse(raw));
    } catch {
      return getDefaultState();
    }
  }

  function replaceState(next) {
    const fresh = migrateState(next);
    Object.keys(state).forEach((k) => delete state[k]);
    Object.assign(state, fresh);
  }

  function exportGameStateForSave() {
    return JSON.parse(JSON.stringify(state));
  }

  function saveLocalState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function saveState() {
    saveLocalState();
    scheduleAutosave();
    scheduleServerMirrorSave();
  }

  async function loadUserGameState(uid) {
    if (!firebaseReady || !uid) return;
    const userRef = firebaseApi.doc(db, "users", uid);
    const snap = await firebaseApi.getDoc(userRef);
    if (!snap.exists()) {
      const initial = getDefaultState();
      replaceState(initial);
      await firebaseApi.setDoc(userRef, {
        email: auth.currentUser?.email || "",
        createdAt: firebaseApi.serverTimestamp(),
        updatedAt: firebaseApi.serverTimestamp(),
        gameState: initial
      }, { merge: true });
      setSaveStatus("saved");
      return;
    }
    const data = snap.data() || {};
    const loaded = migrateState(data.gameState || {});
    replaceState(loaded);
    saveLocalState();
    setSaveStatus("saved");
  }

  async function saveUserGameState(uid, gameState) {
    if (!firebaseReady || !uid) return;
    const userRef = firebaseApi.doc(db, "users", uid);
    await firebaseApi.setDoc(userRef, {
      email: auth.currentUser?.email || "",
      updatedAt: firebaseApi.serverTimestamp(),
      gameState
    }, { merge: true });
  }

  async function flushCloudSave() {
    if (!firebaseReady || !currentUid || !cloudDirty || saveInFlight) return;
    saveInFlight = true;
    cloudDirty = false;
    setSaveStatus("saving");
    try {
      await saveUserGameState(currentUid, exportGameStateForSave());
      setSaveStatus("saved");
    } catch (err) {
      cloudDirty = true;
      setSaveStatus(navigator.onLine ? "error" : "offline", err?.code || "");
    } finally {
      saveInFlight = false;
      if (cloudDirty) scheduleAutosave();
    }
  }

  function scheduleAutosave() {
    if (!firebaseReady || !currentUid) {
      if (localAuthMode) setSaveStatus("saved", "local");
      return;
    }
    cloudDirty = true;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      flushCloudSave();
    }, 500);
  }

  async function flushServerMirrorSave() {
    if (!hasServerSession()) return;
    try {
      await postJson("/api/progress/save", {
        username: serverSession.username,
        password: serverSession.password,
        progress: exportGameStateForSave()
      });
      serverReachable = true;
    } catch {
      serverReachable = false;
    }
  }

  function scheduleServerMirrorSave() {
    if (!hasServerSession()) return;
    clearTimeout(serverMirrorSaveTimer);
    serverMirrorSaveTimer = setTimeout(() => {
      flushServerMirrorSave();
    }, 700);
  }

  function showAuthScreen() {
    dom.authScreen.classList.remove("hidden");
    dom.gameScreen.classList.add("hidden");
  }

  function showGameScreen() {
    dom.authScreen.classList.add("hidden");
    dom.gameScreen.classList.remove("hidden");
  }

  function usernameToEmail(usernameRaw) {
    const clean = String(usernameRaw || "").trim().toLowerCase();
    const safe = clean.replace(/[^a-z0-9._-]/g, "");
    return safe ? `${safe}@player.fakebank.local` : "";
  }

  function setAuthError(msg) {
    dom.authError.textContent = msg || "";
  }

  function formatAuthError(err) {
    const code = err?.code || "";
    if (code.includes("invalid-credential") || code.includes("wrong-password")) return "Invalid username or password.";
    if (code.includes("user-not-found")) return "No account found for that username.";
    if (code.includes("email-already-in-use")) return "Username already exists.";
    if (code.includes("weak-password")) return "Password must be at least 6 characters.";
    if (code.includes("network-request-failed")) return "Network error. Try again.";
    if (code.includes("too-many-requests")) return "Too many attempts. Try later.";
    return `Something went wrong. Please try again.${code ? ` (${code})` : ""}`;
  }

  function bindAuthEvents() {
    dom.loginBtn.onclick = async () => {
      setAuthError("");
      const username = String(dom.usernameInput.value || "").trim();
      const email = usernameToEmail(username);
      const password = dom.passwordInput.value;
      if (!username || !password) {
        setAuthError("Enter username and password.");
        return;
      }

      if (!firebaseReady) {
        setAuthError("Cloud login is unavailable on this page. Open your deployed site URL to sync across devices.");
        return;
      }

      try {
        await firebaseApi.signInWithEmailAndPassword(auth, email, password);
        setServerSession(username, password);
      } catch (err) {
        setAuthError(formatAuthError(err));
      }
    };

    dom.signupBtn.onclick = async () => {
      setAuthError("");
      const username = String(dom.usernameInput.value || "").trim();
      const email = usernameToEmail(username);
      const password = dom.passwordInput.value;
      if (!username || !password) {
        setAuthError("Enter username and password.");
        return;
      }

      if (!firebaseReady) {
        setAuthError("Cloud sign up is unavailable on this page. Open your deployed site URL to sync across devices.");
        return;
      }

      try {
        await firebaseApi.createUserWithEmailAndPassword(auth, email, password);
        setServerSession(username, password);
      } catch (err) {
        setAuthError(formatAuthError(err));
      }
    };

    dom.guestBtn.onclick = async () => {
      clearServerSession();
      localStorage.setItem(LOCAL_USER_KEY, "guest");
      localAuthMode = true;
      await handleAuthState({ uid: "local_guest", email: "guest@local.test" });
    };

    dom.logoutBtn.onclick = async () => {
      if (localAuthMode) {
        localStorage.removeItem(LOCAL_USER_KEY);
        clearServerSession();
        currentUid = null;
        showAuthScreen();
        dom.whoami.textContent = "";
        return;
      }
      if (!firebaseReady) return;
      await firebaseApi.signOut(auth);
      clearServerSession();
    };

    dom.passwordInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") dom.loginBtn.click();
    });
  }

  async function initFirebaseServices() {
    if (location.protocol === "file:") {
      localAuthMode = false;
      dom.setupMessage.textContent = "Cloud login is disabled on file://. Use your deployed URL for cross-device saves, or Play As Guest for local test mode.";
      return;
    }

    const hasRequired = (cfg) => Boolean(cfg) && REQUIRED_FIREBASE_KEYS.every((k) => Boolean(cfg[k]));

    if (!hasRequired(window.FIREBASE_CONFIG)) {
      try {
        const resp = await fetch("/api/firebase-config-data", { cache: "no-store" });
        if (resp.ok) {
          const payload = await resp.json();
          if (payload?.config) {
            window.FIREBASE_CONFIG = payload.config;
            window.FIREBASE_CONFIG_SOURCE = payload.source || "api/firebase-config-data";
            window.FIREBASE_CONFIG_ERROR = "";
          } else if (payload?.error) {
            window.FIREBASE_CONFIG_ERROR = payload.error;
          }
        }
      } catch {
        // ignored
      }
    }

    if (typeof window.FIREBASE_CONFIG === "string") {
      try {
        window.FIREBASE_CONFIG = JSON.parse(window.FIREBASE_CONFIG);
      } catch (err) {
        dom.setupMessage.textContent = err.message;
        return;
      }
    }

    if (!hasRequired(window.FIREBASE_CONFIG)) {
      dom.setupMessage.textContent = window.FIREBASE_CONFIG_ERROR || "Cloud sign up is not set up yet. Use Play As Guest.";
      return;
    }

    try {
      const mod = await import("./firebase.js");
      const result = mod.initFirebase();
      if (!result.ok) {
        dom.setupMessage.textContent = result.message;
        return;
      }
      auth = result.auth;
      db = result.db;
      firebaseReady = true;
      firebaseApi = {
        onAuthStateChanged: mod.onAuthStateChanged,
        createUserWithEmailAndPassword: mod.createUserWithEmailAndPassword,
        signInWithEmailAndPassword: mod.signInWithEmailAndPassword,
        signOut: mod.signOut,
        doc: mod.doc,
        getDoc: mod.getDoc,
        setDoc: mod.setDoc,
        updateDoc: mod.updateDoc,
        serverTimestamp: mod.serverTimestamp
      };
      dom.setupMessage.textContent = "";
    } catch (err) {
      dom.setupMessage.textContent = err?.message || "Firebase failed to initialize.";
    }
  }

  async function handleAuthState(user) {
    if (!user) {
      currentUid = null;
      showAuthScreen();
      dom.whoami.textContent = "";
      return;
    }
    currentUid = user.uid;
    try {
      if (!localAuthMode) await loadUserGameState(user.uid);
      else replaceState(loadLocalState());
      balanceDisplay = state.bankBalance;
    } catch {
      // keep local state
    }

    const uname = user.email ? user.email.split("@")[0] : "Player";
    dom.whoami.textContent = `Signed in as ${uname}`;
    if (hasServerSession()) {
      await flushServerMirrorSave();
      await refreshRotatingShop(true);
      await refreshServerOrders();
    }
    showGameScreen();
    if (!gameStarted) startGame();
    else render();
  }

  function addTx(type, amount, meta = {}) {
    if (Number(amount) > 0) {
      state.totalEarned = Math.max(0, Number(state.totalEarned || 0) + Number(amount));
    }
    state.txLog.unshift({ ts: Date.now(), type, amount, meta });
    state.txLog = state.txLog.slice(0, 25);
  }

  function gainXP(amount) {
    state.bankXP += amount;
    let threshold = state.bankLevel * XP_PER_LEVEL_BASE;
    while (state.bankXP >= threshold) {
      state.bankXP -= threshold;
      state.bankLevel += 1;
      threshold = state.bankLevel * XP_PER_LEVEL_BASE;
    }
  }

  function removeExpiredBoosts(now = Date.now()) {
    for (const [boostId, boost] of Object.entries(state.activeBoosts)) {
      const doneByTime = boost.endsAt && now >= boost.endsAt;
      const doneByUses = boost.type === "payoutBonusNextN" && (boost.remainingUses || 0) <= 0;
      if (doneByTime || doneByUses) {
        delete state.activeBoosts[boostId];
      }
    }
  }

  function collectBoostEffects(now = Date.now()) {
    removeExpiredBoosts(now);

    let moneyMult = 0;
    let payoutBonusNextN = 0;
    let cooldownReduction = 0;
    let luckBonus = 0;

    for (const boost of Object.values(state.activeBoosts)) {
      if (boost.endsAt && now >= boost.endsAt) continue;
      if (boost.type === "moneyMultiplier") moneyMult += boost.value;
      if (boost.type === "payoutBonusNextN" && (boost.remainingUses || 0) > 0) payoutBonusNextN += boost.value;
      if (boost.type === "cooldownReduction") cooldownReduction += boost.value;
      if (boost.type === "luckBonus") luckBonus += boost.value;
    }

    return {
      moneyMult,
      payoutBonusNextN,
      cooldownReduction,
      luckBonus
    };
  }

  function consumePayoutBonusUses() {
    for (const [boostId, boost] of Object.entries(state.activeBoosts)) {
      if (boost.type !== "payoutBonusNextN") continue;
      if ((boost.remainingUses || 0) <= 0) continue;
      boost.remainingUses -= 1;
      if (boost.remainingUses <= 0) delete state.activeBoosts[boostId];
    }
  }

  function getModifiers(now = Date.now()) {
    const skills = state.skills || {};
    const efficiency = Math.min(skills.efficiency || 0, 10);
    const speed = Math.min(skills.speed || 0, 10);
    const luck = Math.min(skills.luck || 0, 10);
    const charisma = Math.max(0, skills.charisma || 0);

    const boosts = collectBoostEffects(now);

    let payoutMult = 1 + efficiency * 0.02 + boosts.moneyMult;
    let durationMult = 1 - speed * 0.02;
    let xpMult = 1;
    let interestMult = 1;
    let riskyLuckBonus = Math.min(0.15, luck * 0.015) + boosts.luckBonus;

    durationMult *= Math.max(0.2, 1 - boosts.cooldownReduction * 0.65);

    payoutMult = Math.min(2.5, payoutMult);
    durationMult = Math.max(0.60, durationMult);
    riskyLuckBonus = Math.min(0.35, riskyLuckBonus);

    return {
      payoutMult,
      durationMult,
      xpMult,
      interestMult,
      riskyLuckBonus,
      repGainBonus: Math.floor(charisma / 3),
      payoutBonusNextN: boosts.payoutBonusNextN,
      cooldownReduction: Math.min(0.40, boosts.cooldownReduction)
    };
  }

  function streakBonusPct() {
    const s = state.mainStreak || 0;
    if (s >= 10) return 0.15;
    if (s >= 5) return 0.08;
    if (s >= 2) return 0.03;
    return 0;
  }

  function calcMainBaseReward(job) {
    const timeMultiplier = Math.min(1 + job.durationMin / 20, 6);
    const levelMultiplier = Math.min(1 + (state.bankLevel - 1) * 0.06, 2.5);
    return Math.round(job.basePay * timeMultiplier * levelMultiplier);
  }

  function rollRiskyReward(job, baseReward, luckBonus) {
    if (!job.riskType) return { reward: baseReward, repDelta: 1 };
    const r = Math.random();

    if (job.riskType === "crypto") {
      const shift = Math.min(luckBonus, 0.12);
      const p1 = 0.60 - shift;
      const p2 = 0.30;
      const p3 = 0.09 + shift * 0.7;
      if (r < p1) return { reward: randInt(0, 400), repDelta: 1 };
      if (r < p1 + p2) return { reward: randInt(400, 1200), repDelta: 1 };
      if (r < p1 + p2 + p3) return { reward: randInt(1200, 3000), repDelta: 1 };
      return { reward: randInt(3000, 5000), repDelta: 1 };
    }

    if (job.riskType === "flip") {
      const winChance = Math.min(0.70 + luckBonus * 0.5, 0.85);
      if (r < winChance) return { reward: Math.round(baseReward * 1.6), repDelta: 1 };
      return { reward: Math.round(baseReward * 0.7), repDelta: -2 };
    }

    if (job.riskType === "contract") {
      const successChance = Math.min(0.65 + luckBonus * 0.45, 0.80);
      if (r < successChance) return { reward: Math.round(baseReward * 2.2), repDelta: 1 };
      return { reward: 0, repDelta: -4 };
    }

    return { reward: baseReward, repDelta: 1 };
  }

  function canTakeMainJob(now = Date.now()) {
    if (state.activeJobs.length >= getMaxConcurrentJobs()) return { ok: false, reason: "All job slots are full." };
    return { ok: true, reason: "" };
  }

  function getMaxConcurrentJobs() {
    return 3 + (state.parallelJobUpgradeLevel || 0);
  }

  function getParallelUpgradeCost() {
    return Math.round(5000 * Math.pow(1.9, state.parallelJobUpgradeLevel || 0));
  }

  function buyParallelUpgrade() {
    const level = state.parallelJobUpgradeLevel || 0;
    const cost = getParallelUpgradeCost();
    if (state.bankBalance < cost) {
      toast("Not enough money for upgrade.");
      return;
    }
    state.bankBalance -= cost;
    state.parallelJobUpgradeLevel = level + 1;
    addTx("parallel_upgrade", -cost, { level: state.parallelJobUpgradeLevel, maxJobs: getMaxConcurrentJobs() });
    saveState();
    render();
    toast(`Job slots upgraded. Max jobs: ${getMaxConcurrentJobs()}`);
  }

  function acceptMainJob(jobId, asOpportunity = false) {
    const now = Date.now();
    const job = MAIN_JOBS.find((j) => j.id === jobId);
    if (!job) return;
    if (state.bankLevel < job.unlockLevel) return;

    const check = canTakeMainJob(now);
    if (!check.ok) return;

    if (state.streakWindowUntil && now <= state.streakWindowUntil) state.mainStreak += 1;
    else state.mainStreak = 0;

    const mods = getModifiers(now);
    const effectiveDurationMs = Math.max(30 * 1000, Math.round(job.durationMin * 60 * 1000 * mods.durationMult));

    state.activeJobs.push({
      runId: uniqueId("job"),
      jobId: job.id,
      name: asOpportunity ? "Flash Contract" : job.name,
      durationMin: job.durationMin,
      basePay: asOpportunity ? Math.round(job.basePay * 2) : job.basePay,
      riskType: job.riskType || null,
      category: job.category || "general",
      acceptedAt: now,
      finishAt: now + effectiveDurationMs
    });

    if (asOpportunity) state.activeOpportunity = null;

    saveState();
    render();
  }

  function claimMainJob(runId = null) {
    const now = Date.now();
    let idx = -1;
    if (runId) idx = state.activeJobs.findIndex((j) => j.runId === runId);
    if (idx < 0) idx = state.activeJobs.findIndex((j) => now >= j.finishAt);
    if (idx < 0) return;

    const job = { ...state.activeJobs[idx] };
    if (now < job.finishAt) return;

    state.activeJobs.splice(idx, 1);
    saveState();

    const mods = getModifiers(now);
    let reward = Math.round(calcMainBaseReward(job) * mods.payoutMult);
    const risky = rollRiskyReward(job, reward, mods.riskyLuckBonus);
    reward = Math.round(risky.reward);

    const tax = Math.floor(reward * 0.10);
    let payout = reward - tax;

    payout = Math.round(payout * (1 + streakBonusPct()));
    if (mods.payoutBonusNextN > 0) {
      payout = Math.round(payout * (1 + mods.payoutBonusNextN));
      consumePayoutBonusUses();
    }

    state.bankBalance += payout;
    const xpBase = Math.ceil(job.durationMin / 2);
    gainXP(Math.ceil(xpBase * mods.xpMult));
    state.reputation += risky.repDelta + mods.repGainBonus;

    state.lastMainJobClaimAt = now;
    state.streakWindowUntil = now + STREAK_WINDOW_MS;

    addTx("main_job", payout, { job: job.name, gross: reward, tax, streakBonus: streakBonusPct() });
    if (payout > 5000) confettiBurst();

    saveState();
    render();
  }

  function resetQuickWindow(now = Date.now()) {
    if (!state.quickTaskWindowResetAt || now >= state.quickTaskWindowResetAt) {
      state.quickTasksUsedInWindow = 0;
      state.quickTaskWindowResetAt = now + QUICK_WINDOW_MS;
    }
  }

  function acceptQuickTask(taskId) {
    const now = Date.now();
    resetQuickWindow(now);
    if (state.quickTaskActiveId) return;
    if (state.quickTasksUsedInWindow >= QUICK_MAX_IN_WINDOW) return;

    const task = QUICK_TASKS.find((q) => q.id === taskId);
    if (!task) return;

    state.quickTaskActiveId = task.id;
    state.quickTaskAcceptedAt = now;
    state.quickTaskFinishAt = now + task.durationSec * 1000;
    state.quickTasksUsedInWindow += 1;

    saveState();
    render();
  }

  function claimQuickTask() {
    const now = Date.now();
    if (!state.quickTaskActiveId || !state.quickTaskFinishAt || now < state.quickTaskFinishAt) return;

    const task = QUICK_TASKS.find((q) => q.id === state.quickTaskActiveId);
    if (!task) return;

    state.quickTaskActiveId = null;
    state.quickTaskAcceptedAt = null;
    state.quickTaskFinishAt = null;
    saveState();

    const scaled = Math.round(task.basePay * (1 + (state.bankLevel - 1) * 0.03));
    const tax = Math.floor(scaled * 0.10);
    let payout = scaled - tax;

    const mods = getModifiers(now);
    if (mods.payoutBonusNextN > 0) {
      payout = Math.round(payout * (1 + mods.payoutBonusNextN));
      consumePayoutBonusUses();
    }

    state.bankBalance += payout;
    gainXP(Math.max(1, Math.ceil(task.durationSec / 35)));
    addTx("quick_task", payout, { task: task.name, gross: scaled, tax });

    saveState();
    render();
  }

  function opportunityCheck() {
    const now = Date.now();

    if (state.activeOpportunity && now >= state.activeOpportunity.offerExpiresAt) {
      state.activeOpportunity = null;
    }

    if (!state.nextOpportunityCheckAt) {
      state.nextOpportunityCheckAt = now + randInt(5 * 60 * 1000, 10 * 60 * 1000);
    }

    if (!state.activeOpportunity && now >= state.nextOpportunityCheckAt) {
      state.nextOpportunityCheckAt = now + randInt(5 * 60 * 1000, 10 * 60 * 1000);
      if (Math.random() < 0.20) {
        state.activeOpportunity = {
          id: uniqueId("opp"),
          title: "Flash Contract",
          durationMin: 2,
          basePay: 80,
          offerExpiresAt: now + 30 * 1000
        };
      }
    }
  }

  function acceptOpportunity() {
    const now = Date.now();
    const opp = state.activeOpportunity;
    if (!opp) return;
    if (now > opp.offerExpiresAt) {
      state.activeOpportunity = null;
      saveState();
      render();
      return;
    }

    const tempJob = {
      id: opp.id,
      name: opp.title,
      durationMin: opp.durationMin,
      basePay: opp.basePay,
      unlockLevel: 1,
      category: "general"
    };

    MAIN_JOBS.push(tempJob);
    acceptMainJob(tempJob.id, true);
    MAIN_JOBS.pop();
  }

  function boostCost(boost) {
    return Math.round(boost.baseCost * (1 + (state.bankLevel - 1) * 0.08));
  }

  function buyBoost(boostId) {
    const now = Date.now();
    const boost = BOOST_SHOP.find((b) => b.id === boostId);
    if (!boost) return;

    const cost = boostCost(boost);
    if (state.bankBalance < cost) {
      toast("Not enough money for boost.");
      return;
    }

    state.bankBalance -= cost;
    const entryId = uniqueId(`boost_${boost.id}`);
    state.activeBoosts[entryId] = {
      itemId: boost.id,
      type: boost.type,
      value: boost.value,
      startedAt: now,
      endsAt: now + boost.durationMs
    };

    addTx("boost_purchase", -cost, { boost: boost.name });
    saveState();
    render();
    toast(`${boost.name} activated.`);
  }

  function getTrainingCost() {
    return Math.round(25000 * Math.pow(1.25, state.trainingsBought || 0));
  }

  function buyTrainingPoint() {
    const cost = getTrainingCost();
    if (state.bankBalance < cost) return;
    state.bankBalance -= cost;
    state.skillPoints += 1;
    state.trainingsBought += 1;
    addTx("training", -cost, { gain: 1 });
    saveState();
    render();
  }

  function spendSkillPoint(skill) {
    if (!state.skillPoints) return;
    if (!Object.prototype.hasOwnProperty.call(state.skills, skill)) return;
    const cap = SKILL_CAPS[skill] || 10;
    if (state.skills[skill] >= cap) return;

    state.skills[skill] += 1;
    state.skillPoints -= 1;
    saveState();
    render();
  }

  function businessEntry(id, createIfMissing = true) {
    if (!state.ownedBusinesses[id] && createIfMissing) {
      state.ownedBusinesses[id] = { level: 0, lastPaidAt: Date.now(), hasManager: false, needsRestart: false };
    }
    return state.ownedBusinesses[id];
  }

  function businessUpgradeCost(biz, level) {
    return 250;
  }

  function managerCostForBusiness(biz) {
    return Math.round(biz.baseCost * 10);
  }

  function isBusinessUnlocked(biz) {
    if (!biz) return false;
    if (biz.unlockType === "prevLevel") {
      const prev = BUSINESSES[BUSINESSES.findIndex((x) => x.id === biz.id) - 1];
      if (!prev) return true;
      const prevEnt = businessEntry(prev.id, false);
      return Number(prevEnt?.level || 0) >= Number(biz.unlockValue || 1);
    }
    return Number(state.totalEarned || 0) >= Number(biz.unlockValue || 0);
  }

  function businessGlobalProfitMult() {
    let mult = 1;
    if (state.upgrades?.profit_boost_1) mult *= 1.25;
    return mult;
  }

  function businessGlobalSpeedMult() {
    let mult = 1;
    if (state.upgrades?.speed_boost_1) mult *= 0.9;
    return mult;
  }

  function businessIntervalMs(biz) {
    return Math.max(2 * 60 * 1000, Math.round(biz.intervalMs * businessGlobalSpeedMult()));
  }

  function businessPayoutPerInterval(biz, ent, mods) {
    if (!biz || !ent || ent.level <= 0) return 0;
    if (biz.id === "firm") {
      let payout = Math.min(
        Math.floor(state.bankBalance * 0.01 * (1 + 0.25 * (ent.level - 1))),
        Math.round(10000 * (1 + 0.2 * (ent.level - 1)))
      );
      payout = Math.floor(payout * businessGlobalProfitMult() * (ent.hasManager ? 1.05 : 1));
      return payout;
    }
    return Math.floor(
      biz.basePayout *
      (1 + 0.35 * (ent.level - 1)) *
      mods.payoutMult *
      businessGlobalProfitMult() *
      (ent.hasManager ? 1.05 : 1)
    );
  }

  function buyOrUpgradeBusiness(id) {
    const biz = BUSINESSES.find((b) => b.id === id);
    if (!biz) return;
    if (!isBusinessUnlocked(biz)) {
      toast("This business is locked.");
      return;
    }

    const ent = businessEntry(id);
    if (ent.level >= 5) return;

    const cost = businessUpgradeCost(biz, ent.level);
    if (state.bankBalance < cost) return;

    state.bankBalance -= cost;
    ent.level += 1;
    if (!ent.lastPaidAt) ent.lastPaidAt = Date.now();

    addTx("business_upgrade", -cost, { business: biz.name, level: ent.level });
    saveState();
    render();
  }

  function buyBusinessUpgrade(upgradeId) {
    const upgrade = BUSINESS_UPGRADES.find((u) => u.id === upgradeId);
    if (!upgrade) return;
    if (state.upgrades[upgradeId]) return;
    if (state.bankBalance < upgrade.cost) {
      toast("Not enough money for upgrade.");
      return;
    }
    state.bankBalance -= upgrade.cost;
    state.upgrades[upgradeId] = true;
    addTx("business_global_upgrade", -upgrade.cost, { upgrade: upgrade.name });
    saveState();
    render();
  }

  function hireBusinessManager(id) {
    const biz = BUSINESSES.find((b) => b.id === id);
    if (!biz) return;
    const ent = businessEntry(id, false);
    if (!ent || ent.level <= 0 || ent.hasManager) return;
    const cost = managerCostForBusiness(biz);
    if (state.bankBalance < cost) {
      toast("Not enough money to hire manager.");
      return;
    }
    state.bankBalance -= cost;
    ent.hasManager = true;
    addTx("manager_hired", -cost, { business: biz.name });
    saveState();
    render();
  }

  function restartAllBusinesses() {
    toast("Businesses auto-restart now.");
  }

  function expectedActiveHourly() {
    const lvlFactor = 1 + state.bankLevel * 0.15;
    return Math.round(2200 * lvlFactor);
  }

  function processPassiveIncome() {
    const now = Date.now();
    const mods = getModifiers(now);
    let changed = false;

    for (const biz of BUSINESSES) {
      const ent = state.ownedBusinesses[biz.id];
      if (!ent || ent.level <= 0) continue;
      const last = ent.lastPaidAt || now;
      const intervalMs = businessIntervalMs(biz);
      let intervals = Math.floor((now - last) / intervalMs);
      if (intervals <= 0) continue;
      intervals = Math.min(intervals, 6);

      let payoutEach = businessPayoutPerInterval(biz, ent, mods);

      let total = payoutEach * intervals;
      if (mods.payoutBonusNextN > 0) {
        total = Math.round(total * (1 + mods.payoutBonusNextN));
        consumePayoutBonusUses();
      }
      if (total <= 0) {
        ent.lastPaidAt = now;
        continue;
      }

      state.bankBalance += total;
      ent.lastPaidAt = now;
      ent.needsRestart = false;

      addTx("passive_income", total, { business: biz.name, intervals });
      changed = true;
    }

    return changed;
  }

  function claimDailyBonus() {
    const now = Date.now();
    if (state.lastDailyBonusAt && now - state.lastDailyBonusAt < 24 * 60 * 60 * 1000) return;
    const bonus = randInt(300, 700);
    state.bankBalance += bonus;
    state.lastDailyBonusAt = now;
    addTx("daily_bonus", bonus);
    saveState();
    render();
  }

  function applyInterest() {
    const now = Date.now();
    if (state.lastInterestAt && now - state.lastInterestAt < 60 * 60 * 1000) return;

    const mods = getModifiers(now);
    let interest = Math.floor(state.bankBalance * 0.01 * mods.interestMult);
    interest = Math.min(interest, 5000);
    if (interest <= 0) return;

    state.bankBalance += interest;
    state.lastInterestAt = now;
    addTx("interest", interest);

    saveState();
    render();
  }

  function coinFlip() {
    const bet = Math.floor(Number(dom.coinBetInput.value));
    if (!Number.isFinite(bet) || bet <= 0) return;

    const maxBet = Math.min(state.bankBalance, 5000 + state.bankLevel * 500);
    if (bet > maxBet) {
      dom.coinFlipHint.textContent = `Max bet is ${fmtMoney(maxBet)}.`;
      return;
    }

    if (bet > state.bankBalance) return;

    state.bankBalance -= bet;
    const win = Math.random() < 0.5;

    if (win) {
      const payout = Math.floor(bet * 1.9);
      state.bankBalance += payout;
      state.casinoStats.wins += 1;
      addTx("coin_flip", payout - bet, { bet, outcome: "win" });
      dom.coinFlipHint.textContent = `Win. Net +${fmtMoney(payout - bet)}.`;
    } else {
      state.casinoStats.losses += 1;
      addTx("coin_flip", -bet, { bet, outcome: "loss" });
      dom.coinFlipHint.textContent = `Loss. -${fmtMoney(bet)}.`;
    }

    saveState();
    render();
  }

  function itemById(itemId) {
    return ITEM_CATALOG.find((i) => i.id === itemId);
  }

  function deriveOrderStatus(order, now = Date.now()) {
    if (!order) return "Processing";
    if (["Processing", "Shipped", "OutForDelivery", "Delivered", "Cancelled"].includes(order.status)) {
      if (order.status === "Cancelled") return "Cancelled";
      if (now >= Number(order.etaAt || 0)) return "Delivered";
      if (now >= Number(order.outForDeliveryAt || 0)) return "OutForDelivery";
      if (now >= Number(order.shippedAt || 0)) return "Shipped";
      return "Processing";
    }
    if (order.status === "cancelled") return "Cancelled";
    if (now < order.shippedAt) return "Processing";
    if (now < order.outForDeliveryAt) return "Shipped";
    if (now < order.deliveredAt) return "OutForDelivery";
    return "Delivered";
  }

  function statusBadge(status) {
    if (status === "OutForDelivery") return "Out for Delivery";
    if (status === "out_for_delivery") return "Out for Delivery";
    return String(status || "").replace(/_/g, " ");
  }

  function updateOrderStatuses(now = Date.now()) {
    for (const order of Object.values(state.orders)) {
      const next = deriveOrderStatus(order, now);
      if (order.status !== next) {
        order.status = next;
        order.lastStatusUpdateAt = now;
      }
    }
  }

  async function refreshRotatingShop(force = false) {
    if (!hasServerSession() && !localAuthMode) return;
    if (!force && serverShopSlots.length) return;
    try {
      const resp = await fetch("/api/shop", { cache: "no-store" });
      if (!resp.ok) throw new Error(`Shop fetch failed (${resp.status})`);
      const data = await resp.json();
      serverShopSlots = Array.isArray(data.slots) ? data.slots : [];
      serverShopLastUpdatedAt = data.lastUpdatedAt || Date.now();
      serverReachable = true;
    } catch {
      serverReachable = false;
    }
  }

  async function refreshServerOrders() {
    if (!hasServerSession()) return;
    try {
      const data = await postJson("/api/orders/list", {
        username: serverSession.username,
        password: serverSession.password
      });
      serverOrders = Array.isArray(data.orders) ? data.orders : [];
      const progressResp = await postJson("/api/progress/load", {
        username: serverSession.username,
        password: serverSession.password
      });
      if (progressResp?.progress && typeof progressResp.progress === "object") {
        const progress = progressResp.progress;
        if (typeof progress.bankBalance === "number") state.bankBalance = progress.bankBalance;
        if (progress.inventory && typeof progress.inventory === "object") state.inventory = progress.inventory;
        if (typeof progress.totalEarned === "number") state.totalEarned = progress.totalEarned;
        if (progress.upgrades && typeof progress.upgrades === "object") state.upgrades = progress.upgrades;
        if (progress.ownedBusinesses && typeof progress.ownedBusinesses === "object") state.ownedBusinesses = progress.ownedBusinesses;
      }
      serverReachable = true;
    } catch {
      serverReachable = false;
    }
  }

  async function trackOrderByTrackingId() {
    const trackingId = String(dom.trackingSearchInput?.value || "").trim();
    if (!trackingId) return;
    if (!hasServerSession()) {
      toast("Log in to track cloud orders.");
      return;
    }
    try {
      const data = await postJson("/api/orders/track", {
        username: serverSession.username,
        password: serverSession.password,
        trackingId
      });
      if (data?.order) {
        const existing = serverOrders.findIndex((x) => x.orderId === data.order.orderId);
        if (existing >= 0) serverOrders[existing] = data.order;
        else serverOrders.unshift(data.order);
        selectedTrackOrderId = data.order.orderId;
        render();
      }
    } catch (err) {
      toast(err.message || "Tracking lookup failed.");
    }
  }

  async function placeSingleItemOrder(itemId, preferredSlotId = "") {
    if (purchaseLock) return;
    purchaseLock = true;
    try {
      const item = itemById(itemId);
      if (!item) return;

      if (hasServerSession()) {
        await flushServerMirrorSave();
        await refreshRotatingShop(true);
        const slot = serverShopSlots.find((s) => s.slotId === preferredSlotId && s.itemId && Number(s.expiresAt) > Date.now())
          || serverShopSlots.find((s) => s.itemId === itemId && Number(s.expiresAt) > Date.now());
        if (!slot) {
          toast("This shop slot expired. Refreshing.");
          await refreshRotatingShop(true);
          render();
          return;
        }

        const data = await postJson("/api/shop/buy", {
          username: serverSession.username,
          password: serverSession.password,
          slotId: slot.slotId
        });
        await refreshRotatingShop(true);
        if (typeof data.bankBalance === "number") state.bankBalance = data.bankBalance;
        addTx("store_order", -slot.price, { item: slot.name, rarity: slot.rarity, via: "server", trackingId: data.trackingId });
        await refreshServerOrders();
        if (data.orderId) selectedTrackOrderId = data.orderId;
        saveState();
        render();
        toast(`Order placed. Tracking: ${data.trackingId || "pending"}`);
        return;
      }

      if (state.bankBalance < item.price) {
        toast("Not enough money for this item.");
        return;
      }
      state.bankBalance -= item.price;
      if (!state.inventory[item.id]) state.inventory[item.id] = { qty: 0 };
      state.inventory[item.id].qty = Math.min(item.maxStack || 99, state.inventory[item.id].qty + 1);
      addTx("store_purchase", -item.price, { item: item.name, via: "local" });

      saveState();
      render();
      toast(`Purchased ${item.name}.`);
    } finally {
      purchaseLock = false;
    }
  }

  function useInventoryItem(itemId) {
    const item = itemById(itemId);
    if (!item || !item.boost) return;

    const slot = state.inventory[itemId];
    if (!slot || slot.qty <= 0) return;

    slot.qty -= 1;
    if (slot.qty <= 0) delete state.inventory[itemId];

    const now = Date.now();
    const boostId = uniqueId(`inv_${itemId}`);
    state.activeBoosts[boostId] = {
      itemId: item.id,
      type: item.boost.type,
      value: item.boost.value,
      startedAt: now,
      endsAt: now + (item.boost.durationMs || 60 * 1000),
      remainingUses: item.boost.remainingUses || undefined
    };

    addTx("item_used", 0, { item: item.name, boost: item.boost.type });
    saveState();
    render();
    toast(`${item.name} used.`);
  }

  function animateBalance(target) {
    const start = balanceDisplay;
    const diff = target - start;
    const duration = 300;
    const t0 = performance.now();

    const step = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      balanceDisplay = start + diff * p;
      dom.balanceText.textContent = fmtMoney(balanceDisplay);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function confettiBurst() {
    for (let i = 0; i < 24; i += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti";
      piece.style.left = `${50 + randInt(-15, 15)}%`;
      piece.style.top = `${35 + randInt(-5, 5)}%`;
      piece.style.background = ["#35e2ff", "#5fff9a", "#ffd26e", "#ff7e95"][randInt(0, 3)];
      piece.style.setProperty("--dx", `${randInt(-260, 260)}px`);
      piece.style.setProperty("--dy", `${randInt(120, 300)}px`);
      dom.confettiLayer.appendChild(piece);
      setTimeout(() => piece.remove(), 900);
    }
  }

  function renderMainJob(now) {
    const activeJobs = [...state.activeJobs].sort((a, b) => a.finishAt - b.finishAt);
    const maxJobs = getMaxConcurrentJobs();
    dom.mainSlotsText.textContent = `Job slots: ${activeJobs.length} / ${maxJobs}`;

    if (!activeJobs.length) {
      dom.mainJobStatus.textContent = "No active main job";
      dom.mainJobTimer.textContent = "--:--";
      dom.mainFinishAt.textContent = "Finish: --";
      dom.claimMainJobBtn.disabled = true;
    } else {
      const next = activeJobs[0];
      const remain = next.finishAt - now;
      dom.mainJobStatus.textContent = `Active jobs: ${activeJobs.length}`;
      dom.mainJobTimer.textContent = fmtDur(remain);
      dom.mainFinishAt.textContent = `Next finish: ${fmtTs(next.finishAt)}`;
      dom.claimMainJobBtn.disabled = !activeJobs.some((j) => now >= j.finishAt);
    }

    dom.activeJobsList.innerHTML = "";
    activeJobs.forEach((job) => {
      const row = document.createElement("div");
      row.className = "item-row";
      row.innerHTML = `
        <div class="row-head"><strong>${job.name}</strong><span>${fmtDur(job.finishAt - now)}</span></div>
        <div class="row-meta">Finish: ${fmtTs(job.finishAt)}</div>
      `;
      const btn = document.createElement("button");
      btn.className = "btn secondary";
      btn.textContent = "Claim";
      btn.disabled = now < job.finishAt;
      btn.onclick = () => claimMainJob(job.runId);
      row.appendChild(btn);
      dom.activeJobsList.appendChild(row);
    });

    dom.cooldownStatus.textContent = "Cooldown removed";

    const streakBonus = Math.round(streakBonusPct() * 100);
    dom.streakText.textContent = `Streak: ${state.mainStreak} (+${streakBonus}%)`;
    if (state.streakWindowUntil && now < state.streakWindowUntil) {
      dom.streakWindowText.textContent = `Keep streak: start next job within ${fmtDur(state.streakWindowUntil - now)}`;
    } else {
      dom.streakWindowText.textContent = "No active streak window";
    }

    dom.jobBoard.innerHTML = "";
    const mods = getModifiers(now);

    MAIN_JOBS.forEach((job) => {
      const can = canTakeMainJob(now).ok && state.bankLevel >= job.unlockLevel;
      const row = document.createElement("div");
      row.className = "job-row";
      const base = Math.round(calcMainBaseReward(job) * mods.payoutMult);
      const taxed = base - Math.floor(base * 0.10);
      const low = Math.round(taxed * 0.85);
      const high = Math.round(taxed * 1.15);
      const effectiveDur = Math.round(job.durationMin * 60 * 1000 * mods.durationMult);
      row.innerHTML = `
        <div class="row-head"><strong>${job.name}</strong><span>${fmtDur(effectiveDur)}</span></div>
        <div class="row-meta">Est payout ${fmtMoney(low)} - ${fmtMoney(high)} | unlock lvl ${job.unlockLevel}</div>
      `;
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.textContent = "Accept";
      btn.disabled = !can;
      btn.onclick = () => acceptMainJob(job.id, false);
      row.appendChild(btn);
      dom.jobBoard.appendChild(row);
    });
  }

  function renderQuick(now) {
    resetQuickWindow(now);
    const left = Math.max(0, QUICK_MAX_IN_WINDOW - state.quickTasksUsedInWindow);
    dom.quickQuotaText.textContent = `Quick tasks left in this window: ${left}/${QUICK_MAX_IN_WINDOW}`;

    const active = state.quickTaskActiveId ? QUICK_TASKS.find((q) => q.id === state.quickTaskActiveId) : null;
    if (!active) {
      dom.quickTaskStatus.textContent = "No active quick task";
      dom.quickTaskTimer.textContent = "--:--";
      dom.claimQuickTaskBtn.disabled = true;
    } else {
      const remain = state.quickTaskFinishAt - now;
      dom.quickTaskStatus.textContent = `Active: ${active.name}`;
      dom.quickTaskTimer.textContent = fmtDur(remain);
      dom.claimQuickTaskBtn.disabled = remain > 0;
    }

    dom.quickTaskBoard.innerHTML = "";
    QUICK_TASKS.forEach((task) => {
      const row = document.createElement("div");
      row.className = "item-row";
      const scaled = Math.round(task.basePay * (1 + (state.bankLevel - 1) * 0.03));
      const taxed = scaled - Math.floor(scaled * 0.10);
      row.innerHTML = `<div class="row-head"><strong>${task.name}</strong><span>${task.durationSec}s</span></div><div class="row-meta">Est ${fmtMoney(taxed)}</div>`;
      const btn = document.createElement("button");
      btn.className = "btn secondary";
      btn.textContent = "Start";
      btn.disabled = Boolean(state.quickTaskActiveId) || left <= 0;
      btn.onclick = () => acceptQuickTask(task.id);
      row.appendChild(btn);
      dom.quickTaskBoard.appendChild(row);
    });
  }

  function renderOpportunity(now) {
    const opp = state.activeOpportunity;
    if (!opp) {
      dom.opportunityStatus.textContent = "No active flash contract";
      dom.opportunityTimer.textContent = "--:--";
      dom.acceptOpportunityBtn.disabled = true;
    } else {
      const remain = opp.offerExpiresAt - now;
      dom.opportunityStatus.textContent = `${opp.title} available`;
      dom.opportunityTimer.textContent = remain > 0 ? `Accept within ${fmtDur(remain)}` : "Expired";
      dom.acceptOpportunityBtn.disabled = remain <= 0;
    }
    const next = state.nextOpportunityCheckAt && now < state.nextOpportunityCheckAt ? fmtDur(state.nextOpportunityCheckAt - now) : "rolling now";
    dom.nextOpportunityText.textContent = `Next roll: ${next}`;
  }

  function renderSpend(now) {
    removeExpiredBoosts(now);
    const activeBoostCount = Object.keys(state.activeBoosts).length;
    dom.boostStatus.textContent = activeBoostCount ? `Active boosts: ${activeBoostCount}` : "No active boosts.";

    dom.boostShop.innerHTML = "";
    BOOST_SHOP.forEach((boost) => {
      const cost = boostCost(boost);
      const row = document.createElement("div");
      row.className = "item-row";
      row.innerHTML = `
        <div class="row-head"><strong>${boost.name}</strong><span>${fmtMoney(cost)}</span></div>
        <div class="row-meta">${boost.type} for ${fmtDur(boost.durationMs)}</div>
      `;
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.textContent = "Buy & Use";
      btn.disabled = state.bankBalance < cost;
      btn.onclick = () => buyBoost(boost.id);
      row.appendChild(btn);
      dom.boostShop.appendChild(row);
    });

    dom.skillPointText.textContent = `Skill Points: ${state.skillPoints}`;
    dom.trainingCostText.textContent = `Training Cost: ${fmtMoney(getTrainingCost())}`;
    dom.buyTrainingBtn.disabled = state.bankBalance < getTrainingCost();
    dom.parallelUpgradeText.textContent = `Level ${state.parallelJobUpgradeLevel} | Max jobs ${getMaxConcurrentJobs()} | Next ${fmtMoney(getParallelUpgradeCost())}`;
    dom.buyParallelUpgradeBtn.disabled = state.bankBalance < getParallelUpgradeCost();

    const skillMeta = [
      ["efficiency", "Efficiency", "+2% payout / point"],
      ["speed", "Speed", "-2% duration / point"],
      ["luck", "Luck", "Better risky odds"],
      ["charisma", "Charisma", "+1 rep every 3 points"]
    ];

    dom.skillsPanel.innerHTML = "";
    skillMeta.forEach(([id, name, desc]) => {
      const cur = state.skills[id];
      const cap = SKILL_CAPS[id] || 10;
      const capped = cur >= cap;
      const row = document.createElement("div");
      row.className = "skill-row";
      row.innerHTML = `<div><strong>${name}</strong> <span class="hint">${desc}</span><br><span class="row-meta">${cur}/${cap}${capped ? " (capped)" : ""}</span></div>`;
      const btn = document.createElement("button");
      btn.className = "btn secondary";
      btn.textContent = "+1";
      btn.disabled = state.skillPoints <= 0 || capped;
      btn.onclick = () => spendSkillPoint(id);
      row.appendChild(btn);
      dom.skillsPanel.appendChild(row);
    });

    dom.businessMoneyBar.textContent = `Money ${fmtMoney(state.bankBalance)} | Total Earned ${fmtMoney(state.totalEarned || 0)}`;
    dom.businessPanel.innerHTML = "";
    BUSINESSES.forEach((biz) => {
      const unlocked = isBusinessUnlocked(biz);
      const ent = businessEntry(biz.id, false) || { level: 0, lastPaidAt: now, hasManager: false };
      const cost = businessUpgradeCost(biz, ent.level);
      const intervalMs = businessIntervalMs(biz);
      const payout = businessPayoutPerInterval(biz, { ...ent, level: Math.max(1, ent.level || 1) }, getModifiers(now));
      const needsRestart = false;
      const timeLeft = ent.level > 0
        ? (needsRestart ? 0 : Math.max(0, (Number(ent.lastPaidAt || now) + intervalMs) - now))
        : intervalMs;
      const progressRatio = ent.level > 0
        ? (needsRestart ? 1 : Math.max(0, Math.min(1, (now - Number(ent.lastPaidAt || now)) / intervalMs)))
        : 0;

      const row = document.createElement("div");
      row.className = `item-row business-tile${unlocked ? "" : " locked"}`;
      row.innerHTML = `
        <div class="row-head">
          <strong>${biz.icon || "🏪"} ${biz.name}</strong>
          <span>${ent.level || 0}/5</span>
        </div>
        <div class="business-badges">
          <span class="chip">Cost ${fmtMoney(cost)}</span>
          <span class="chip">Payout ${fmtMoney(Math.max(0, payout))}</span>
          <span class="chip">Timer ${fmtDur(timeLeft)}</span>
          ${unlocked ? "" : `<span class="chip">Locked</span>`}
        </div>
        <div class="business-progress"><span style="width:${Math.round(progressRatio * 100)}%"></span></div>
        <div class="row-meta">
          ${unlocked
            ? `Unlock target met. Interval ${fmtDur(intervalMs)}${ent.hasManager ? " | Manager active (+5% payout)" : ""} | Auto restart on`
            : `Unlock at Total Earned ${fmtMoney(biz.unlockValue || 0)}`}
        </div>
      `;

      const btn = document.createElement("button");
      btn.className = "btn secondary";
      btn.textContent = unlocked
        ? (ent.level === 0 ? "Buy" : (ent.level >= 5 ? "Running" : "Upgrade"))
        : "Coming Soon";
      btn.disabled = !unlocked || ent.level >= 5 || state.bankBalance < cost;
      btn.onclick = () => buyOrUpgradeBusiness(biz.id);
      row.appendChild(btn);
      dom.businessPanel.appendChild(row);
    });

    dom.businessUpgradesPanel.innerHTML = "";
    BUSINESS_UPGRADES.forEach((upgrade) => {
      const owned = Boolean(state.upgrades[upgrade.id]);
      const row = document.createElement("div");
      row.className = "item-row";
      row.innerHTML = `
        <div class="row-head"><strong>${upgrade.name}</strong><span>${owned ? "Owned" : fmtMoney(upgrade.cost)}</span></div>
        <div class="row-meta">${upgrade.desc}</div>
      `;
      const btn = document.createElement("button");
      btn.className = "btn secondary";
      btn.textContent = owned ? "Purchased" : "Buy Upgrade";
      btn.disabled = owned || state.bankBalance < upgrade.cost;
      btn.onclick = () => buyBusinessUpgrade(upgrade.id);
      row.appendChild(btn);
      dom.businessUpgradesPanel.appendChild(row);
    });

    dom.businessManagersPanel.innerHTML = "";
    BUSINESSES.forEach((biz) => {
      const ent = businessEntry(biz.id, false) || { level: 0, hasManager: false };
      const unlocked = isBusinessUnlocked(biz);
      const row = document.createElement("div");
      row.className = "item-row";
      const cost = managerCostForBusiness(biz);
      row.innerHTML = `
        <div class="row-head"><strong>${biz.icon || "🏪"} ${biz.name}</strong><span>${ent.hasManager ? "Hired" : fmtMoney(cost)}</span></div>
        <div class="row-meta">${!unlocked ? "Locked business" : ent.level <= 0 ? "Own this business first." : "Manager auto-runs this business (+5% payout)."}</div>
      `;
      const btn = document.createElement("button");
      btn.className = "btn secondary";
      btn.textContent = ent.hasManager ? "Manager Active" : "Hire Manager";
      btn.disabled = !unlocked || ent.level <= 0 || ent.hasManager || state.bankBalance < cost;
      btn.onclick = () => hireBusinessManager(biz.id);
      row.appendChild(btn);
      dom.businessManagersPanel.appendChild(row);
    });

    dom.businessStatsPanel.innerHTML = `
      <div class="item-row">
        <div class="row-head"><strong>Business Stats</strong><span>Overview</span></div>
        <div class="row-meta">Total Earned: ${fmtMoney(state.totalEarned || 0)}</div>
        <div class="row-meta">Owned Businesses: ${BUSINESSES.filter((b) => (businessEntry(b.id, false)?.level || 0) > 0).length}/${BUSINESSES.length}</div>
        <div class="row-meta">Managers Hired: ${BUSINESSES.filter((b) => businessEntry(b.id, false)?.hasManager).length}</div>
      </div>
    `;

    dom.coinFlipStats.textContent = `Wins: ${state.casinoStats.wins} | Losses: ${state.casinoStats.losses}`;
  }

  function renderStore() {
    dom.storeList.innerHTML = "";
    if (hasServerSession() && !serverShopSlots.length) {
      dom.storeList.innerHTML = "<p class='hint'>Loading rotating rarity shop...</p>";
      return;
    }
    const now = Date.now();
    dom.shopLastUpdated.textContent = `Last updated: ${fmtTs(serverShopLastUpdatedAt || now)}`;
    const rotating = hasServerSession() && serverShopSlots.length ? serverShopSlots : ITEM_CATALOG.map((item) => ({
      slotId: item.id,
      itemId: item.id,
      name: item.name,
      rarity: item.rarity || "common",
      price: item.price,
      expiresAt: now + 24 * 60 * 60 * 1000,
      purchased: false
    }));

    rotating.forEach((slot) => {
      const item = slot.itemId ? itemById(slot.itemId) : null;
      const icon = item?.icon || (slot.slotType === "special" ? "✨" : "📦");
      const expiresIn = Math.max(0, Number(slot.expiresAt) - now);
      const emptySpecial = slot.slotType === "special" && !slot.itemId;
      const rarity = String(slot.rarity || "");
      const row = document.createElement("div");
      row.className = "item-row";
      row.innerHTML = `
        <div class="row-head"><strong>${icon} ${emptySpecial ? "No special item right now" : slot.name}</strong><span>${emptySpecial ? "--" : fmtMoney(slot.price)}</span></div>
        <div class="row-meta">
          ${slot.slotType === "special" ? "Special Slot" : "Normal Slot"}
          ${emptySpecial ? "" : ` | <span class="rarity-pill ${rarity}">${statusBadge(slot.rarity)}</span> | Expires in ${fmtDur(expiresIn)}`}
        </div>
      `;
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.textContent = "Buy";
      btn.disabled = purchaseLock || emptySpecial || expiresIn <= 0 || state.bankBalance < Number(slot.price || 0);
      btn.onclick = () => placeSingleItemOrder(slot.itemId, slot.slotId);
      row.appendChild(btn);
      dom.storeList.appendChild(row);
    });
  }

  function renderInventory(now) {
    removeExpiredBoosts(now);

    dom.inventoryList.innerHTML = "";
    const inventoryEntries = Object.entries(state.inventory)
      .filter(([, v]) => (v.qty || 0) > 0)
      .sort((a, b) => a[0].localeCompare(b[0]));

    if (!inventoryEntries.length) {
      dom.inventoryList.innerHTML = "<p class='hint'>No items in inventory yet. Delivered orders will auto-add items.</p>";
    } else {
      for (const [itemId, slot] of inventoryEntries) {
        const item = itemById(itemId);
        if (!item) continue;
        const row = document.createElement("div");
        row.className = "item-row";
        row.innerHTML = `
          <div class="row-head"><strong>${item.icon} ${item.name}</strong><span>Qty ${slot.qty}</span></div>
          <div class="row-meta">${item.description}</div>
        `;
        const btn = document.createElement("button");
        btn.className = "btn secondary";
        btn.textContent = "Use";
        btn.disabled = slot.qty <= 0;
        btn.onclick = () => useInventoryItem(itemId);
        row.appendChild(btn);
        dom.inventoryList.appendChild(row);
      }
    }

    dom.activeBoostList.innerHTML = "";
    const boosts = Object.entries(state.activeBoosts);
    if (!boosts.length) {
      dom.activeBoostList.innerHTML = "<p class='hint'>No active boosts.</p>";
    } else {
      boosts.forEach(([boostId, boost]) => {
        const row = document.createElement("div");
        row.className = "item-row";
        const remain = Math.max(0, (boost.endsAt || now) - now);
        const uses = boost.remainingUses !== undefined ? ` | uses left ${boost.remainingUses}` : "";
        row.innerHTML = `
          <div class="row-head"><strong>${boost.itemId}</strong><span>${fmtDur(remain)}</span></div>
          <div class="row-meta">${boost.type} +${Math.round(boost.value * 100)}%${uses}</div>
        `;
        dom.activeBoostList.appendChild(row);
      });
    }

    const mods = getModifiers(now);
    dom.effectiveModsText.textContent = `Effective: payout x${mods.payoutMult.toFixed(2)}, duration x${mods.durationMult.toFixed(2)}, luck +${Math.round(mods.riskyLuckBonus * 100)}%`;
  }

  function renderOrders(now) {
    updateOrderStatuses(now);
    const orders = hasServerSession() && serverOrders.length
      ? [...serverOrders].sort((a, b) => b.createdAt - a.createdAt)
      : Object.values(state.orders).sort((a, b) => b.createdAt - a.createdAt);
    dom.ordersList.innerHTML = "";

    if (!orders.length) {
      dom.ordersList.innerHTML = "<p class='hint'>No orders yet. Buy items in Store.</p>";
      dom.trackPanel.innerHTML = "<p class='hint'>Select an order to track.</p>";
      return;
    }

    if (!selectedTrackOrderId) selectedTrackOrderId = orders[0].orderId || orders[0].id;

    orders.forEach((order) => {
      const status = deriveOrderStatus(order, now);
      const statusClass = String(status).replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
      const row = document.createElement("div");
      row.className = "item-row";
      const orderId = order.orderId || order.id;
      const shortId = String(orderId).slice(-8).toUpperCase();
      const itemsSummary = order.items.map((it) => `${it.name} x${it.qty}`).join(", ");

      row.innerHTML = `
        <div class="row-head">
          <strong>Order #${shortId}</strong>
          <span class="badge ${statusClass}">${statusBadge(status)}</span>
        </div>
        <div class="row-meta">${order.carrier || "MegaShip"} • ${order.trackingId || order.trackingNumber}</div>
        <div class="row-meta">Created: ${fmtTs(order.createdAt)} | ETA: ${fmtTs(order.etaAt || order.estimatedDeliveryAt)}</div>
        <div class="row-meta">${itemsSummary}</div>
      `;

      const actions = document.createElement("div");
      actions.className = "top-actions";

      const trackBtn = document.createElement("button");
      trackBtn.className = "btn secondary";
      trackBtn.textContent = "Track";
      trackBtn.onclick = () => {
        selectedTrackOrderId = orderId;
        render();
      };
      actions.appendChild(trackBtn);

      row.appendChild(actions);
      dom.ordersList.appendChild(row);
    });

    const selected = orders.find((o) => (o.orderId || o.id) === selectedTrackOrderId) || orders[0];
    if (!selected) {
      dom.trackPanel.innerHTML = "<p class='hint'>Select an order to track.</p>";
      return;
    }
    selectedTrackOrderId = selected.orderId || selected.id;

    const status = deriveOrderStatus(selected, now);
    const stepIndex = status === "Processing" ? 1 : status === "Shipped" ? 2 : status === "OutForDelivery" ? 3 : 4;
    const progress = Math.round((stepIndex / 4) * 100);
    const countdown = status === "Delivered" ? "Delivered" : fmtDur((selected.etaAt || selected.deliveredAt) - now);

    dom.trackPanel.innerHTML = `
      <p><strong>${selected.carrier || "MegaShip"} ${selected.trackingId || selected.trackingNumber}</strong></p>
      <p class="row-meta">Order total: ${fmtMoney(selected.total)} | Created: ${fmtTs(selected.createdAt)}</p>
      <p class="row-meta">ETA: ${fmtTs(selected.etaAt || selected.estimatedDeliveryAt)}</p>
      <div class="progress-wrap"><div class="progress-bar" style="width:${progress}%"></div></div>
      <p class="row-meta">Status: ${statusBadge(status)} | Countdown: ${countdown}</p>
      <ol class="timeline">
        ${(selected.timeline || []).map((t) => `<li>${statusBadge(t.status)}: ${fmtTs(t.at)}</li>`).join("") || `
        <li>Order placed: ${fmtTs(selected.createdAt)}</li>
        <li>Shipped: ${fmtTs(selected.shippedAt)}</li>
        <li>Out for delivery: ${fmtTs(selected.outForDeliveryAt)}</li>
        <li>Delivered: ${fmtTs(selected.deliveredAt)}</li>`}
      </ol>
    `;
  }

  function renderLog() {
    dom.txLog.innerHTML = "";
    state.txLog.slice(0, 10).forEach((tx) => {
      const li = document.createElement("li");
      const sign = tx.amount >= 0 ? "+" : "-";
      li.textContent = `${new Date(tx.ts).toLocaleTimeString()} | ${tx.type} | ${sign}${fmtMoney(Math.abs(tx.amount))}`;
      dom.txLog.appendChild(li);
    });
  }

  function render() {
    const now = Date.now();

    animateBalance(state.bankBalance);

    dom.levelText.textContent = `Lvl ${state.bankLevel}`;
    const threshold = state.bankLevel * XP_PER_LEVEL_BASE;
    dom.xpText.textContent = `XP ${state.bankXP} / ${threshold}`;
    dom.repText.textContent = `Rep ${state.reputation}`;
    dom.xpBar.style.width = `${Math.min(100, Math.round((state.bankXP / threshold) * 100))}%`;

    const dailyReady = !state.lastDailyBonusAt || now - state.lastDailyBonusAt >= 24 * 60 * 60 * 1000;
    dom.dailyBtn.disabled = !dailyReady;
    dom.dailyStatus.textContent = dailyReady ? "Daily ready" : `Ready in ${fmtDur((24 * 60 * 60 * 1000) - (now - state.lastDailyBonusAt))}`;

    const interestReady = !state.lastInterestAt || now - state.lastInterestAt >= 60 * 60 * 1000;
    dom.interestBtn.disabled = !interestReady;
    dom.interestStatus.textContent = interestReady ? "Interest ready" : `Ready in ${fmtDur((60 * 60 * 1000) - (now - state.lastInterestAt))}`;

    renderMainJob(now);
    renderQuick(now);
    renderOpportunity(now);
    renderSpend(now);
    renderStore();
    renderInventory(now);
    renderOrders(now);
    renderLog();
  }

  function tick1s() {
    const now = Date.now();
    let shouldSave = false;
    if (state.streakWindowUntil && now > state.streakWindowUntil) {
      state.mainStreak = 0;
      state.streakWindowUntil = null;
      shouldSave = true;
    }
    if (processPassiveIncome()) {
      shouldSave = true;
    }
    if (shouldSave) {
      saveState();
    }
    render();
  }

  function tick30s() {
    opportunityCheck();
    if (hasServerSession()) refreshServerOrders();
    saveState();
    render();
  }

  function tick12s() {
    if (hasServerSession()) {
      refreshRotatingShop(true).then(() => render());
    }
  }

  function setActiveTab(name) {
    const tabs = {
      bank: [dom.tabBankBtn, dom.bankTab],
      spend: [dom.tabSpendBtn, dom.spendTab],
      store: [dom.tabStoreBtn, dom.storeTab],
      inventory: [dom.tabInventoryBtn, dom.inventoryTab],
      orders: [dom.tabOrdersBtn, dom.ordersTab]
    };

    for (const [key, [btn, panel]] of Object.entries(tabs)) {
      btn.classList.toggle("active", key === name);
      panel.classList.toggle("hidden", key !== name);
    }
  }

  function setBusinessTab(name) {
    activeBusinessTab = name;
    const tabs = {
      businesses: [dom.bizTabBusinessesBtn, dom.bizPanelBusinesses],
      upgrades: [dom.bizTabUpgradesBtn, dom.bizPanelUpgrades],
      managers: [dom.bizTabManagersBtn, dom.bizPanelManagers],
      stats: [dom.bizTabStatsBtn, dom.bizPanelStats]
    };
    for (const [key, [btn, panel]] of Object.entries(tabs)) {
      if (btn) btn.classList.toggle("active", key === name);
      if (panel) panel.classList.toggle("hidden", key !== name);
    }
  }

  function resetSave() {
    if (!confirm("Reset all progress?")) return;
    localStorage.removeItem(STORAGE_KEY);
    if (localAuthMode) localStorage.removeItem(LOCAL_USER_KEY);
    location.reload();
  }

  function wire() {
    dom.tabBankBtn.onclick = () => setActiveTab("bank");
    dom.tabSpendBtn.onclick = () => setActiveTab("spend");
    dom.tabStoreBtn.onclick = () => setActiveTab("store");
    dom.tabInventoryBtn.onclick = () => setActiveTab("inventory");
    dom.tabOrdersBtn.onclick = () => setActiveTab("orders");
    dom.bizTabBusinessesBtn.onclick = () => setBusinessTab("businesses");
    dom.bizTabUpgradesBtn.onclick = () => setBusinessTab("upgrades");
    dom.bizTabManagersBtn.onclick = () => setBusinessTab("managers");
    dom.bizTabStatsBtn.onclick = () => setBusinessTab("stats");

    dom.claimMainJobBtn.onclick = claimMainJob;
    dom.claimQuickTaskBtn.onclick = claimQuickTask;
    dom.acceptOpportunityBtn.onclick = acceptOpportunity;

    dom.dailyBtn.onclick = claimDailyBonus;
    dom.interestBtn.onclick = applyInterest;

    dom.buyTrainingBtn.onclick = buyTrainingPoint;
    dom.buyParallelUpgradeBtn.onclick = buyParallelUpgrade;
    dom.restartBusinessesBtn.onclick = restartAllBusinesses;
    dom.coinFlipBtn.onclick = coinFlip;
    dom.trackingSearchBtn.onclick = trackOrderByTrackingId;

    dom.saveNowBtn.onclick = () => {
      saveState();
      flushCloudSave();
      toast("Save requested.");
    };

    dom.resetSaveBtn.onclick = resetSave;
  }

  function startGame() {
    const now = Date.now();

    if (!state.quickTaskWindowResetAt) state.quickTaskWindowResetAt = now + QUICK_WINDOW_MS;
    if (!state.nextOpportunityCheckAt) state.nextOpportunityCheckAt = now + randInt(5 * 60 * 1000, 10 * 60 * 1000);

    opportunityCheck();
    processPassiveIncome();
    if (hasServerSession()) {
      refreshRotatingShop(true);
      refreshServerOrders();
    }

    wire();
    setActiveTab("bank");
    setBusinessTab(activeBusinessTab);
    render();

    tick1sHandle = setInterval(tick1s, 1000);
    tick12sHandle = setInterval(tick12s, 12000);
    tick30sHandle = setInterval(tick30s, 30000);
    gameStarted = true;
  }

  async function init() {
    showAuthScreen();
    bindAuthEvents();
    setSaveStatus("saved", "local");
    const rememberedUsername = localStorage.getItem("server_shop_username") || "";
    const rememberedPassword = sessionStorage.getItem("server_shop_password") || "";
    if (rememberedUsername && rememberedPassword) {
      setServerSession(rememberedUsername, rememberedPassword);
    }

    await initFirebaseServices();

    if (localAuthMode) {
      const savedUser = localStorage.getItem(LOCAL_USER_KEY);
      if (savedUser) {
        await handleAuthState({ uid: `local_${savedUser}`, email: `${savedUser}@local.test` });
      }
      return;
    }

    if (!firebaseReady) return;

    firebaseApi.onAuthStateChanged(auth, handleAuthState);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flushCloudSave();
    });
    window.addEventListener("beforeunload", () => {
      flushCloudSave();
    });
  }

  init();
})();
