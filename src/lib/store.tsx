import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  DEMO_EMAIL,
  demoCards,
  demoMembership,
  demoNotices,
  demoPurchases,
  demoUser,
  instructorById,
  plans,
  prepareDemo,
  renewalLabel,
  type Booking,
  type Membership,
  type Notice,
  type PayCard,
  type Purchase,
  type Session,
  type User,
} from "./data";

const localStorage = {
  getItem(key: string) {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  },
  setItem(key: string, value: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
  },
  removeItem(key: string) {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  },
};

export type TabId = "home" | "schedule" | "bookings" | "memberships" | "profile";

export type Route =
  | { name: "splash" }
  | { name: "onboarding" }
  | { name: "welcome" }
  | { name: "login" }
  | { name: "register" }
  | { name: "verify" }
  | { name: "forgot" }
  | { name: "forgotSent"; email: string }
  | { name: "reset"; email: string }
  | { name: "tabs" }
  | { name: "class"; sessionId: string }
  | { name: "instructor"; instructorId: string }
  | { name: "booked"; bookingId: string }
  | { name: "plan"; planId: string }
  | { name: "checkout"; planId: string }
  | { name: "payResult"; ok: boolean; purchaseId?: string }
  | { name: "payments" }
  | { name: "addCard" }
  | { name: "purchases" }
  | { name: "receipt"; purchaseId: string }
  | { name: "notifications" }
  | { name: "studio" }
  | { name: "settings" }
  | { name: "editProfile" }
  | { name: "password" }
  | { name: "preferences" }
  | { name: "membership" }
  | { name: "help" }
  | { name: "legal"; doc: "terms" | "privacy" }
  | { name: "linked" }
  | { name: "design" };

export type Filters = {
  category: string;
  level: string;
  instructorId: string;
  time: string;
  duration: string;
  availableOnly: boolean;
  query: string;
};

export type Overlay =
  | { type: "filters" }
  | { type: "book"; sessionId: string; step: 1 | 2; pay: "credit" | "pass" | "card" }
  | { type: "waitlist"; sessionId: string }
  | { type: "auth" }
  | { type: "cancel"; bookingId: string }
  | { type: "logout" }
  | { type: "photo" }
  | { type: "share"; label: string }
  | { type: "freeze" }
  | { type: "cancelPlan" }
  | { type: "legal"; doc: "terms" | "privacy" };

export type AlertState = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
};

export type MenuState = { sessionId: string; x: number; y: number };

const emptyFilters = (): Filters => ({
  category: "All",
  level: "Any",
  instructorId: "any",
  time: "Any",
  duration: "Any",
  availableOnly: false,
  query: "",
});

function readUser(): User | null {
  try {
    const raw = localStorage.getItem("aluvita-user");
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function readAccounts(): User[] {
  try {
    const raw = localStorage.getItem("aluvita-accounts");
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

function saveUser(user: User | null) {
  if (user) localStorage.setItem("aluvita-user", JSON.stringify(user));
  else localStorage.removeItem("aluvita-user");
}

export function routeKey(route: Route) {
  switch (route.name) {
    case "class":
      return route.sessionId;
    case "instructor":
      return route.instructorId;
    case "booked":
      return route.bookingId;
    case "plan":
    case "checkout":
      return `${route.name}-${route.planId}`;
    case "payResult":
      return `pay-${route.ok}-${route.purchaseId ?? ""}`;
    case "receipt":
      return route.purchaseId;
    case "forgotSent":
    case "reset":
      return `${route.name}-${route.email}`;
    case "legal":
      return route.doc;
    default:
      return route.name;
  }
}

const Ctx = createContext<AppValue | null>(null);

type AppValue = ReturnType<typeof useStudioState>;

function useStudioState() {
  const bootUser = useState(readUser)[0];
  const demo = useState(prepareDemo)[0];
  const [stack, setStack] = useState<Route[]>([{ name: "splash" }]);
  const [dir, setDir] = useState<"push" | "pop" | "fade">("fade");
  const [tab, setTabState] = useState<TabId>("home");
  const [user, setUser] = useState<User | null>(bootUser);
  const [guest, setGuest] = useState(false);
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem("aluvita-onboarded") === "1");
  const [sessions, setSessions] = useState<Session[]>(demo.sessions);
  const [bookings, setBookings] = useState<Booking[]>(bootUser?.email === DEMO_EMAIL ? demo.bookings : []);
  const [membership, setMembership] = useState<Membership | null>(bootUser?.email === DEMO_EMAIL ? demoMembership() : null);
  const [cards, setCards] = useState<PayCard[]>(bootUser?.email === DEMO_EMAIL ? demoCards() : []);
  const [purchases, setPurchases] = useState<Purchase[]>(bootUser?.email === DEMO_EMAIL ? demoPurchases() : []);
  const [notices, setNotices] = useState<Notice[]>(bootUser?.email === DEMO_EMAIL ? demoNotices() : []);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [schedulePhase, setSchedulePhase] = useState<"ready" | "loading" | "error">("ready");
  const [appearance, setAppearance] = useState<"light" | "dark" | "system">("light");
  const [typeScale, setTypeScale] = useState(1);
  const [chromeLight, setChromeLight] = useState(false);
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [toasts, setToasts] = useState<{ id: number; title: string; body?: string }[]>([]);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [scheduleView, setScheduleView] = useState<"day" | "week">("day");
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [bookingTab, setBookingTab] = useState<"upcoming" | "past" | "waitlist">("upcoming");
  const [notifTab, setNotifTab] = useState<"all" | "bookings" | "promos">("all");
  const [planTab, setPlanTab] = useState<"membership" | "packs" | "drop">("membership");
  const [saved, setSaved] = useState<string[]>(["morning-vinyasa"]);
  const [prefs, setPrefs] = useState({
    booking: true,
    reminder: true,
    cancellation: true,
    waitlist: true,
    announcements: true,
    promotions: false,
    reminderTiming: "1h" as "1h" | "3h" | "1d",
    push: true,
    email: true,
    sms: false,
    faceId: false,
    dataSharing: false,
    marketing: false,
    calendarSync: true,
    apple: true,
    google: false,
  });
  useEffect(() => {
    const storedAppearance = localStorage.getItem("aluvita-appearance");
    if (storedAppearance === "light" || storedAppearance === "dark" || storedAppearance === "system") {
      setAppearance(storedAppearance);
    }
    const storedType = Number(localStorage.getItem("aluvita-type"));
    if (storedType) setTypeScale(storedType);
    const t = window.setTimeout(() => {
      setStack((current) => {
        if (current.length !== 1 || current[0]?.name !== "splash") return current;
        const saved = readUser();
        if (saved) return [{ name: "tabs" }];
        if (localStorage.getItem("aluvita-onboarded") === "1") return [{ name: "welcome" }];
        return [{ name: "onboarding" }];
      });
      setDir("fade");
    }, 2500);
    return () => window.clearTimeout(t);
  }, []);

  const toast = (title: string, body?: string) => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list.slice(-1), { id, title, body }]);
    window.setTimeout(() => setToasts((list) => list.filter((item) => item.id !== id)), 2800);
  };

  const push = (route: Route) => {
    setDir("push");
    setMenu(null);
    setStack((s) => [...s, route]);
  };
  const pop = () => {
    setDir("pop");
    setMenu(null);
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  };
  const reset = (route: Route) => {
    setDir("fade");
    setOverlay(null);
    setStack([route]);
  };
  const openTab = (next: TabId) => {
    setDir("fade");
    setTabState(next);
    setStack([{ name: "tabs" }]);
    setMenu(null);
  };

  const markOnboarded = () => {
    setOnboarded(true);
    localStorage.setItem("aluvita-onboarded", "1");
  };

  const reseed = () => {
    const next = prepareDemo();
    setSessions(next.sessions);
    setBookings(next.bookings);
    setMembership(demoMembership());
    setCards(demoCards());
    setPurchases(demoPurchases());
    setNotices(demoNotices());
  };

  const enter = (next: User, mode: "demo" | "fresh") => {
    setUser(next);
    setGuest(false);
    saveUser(next);
    markOnboarded();
    if (mode === "demo") reseed();
    if (mode === "fresh") {
      setBookings([]);
      setMembership(null);
      setCards([]);
      setPurchases([]);
      setNotices([]);
    }
    setOverlay(null);
    reset({ name: "tabs" });
  };

  const resetPassword = (email: string, password: string) => {
    const savedUser = readUser();
    if (savedUser && savedUser.email.toLowerCase() === email.toLowerCase()) {
      saveUser({ ...savedUser, password });
    }
    const accounts = readAccounts().map((account) =>
      account.email.toLowerCase() === email.toLowerCase() ? { ...account, password } : account,
    );
    localStorage.setItem("aluvita-accounts", JSON.stringify(accounts));
    if (email.toLowerCase() === DEMO_EMAIL) saveUser({ ...(savedUser ?? demoUser()), password });
  };

  const login = (email: string, password: string) => {
    const pool = [demoUser(), ...readAccounts()];
    const saved = readUser();
    if (saved) pool.unshift(saved);
    const found = pool.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found || found.password !== password) return { ok: false as const };
    enter(found.email === DEMO_EMAIL ? { ...demoUser(), ...found, password: found.password } : found, found.email === DEMO_EMAIL ? "demo" : "fresh");
    return { ok: true as const };
  };

  const loginDemo = () => enter(readUser()?.email === DEMO_EMAIL ? { ...demoUser(), ...readUser()! } : demoUser(), "demo");

  const register = (next: User) => {
    const accounts = readAccounts().filter((a) => a.email !== next.email);
    localStorage.setItem("aluvita-accounts", JSON.stringify([...accounts, next]));
    setPendingUser(next);
    push({ name: "verify" });
  };

  const verify = () => {
    if (!pendingUser) return;
    enter(pendingUser, "fresh");
    setPendingUser(null);
  };

  const logout = () => {
    setUser(null);
    setGuest(false);
    saveUser(null);
    setOverlay(null);
    reset({ name: "welcome" });
  };

  const updateUser = (patch: Partial<User>) => {
    setUser((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      saveUser(next);
      const accounts = readAccounts().map((a) => (a.email === next.email ? next : a));
      localStorage.setItem("aluvita-accounts", JSON.stringify(accounts));
      return next;
    });
  };

  const guard = (fn: () => void) => {
    if (user) fn();
    else setOverlay({ type: "auth" });
  };

  const book = (sessionId: string, pay: "credit" | "pass" | "card") => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session || session.spots <= 0) return null;
    if (pay === "credit" && (!membership || membership.credits <= 0)) return null;
    if (pay === "pass" && (!membership || membership.passCredits <= 0)) return null;
    if (pay === "credit" && membership) setMembership({ ...membership, credits: membership.credits - 1 });
    if (pay === "pass" && membership) setMembership({ ...membership, passCredits: membership.passCredits - 1 });
    setSessions((list) => list.map((s) => (s.id === sessionId ? { ...s, spots: s.spots - 1 } : s)));
    const instName = session.instructorId;
    const booking: Booking = {
      id: `b-${Date.now()}`,
      code: `ALV-${Math.floor(10000 + Math.random() * 89999)}`,
      sessionId,
      slug: session.slug,
      title: session.name,
      instructorId: instName,
      instructorName: instructorById(instName).name,
      image: session.image,
      date: session.date,
      time: session.time,
      duration: session.duration,
      room: session.room,
      category: session.category,
      level: session.level,
      status: "Confirmed",
      reminder: prefs.reminderTiming,
      payment: pay,
      price: session.price,
    };
    setBookings((list) => [booking, ...list]);
    if (pay === "card") {
      const card = cards.find((c) => c.isDefault) ?? cards[0];
      setPurchases((list) => [
        {
          id: `p-${Date.now()}`,
          item: session.name,
          dateLabel: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          iso: new Date().toISOString().slice(0, 10),
          amount: session.price,
          status: "Paid",
          method: card ? `${card.brand} ••${card.last4}` : "Apple Pay",
          month: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        },
        ...list,
      ]);
    }
    setNotices((list) => [
      {
        id: `n-${Date.now()}`,
        kind: "booking",
        title: "Booking confirmed",
        body: `${session.name} is on your schedule.`,
        time: "Just now",
        group: "Today",
        read: false,
      },
      ...list,
    ]);
    setOverlay(null);
    push({ name: "booked", bookingId: booking.id });
    return booking.id;
  };

  const cancelBooking = (id: string) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;
    setBookings((list) => list.map((b) => (b.id === id ? { ...b, status: "Cancelled", spotOpened: false } : b)));
    if (booking.sessionId && booking.status === "Confirmed") {
      setSessions((list) => list.map((s) => (s.id === booking.sessionId ? { ...s, spots: s.spots + 1 } : s)));
    }
    if (booking.status === "Confirmed" && booking.payment === "credit" && membership) {
      setMembership({ ...membership, credits: Math.min((membership.creditsTotal ?? 99), membership.credits + 1) });
    }
    if (booking.status === "Confirmed" && booking.payment === "pass" && membership) {
      setMembership({ ...membership, passCredits: membership.passCredits + 1 });
    }
    setOverlay(null);
    setAlert(null);
    toast(
      "Booking cancelled",
      booking.payment === "card" ? "The drop-in fee will be refunded." : "Your credit has been returned.",
    );
  };

  const joinWaitlist = (sessionId: string, autoBook: boolean) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;
    const booking: Booking = {
      id: `w-${Date.now()}`,
      code: `ALV-${Math.floor(10000 + Math.random() * 89999)}`,
      sessionId,
      slug: session.slug,
      title: session.name,
      instructorId: session.instructorId,
      instructorName: instructorById(session.instructorId).name,
      image: session.image,
      date: session.date,
      time: session.time,
      duration: session.duration,
      room: session.room,
      category: session.category,
      level: session.level,
      status: "Waitlisted",
      waitlistPos: 3,
      autoBook,
      reminder: null,
      payment: "credit",
      price: session.price,
    };
    setBookings((list) => [booking, ...list]);
    setOverlay(null);
    setBookingTab("waitlist");
    openTab("bookings");
    toast("You're on the list", "You're #3 for this class.");
  };

  const leaveWaitlist = (id: string) => {
    setBookings((list) => list.filter((b) => b.id !== id));
    setAlert(null);
    toast("Left the waitlist");
  };

  const setAutoBook = (id: string, value: boolean) => {
    setBookings((list) => list.map((b) => (b.id === id ? { ...b, autoBook: value } : b)));
  };

  const setReminder = (id: string, reminder: Booking["reminder"]) => {
    setBookings((list) => list.map((b) => (b.id === id ? { ...b, reminder } : b)));
  };

  const rate = (id: string, rating: number) => {
    setBookings((list) => list.map((b) => (b.id === id ? { ...b, rating } : b)));
    toast("Thanks for rating");
  };

  const claimSpot = (id: string) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking?.sessionId) return;
    setBookings((list) => list.map((b) => (b.id === id ? { ...b, status: "Confirmed", spotOpened: false, waitlistPos: undefined } : b)));
    setSessions((list) => list.map((s) => (s.id === booking.sessionId ? { ...s, spots: Math.max(0, s.spots - 1) } : s)));
    if (membership && membership.credits > 0) setMembership({ ...membership, credits: membership.credits - 1 });
    toast("You're booked");
    push({ name: "booked", bookingId: id });
  };

  const refreshSchedule = () => {
    setSchedulePhase("loading");
    window.setTimeout(() => {
      setSchedulePhase(typeof navigator !== "undefined" && navigator.onLine === false ? "error" : "ready");
    }, 800);
  };

  const pay = (planId: string, method: string, promo: string) => {
    const plan = plans.find((item) => item.id === planId);
    if (!plan) return;
    const code = promo.trim().toUpperCase();
    const card = cards.find((c) => method === `${c.brand} ••${c.last4}`);
    if (code === "FAIL" || card?.declines) {
      const failed: Purchase = {
        id: `p-${Date.now()}`,
        item: plan.name,
        dateLabel: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        iso: new Date().toISOString().slice(0, 10),
        amount: plan.price,
        status: "Failed",
        method,
        month: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      };
      setPurchases((list) => [failed, ...list]);
      push({ name: "payResult", ok: false, purchaseId: failed.id });
      return;
    }
    let amount = plan.price;
    if (code === "WELCOME10") amount = Math.round(amount * 0.9);
    if (code === "FRIEND20") amount = Math.round(amount * 0.8);
    const purchase: Purchase = {
      id: `p-${Date.now()}`,
      item: plan.name,
      dateLabel: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      iso: new Date().toISOString().slice(0, 10),
      amount,
      status: "Paid",
      method,
      month: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };
    setPurchases((list) => [purchase, ...list]);
    if (plan.group === "membership") {
      const total = plan.id === "unlimited" ? null : plan.id === "four" ? 4 : 8;
      setMembership({
        planId: plan.id,
        name: plan.name,
        status: "Active",
        credits: total ?? 30,
        creditsTotal: total,
        renews: renewalLabel(),
        started: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        passCredits: membership?.passCredits ?? 0,
        passName: membership?.passName ?? "5-Class Pass",
      });
    }
    if (plan.group === "pack") {
      const add = plan.id === "pack5" ? 5 : plan.id === "pack10" ? 10 : 20;
      setMembership((current) =>
        current
          ? { ...current, passCredits: current.passCredits + add, passName: plan.name }
          : {
              planId: plan.id,
              name: plan.name,
              status: "Active",
              credits: 0,
              creditsTotal: 0,
              renews: "Pass",
              started: purchase.dateLabel,
              passCredits: add,
              passName: plan.name,
            },
      );
    }
    push({ name: "payResult", ok: true, purchaseId: purchase.id });
  };

  const addCard = (card: PayCard) => {
    setCards((list) => {
      const next = card.isDefault ? list.map((c) => ({ ...c, isDefault: false })) : list;
      return [card, ...next];
    });
    toast("Card saved");
    pop();
  };

  const removeCard = (id: string) => setCards((list) => list.filter((c) => c.id !== id));

  const freezeMembership = () => {
    if (!membership) return;
    setMembership({ ...membership, status: "Frozen" });
    setOverlay(null);
    toast("Membership frozen", "Billing pauses for 30 days.");
  };

  const cancelMembership = () => {
    if (!membership) return;
    setMembership({ ...membership, status: "Cancels" });
    setOverlay(null);
    setAlert(null);
    toast("Cancellation scheduled", `Access continues until ${membership.renews}.`);
  };

  return {
    stack,
    dir,
    tab,
    user,
    guest,
    onboarded,
    sessions,
    bookings,
    membership,
    cards,
    purchases,
    notices,
    filters,
    schedulePhase,
    appearance,
    typeScale,
    chromeLight,
    overlay,
    alert,
    menu,
    toasts,
    pendingUser,
    scheduleView,
    selectedDate,
    bookingTab,
    notifTab,
    planTab,
    prefs,
    saved,
    push,
    pop,
    reset,
    openTab,
    setGuest: (value: boolean) => {
      setGuest(value);
      if (value) {
        markOnboarded();
        reset({ name: "tabs" });
      }
    },
    markOnboarded,
    login,
    loginDemo,
    register,
    verify,
    logout,
    updateUser,
    guard,
    book,
    cancelBooking,
    joinWaitlist,
    leaveWaitlist,
    setAutoBook,
    setReminder,
    rate,
    claimSpot,
    setFilters,
    resetFilters: () => setFilters(emptyFilters()),
    refreshSchedule,
    setSchedulePhase,
    pay,
    addCard,
    removeCard,
    setDefaultCard: (id: string) => setCards((list) => list.map((c) => ({ ...c, isDefault: c.id === id }))),
    freezeMembership,
    cancelMembership,
    setAppearance: (value: "light" | "dark" | "system") => {
      setAppearance(value);
      localStorage.setItem("aluvita-appearance", value);
    },
    setTypeScale: (value: number) => {
      setTypeScale(value);
      localStorage.setItem("aluvita-type", String(value));
    },
    setChromeLight,
    setOverlay,
    setAlert,
    setMenu,
    toast,
    dismissToast: (id: number) => setToasts((list) => list.filter((t) => t.id !== id)),
    setScheduleView,
    setSelectedDate,
    setBookingTab,
    setNotifTab,
    setPlanTab,
    setPrefs: (patch: Partial<typeof prefs>) => setPrefs((current) => ({ ...current, ...patch })),
    markRead: (id: string) => setNotices((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n))),
    markAllRead: () => setNotices((list) => list.map((n) => ({ ...n, read: true }))),
    removeNotice: (id: string) => setNotices((list) => list.filter((n) => n.id !== id)),
    toggleSaved: (slug: string) =>
      setSaved((list) => (list.includes(slug) ? list.filter((item) => item !== slug) : [...list, slug])),
    resetPassword,
    deleteAccount: () => {
      const accounts = readAccounts().filter((a) => a.email !== user?.email);
      localStorage.setItem("aluvita-accounts", JSON.stringify(accounts));
      setUser(null);
      saveUser(null);
      setBookings([]);
      setMembership(null);
      setAlert(null);
      reset({ name: "welcome" });
      toast("Account deleted");
    },
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const value = useStudioState();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
