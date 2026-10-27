import type { ImageKey } from "./images";

export type Category =
  | "Vinyasa"
  | "Hatha"
  | "Yin"
  | "Power"
  | "Prenatal"
  | "Meditation"
  | "Restorative"
  | "Beginner";

export type Level = "Beginner" | "Intermediate" | "Advanced" | "All Levels";

export type Instructor = {
  id: string;
  name: string;
  focus: string;
  specialties: string[];
  short: string;
  bio: string;
  certifications: string[];
  rating: number;
  reviews: number;
  image: ImageKey;
};

export type Session = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  level: Level;
  instructorId: string;
  date: string;
  time: string;
  duration: number;
  room: "Room 1" | "Room 2";
  capacity: number;
  spots: number;
  price: number;
  credits: number;
  image: ImageKey;
};

export type BookingStatus = "Confirmed" | "Waitlisted" | "Cancelled" | "Completed" | "Missed";

export type Booking = {
  id: string;
  code: string;
  sessionId?: string;
  slug: string;
  title: string;
  instructorId: string;
  instructorName: string;
  image: ImageKey;
  date: string;
  time: string;
  duration: number;
  room: string;
  category: Category;
  level: Level;
  status: BookingStatus;
  waitlistPos?: number;
  autoBook?: boolean;
  spotOpened?: boolean;
  reminder: "1h" | "3h" | "1d" | null;
  payment: "credit" | "pass" | "card";
  rating?: number;
  price: number;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  memberSince: string;
  dob: string;
  emergencyName: string;
  emergencyPhone: string;
  health: string;
  experience: "Beginner" | "Intermediate" | "Advanced";
  goals: string[];
  avatar?: string;
  favoriteTypes: string[];
  preferredTimes: string[];
  preferredInstructors: string[];
  language: "English" | "Spanish";
};

export type Membership = {
  planId: string;
  name: string;
  status: "Active" | "Frozen" | "Cancels";
  credits: number;
  creditsTotal: number | null;
  renews: string;
  started: string;
  passCredits: number;
  passName: string;
};

export type PayCard = {
  id: string;
  brand: "Visa" | "Mastercard" | "Amex";
  last4: string;
  exp: string;
  isDefault: boolean;
  declines?: boolean;
};

export type Purchase = {
  id: string;
  item: string;
  dateLabel: string;
  iso: string;
  amount: number;
  status: "Paid" | "Refunded" | "Failed";
  method: string;
  month: string;
};

export type Notice = {
  id: string;
  kind: "booking" | "reminder" | "cancel" | "waitlist" | "announcement" | "promo";
  title: string;
  body: string;
  time: string;
  group: "Today" | "Earlier";
  read: boolean;
  slug?: string;
};

export type Plan = {
  id: string;
  group: "membership" | "pack" | "drop";
  name: string;
  price: number;
  period: string;
  popular?: boolean;
  blurb: string;
  features: string[];
  terms: string[];
};

export const DEMO_EMAIL = "sara.alvarez@email.com";
export const DEMO_PASSWORD = "studio123";

export const goals = ["Flexibility", "Strength", "Stress Relief", "Weight Management", "Mindfulness"];
export const classFilters = ["All", "Vinyasa", "Hatha", "Yin", "Power", "Prenatal", "Meditation"] as const;

export const instructors: Instructor[] = [
  {
    id: "sara",
    name: "Sara Mitchell",
    focus: "Vinyasa",
    specialties: ["Vinyasa", "Breath work", "All levels"],
    short: "Breath-led flow with a clear option beside every peak pose.",
    bio: "Sara has taught in San Francisco for nine years. Her sequences link a steady breath to creative standing work, and she always offers a slower path through the same pose. Students come for the sunrise class and stay for the way the room feels at the end.",
    certifications: ["RYT 500", "Yoga Medicine foundations"],
    rating: 4.9,
    reviews: 128,
    image: "sara",
  },
  {
    id: "daniel",
    name: "Daniel Cruz",
    focus: "Power Yoga",
    specialties: ["Power", "Strength", "Athletic flow"],
    short: "Strong standing work, smart core, and a cooldown that restores.",
    bio: "Daniel builds heat without hurry. Expect longer standing series, honest core work, and a backbend only when the body is ready. He trained as a competitive swimmer and teaches strength as something you can repeat tomorrow.",
    certifications: ["RYT 200", "Precision Nutrition Level 1"],
    rating: 4.8,
    reviews: 96,
    image: "daniel",
  },
  {
    id: "mei",
    name: "Mei Tanaka",
    focus: "Yin & Meditation",
    specialties: ["Yin", "Meditation", "Rest"],
    short: "Long holds, a quiet room, and guided sits.",
    bio: "Mei trained in yin and seated meditation. Her evening classes are dim, prop-heavy, and unhurried. She gives you the shape, then leaves enough quiet that you can actually feel it.",
    certifications: ["RYT 500", "Mindfulness teacher"],
    rating: 5,
    reviews: 84,
    image: "mei",
  },
  {
    id: "priya",
    name: "Priya Sharma",
    focus: "Hatha",
    specialties: ["Hatha", "Alignment", "Beginners"],
    short: "Foundational shapes you can repeat at home.",
    bio: "Priya teaches the poses people actually need when they are new, or when they want to feel precise again. She is patient with questions and specific about feet, hands, and breath.",
    certifications: ["RYT 500", "Hatha alignment"],
    rating: 4.9,
    reviews: 111,
    image: "priya",
  },
  {
    id: "olivia",
    name: "Olivia Brooks",
    focus: "Prenatal",
    specialties: ["Prenatal", "Supported flow", "Breath"],
    short: "A cool room and cues written for pregnancy.",
    bio: "Olivia keeps prenatal class specific: space in the side body, comfortable standing, and rest that is scheduled, not leftover. Tell her how you are feeling that week before you begin. Partners are welcome for the last ten minutes on Saturdays.",
    certifications: ["RYT 200", "Prenatal yoga certified"],
    rating: 4.9,
    reviews: 73,
    image: "olivia",
  },
  {
    id: "liam",
    name: "Liam Carter",
    focus: "Restorative",
    specialties: ["Restorative", "Somatics", "Stillness"],
    short: "Bolsters, blankets, and permission to stop.",
    bio: "Liam sets bolsters the way other teachers set a pace. Most of class is spent close to the floor, with holds long enough to matter. He speaks softly and not often.",
    certifications: ["RYT 500", "Somatic movement"],
    rating: 4.8,
    reviews: 64,
    image: "liam",
  },
];

const templates: {
  slug: string;
  name: string;
  category: Category;
  level: Level;
  instructorId: string;
  time: string;
  duration: number;
  room: "Room 1" | "Room 2";
  capacity: number;
  baseSpots: number;
  price: number;
  image: ImageKey;
  days: number[];
}[] = [
  { slug: "morning-vinyasa", name: "Morning Vinyasa", category: "Vinyasa", level: "All Levels", instructorId: "sara", time: "06:30", duration: 60, room: "Room 1", capacity: 18, baseSpots: 6, price: 22, image: "vinyasa", days: [1, 2, 3, 4, 5] },
  { slug: "hatha-basics", name: "Hatha Basics", category: "Hatha", level: "Beginner", instructorId: "priya", time: "09:00", duration: 60, room: "Room 1", capacity: 16, baseSpots: 11, price: 22, image: "hatha", days: [1, 3, 5, 6] },
  { slug: "express-flow", name: "Express Flow", category: "Vinyasa", level: "Intermediate", instructorId: "sara", time: "12:15", duration: 45, room: "Room 2", capacity: 14, baseSpots: 4, price: 18, image: "vinyasa", days: [1, 3, 5] },
  { slug: "power-yoga", name: "Power Yoga", category: "Power", level: "Advanced", instructorId: "daniel", time: "17:30", duration: 60, room: "Room 1", capacity: 20, baseSpots: 3, price: 22, image: "power", days: [1, 2, 3, 4] },
  { slug: "yin-yoga", name: "Yin Yoga", category: "Yin", level: "All Levels", instructorId: "mei", time: "19:00", duration: 75, room: "Room 2", capacity: 16, baseSpots: 8, price: 22, image: "yin", days: [1, 2, 4, 6] },
  { slug: "meditation", name: "Guided Meditation", category: "Meditation", level: "All Levels", instructorId: "mei", time: "20:15", duration: 30, room: "Room 2", capacity: 20, baseSpots: 12, price: 15, image: "meditation", days: [0, 1, 2, 4] },
  { slug: "prenatal", name: "Prenatal Yoga", category: "Prenatal", level: "All Levels", instructorId: "olivia", time: "10:30", duration: 60, room: "Room 2", capacity: 10, baseSpots: 3, price: 24, image: "prenatal", days: [2, 4, 6] },
  { slug: "restorative", name: "Restorative", category: "Restorative", level: "All Levels", instructorId: "liam", time: "16:00", duration: 75, room: "Room 2", capacity: 12, baseSpots: 5, price: 22, image: "restorative", days: [0, 2, 5] },
  { slug: "beginner", name: "Beginner Basics", category: "Beginner", level: "Beginner", instructorId: "priya", time: "09:00", duration: 60, room: "Room 1", capacity: 16, baseSpots: 9, price: 20, image: "beginner", days: [0, 2, 4] },
];

const copy: Record<string, { description: string; bring: string[]; benefits: string[] }> = {
  "morning-vinyasa": {
    description: "A sunrise flow that wakes the body without rushing it. Sara links sun salutations to standing balances and a long forward fold, with a slower option beside every stronger pose. You leave warm, clear, and ready for the day.",
    bring: ["A water bottle", "Layers for a cool start", "Grip socks if you like them"],
    benefits: ["Builds heat gradually", "Steadies the breath", "Wakes up hips and shoulders"],
  },
  "hatha-basics": {
    description: "Priya's morning hatha is the class to start with, or return to. Expect mountain, warrior, and a careful sun salute, with time to ask how a pose should feel. The pace stays steady so you can learn the shape.",
    bring: ["A water bottle", "Comfortable clothes", "Questions are welcome"],
    benefits: ["Learns alignment you can reuse", "Builds confidence", "Gentle strength"],
  },
  "express-flow": {
    description: "Forty-five minutes, one breath, no filler. This midday vinyasa is built for a lunch break: a short warm-up, a standing sequence, and a seated finish. Please arrive on time. The door closes five minutes in.",
    bring: ["A water bottle", "A towel if you sweat easily"],
    benefits: ["Fits a workday", "Focuses the mind", "Leaves you refreshed, not depleted"],
  },
  "power-yoga": {
    description: "Daniel's evening power class is athletic and precise. You work through longer standing series, core, and a controlled backbend, then come down with intent. It is offered as an advanced class. Newer students do well in Hatha Basics or Morning Vinyasa first.",
    bring: ["A water bottle", "A towel", "Energy for a full hour"],
    benefits: ["Strengthens legs and core", "Trains stamina", "Ends with a real cooldown"],
  },
  "yin-yoga": {
    description: "Lights low, holds of three to five minutes, and plenty of props. Mei guides yin for the hips, spine, and nervous system. Stillness is the work. You can always come out of a shape early.",
    bring: ["Warm layers", "Socks", "We set out bolsters and blankets"],
    benefits: ["Releases deep tension", "Calms the evening", "Improves patience in stillness"],
  },
  meditation: {
    description: "A half hour of guided sitting, with a few minutes of easy movement at the start. Mei offers a focus — breath, sound, or a simple phrase — and leaves quiet between instructions. Chairs are set out if the floor is uncomfortable.",
    bring: ["Nothing is required", "A cushion is provided", "Arrive a few minutes early"],
    benefits: ["Settles a busy mind", "Short enough for a weeknight", "Useful on its own or after class"],
  },
  prenatal: {
    description: "A supported practice for people who are pregnant. Olivia emphasizes comfortable standing, space through the side body, and scheduled rest. Tell her your week, and any guidance from your provider, before class begins. This is a yoga class, not a medical visit.",
    bring: ["A note for the teacher if you want one", "Water", "Layers"],
    benefits: ["Keeps you moving comfortably", "Practices steady breath", "Time to rest on purpose"],
  },
  restorative: {
    description: "Liam builds a nest of bolsters and blankets and then gets out of the way. Holds last from five to fifteen minutes. The room stays quiet. Come if you are tired, sore, or simply want to practice stopping.",
    bring: ["Warm clothes", "Socks", "An open evening"],
    benefits: ["Deep rest", "Eases a tired back", "Lowers the volume of the day"],
  },
  beginner: {
    description: "The same foundation as Hatha Basics, taught when the morning room is set aside for first-timers. You learn how to step onto the mat, how to breathe in a pose, and how to leave without forcing a stretch.",
    bring: ["Water", "Comfortable clothes you can kneel in", "No experience needed"],
    benefits: ["A clear first class", "Small, practical cues", "A teacher who expects questions"],
  },
};

export function classCopy(slug: string) {
  return copy[slug] ?? copy["hatha-basics"];
}

export function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

export function dateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function formatDay(key: string) {
  return parseKey(key).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function formatFull(key: string) {
  return parseKey(key).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const hr = (h ?? 0) % 12 || 12;
  const ampm = (h ?? 0) >= 12 ? "PM" : "AM";
  return `${hr}:${String(m ?? 0).padStart(2, "0")} ${ampm}`;
}

export function formatRange(t: string, duration: number) {
  const [h, m] = t.split(":").map(Number);
  const end = new Date(2000, 0, 1, h ?? 0, (m ?? 0) + duration);
  return `${formatTime(t)} – ${formatTime(`${end.getHours()}:${String(end.getMinutes()).padStart(2, "0")}`)}`;
}

export function greeting(name?: string) {
  const h = new Date().getHours();
  const part = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return name ? `${part}, ${name}` : part;
}

export function sessionDate(s: { date: string; time: string }) {
  const d = parseKey(s.date);
  const [hh, mm] = s.time.split(":").map(Number);
  d.setHours(hh ?? 0, mm ?? 0, 0, 0);
  return d;
}

export function isUpcoming(s: { date: string; time: string }) {
  return sessionDate(s).getTime() > Date.now() - 15 * 60 * 1000;
}

export function startsIn(date: string, time: string) {
  const diff = sessionDate({ date, time }).getTime() - Date.now();
  if (diff < -20 * 60 * 1000) return "Finished";
  if (diff < 0) return "In progress";
  const mins = Math.round(diff / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h >= 36) return formatDay(date);
  if (h > 0) return `Starts in ${h}h ${m}m`;
  return `Starts in ${m}m`;
}

export function money(n: number) {
  return `$${n}`;
}

export function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  const label = score <= 2 ? "Weak" : score <= 3 ? "Fair" : "Strong";
  return { score, label, tone: score <= 2 ? "weak" : score <= 3 ? "fair" : "strong" };
}

function spotCount(base: number, capacity: number, slug: string, key: string) {
  const n = key.split("-").reduce((sum, part) => sum + Number(part), 0);
  if (slug === "power-yoga" && n % 3 === 0) return 0;
  return Math.max(0, Math.min(capacity, base + ((n % 5) - 2)));
}

export function buildSessions(): Session[] {
  const start = addDays(new Date(), -10);
  const sessions: Session[] = [];
  for (let i = 0; i <= 24; i += 1) {
    const day = addDays(start, i);
    const key = dateKey(day);
    const dow = day.getDay();
    for (const t of templates) {
      if (!t.days.includes(dow)) continue;
      sessions.push({
        id: `${key}-${t.slug}`,
        slug: t.slug,
        name: t.name,
        category: t.category,
        level: t.level,
        instructorId: t.instructorId,
        date: key,
        time: t.time,
        duration: t.duration,
        room: t.room,
        capacity: t.capacity,
        spots: spotCount(t.baseSpots, t.capacity, t.slug, key),
        price: t.price,
        credits: 1,
        image: t.image,
      });
    }
  }
  return sessions;
}

export function instructorById(id: string) {
  return instructors.find((i) => i.id === id) ?? instructors[0];
}

export function demoUser(): User {
  return {
    id: "sara",
    firstName: "Sara",
    lastName: "Alvarez",
    email: DEMO_EMAIL,
    phone: "(415) 555-0148",
    password: DEMO_PASSWORD,
    memberSince: "May 2025",
    dob: "1994-03-12",
    emergencyName: "Mateo Alvarez",
    emergencyPhone: "(415) 555-0192",
    health: "Mild wrist sensitivity. I skip long holds on my hands.",
    experience: "Intermediate",
    goals: ["Stress Relief", "Flexibility"],
    favoriteTypes: ["Vinyasa", "Yin"],
    preferredTimes: ["Morning"],
    preferredInstructors: ["sara", "mei"],
    language: "English",
  };
}

export function renewalLabel(from = new Date()) {
  const d = new Date(from);
  d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function demoMembership(): Membership {
  return {
    planId: "eight",
    name: "8 Classes",
    status: "Active",
    credits: 5,
    creditsTotal: 8,
    renews: renewalLabel(),
    started: "May 18, 2025",
    passCredits: 2,
    passName: "5-Class Pass",
  };
}

function toBooking(s: Session, patch: Partial<Booking> & { status: BookingStatus }): Booking {
  const inst = instructorById(s.instructorId);
  return {
    id: `b-${s.id}`,
    code: `ALV-${s.id.replace(/\D/g, "").slice(-5)}`,
    sessionId: s.id,
    slug: s.slug,
    title: s.name,
    instructorId: s.instructorId,
    instructorName: inst.name,
    image: s.image,
    date: s.date,
    time: s.time,
    duration: s.duration,
    room: s.room,
    category: s.category,
    level: s.level,
    reminder: "1h",
    payment: "credit",
    price: s.price,
    ...patch,
    status: patch.status,
  };
}

export function prepareDemo() {
  const sessions = buildSessions();
  const upcoming = (slug: string) => sessions.find((s) => s.slug === slug && isUpcoming(s));
  const hatha = upcoming("hatha-basics") ?? upcoming("beginner");
  const vinyasa = upcoming("morning-vinyasa");
  const yin = upcoming("yin-yoga");
  const power = upcoming("power-yoga");
  if (hatha && hatha.spots > 0) hatha.spots -= 1;
  if (vinyasa && vinyasa.spots > 0) vinyasa.spots -= 1;
  if (power) power.spots = Math.max(power.spots, 1);

  const bookings: Booking[] = [];
  if (hatha) bookings.push(toBooking(hatha, { status: "Confirmed", payment: "credit" }));
  if (vinyasa && vinyasa.id !== hatha?.id) bookings.push(toBooking(vinyasa, { status: "Confirmed", payment: "credit" }));
  if (yin) bookings.push(toBooking(yin, { status: "Waitlisted", payment: "credit", waitlistPos: 3, autoBook: true }));
  if (power) bookings.push(toBooking(power, { status: "Waitlisted", payment: "credit", waitlistPos: 1, autoBook: false, spotOpened: true }));

  bookings.push(
    {
      id: "b-past-1",
      code: "ALV-22910",
      slug: "morning-vinyasa",
      title: "Morning Vinyasa",
      instructorId: "sara",
      instructorName: "Sara Mitchell",
      image: "vinyasa",
      date: dateKey(addDays(new Date(), -8)),
      time: "06:30",
      duration: 60,
      room: "Room 1",
      category: "Vinyasa",
      level: "All Levels",
      status: "Completed",
      reminder: null,
      payment: "credit",
      price: 22,
    },
    {
      id: "b-past-2",
      code: "ALV-21844",
      slug: "meditation",
      title: "Guided Meditation",
      instructorId: "mei",
      instructorName: "Mei Tanaka",
      image: "meditation",
      date: dateKey(addDays(new Date(), -12)),
      time: "20:15",
      duration: 30,
      room: "Room 2",
      category: "Meditation",
      level: "All Levels",
      status: "Missed",
      reminder: null,
      payment: "credit",
      price: 15,
    },
    {
      id: "b-past-3",
      code: "ALV-20411",
      slug: "restorative",
      title: "Restorative",
      instructorId: "liam",
      instructorName: "Liam Carter",
      image: "restorative",
      date: dateKey(addDays(new Date(), -4)),
      time: "16:00",
      duration: 75,
      room: "Room 2",
      category: "Restorative",
      level: "All Levels",
      status: "Cancelled",
      reminder: null,
      payment: "credit",
      price: 22,
    },
  );

  return { sessions, bookings };
}

export function demoCards(): PayCard[] {
  return [
    { id: "c1", brand: "Visa", last4: "4242", exp: "08/28", isDefault: true },
    { id: "c2", brand: "Mastercard", last4: "5512", exp: "01/27", isDefault: false },
    { id: "c3", brand: "Visa", last4: "0002", exp: "04/27", isDefault: false, declines: true },
  ];
}

export function demoPurchases(): Purchase[] {
  return [
    { id: "p1", item: "8 Classes membership", dateLabel: "Oct 18, 2026", iso: "2026-10-18", amount: 89, status: "Paid", method: "Visa ••4242", month: "October 2026" },
    { id: "p2", item: "Yin Yoga drop-in", dateLabel: "Oct 4, 2026", iso: "2026-10-04", amount: 22, status: "Paid", method: "Visa ••4242", month: "October 2026" },
    { id: "p3", item: "5-Class Pass", dateLabel: "Sep 12, 2026", iso: "2026-09-12", amount: 99, status: "Paid", method: "Mastercard ••5512", month: "September 2026" },
    { id: "p4", item: "Towel rental", dateLabel: "Sep 2, 2026", iso: "2026-09-02", amount: 2, status: "Paid", method: "Visa ••4242", month: "September 2026" },
  ];
}

export function demoNotices(): Notice[] {
  return [
    { id: "n1", kind: "booking", title: "Booking confirmed", body: "You are in for Hatha Basics today at 9:00 AM, Room 1.", time: "7:12 AM", group: "Today", read: false },
    { id: "n2", kind: "reminder", title: "Class reminder", body: "Morning Vinyasa with Sara Mitchell is on your schedule.", time: "6:40 AM", group: "Today", read: false },
    { id: "n3", kind: "waitlist", title: "A spot opened up", body: "Power Yoga has a place. Book it before the hold expires.", time: "Yesterday", group: "Earlier", read: false, slug: "power-yoga" },
    { id: "n4", kind: "cancel", title: "Class cancelled", body: "Sunday Restorative was cancelled. Your credit was returned.", time: "Oct 18", group: "Earlier", read: true },
    { id: "n5", kind: "announcement", title: "Thanksgiving hours", body: "The studio is closed Thursday, Nov 26. Friday classes run as usual.", time: "Oct 21", group: "Earlier", read: true },
    { id: "n6", kind: "promo", title: "Bring a friend", body: "Share code FRIEND20 for 20% off a class pack this month.", time: "Oct 15", group: "Earlier", read: true },
  ];
}

export const plans: Plan[] = [
  {
    id: "unlimited",
    group: "membership",
    name: "Unlimited",
    price: 129,
    period: "per month",
    popular: true,
    blurb: "Practice as often as you like, up to one class a day.",
    features: ["Every class on the schedule", "One visit per day", "Mat included", "Freeze once a year"],
    terms: ["Renews monthly until you cancel.", "Fair use is one class a day.", "Cancel before your renewal date and you keep access through that date.", "A freeze pauses billing for up to 30 days, once each year."],
  },
  {
    id: "eight",
    group: "membership",
    name: "8 Classes",
    price: 89,
    period: "per month",
    blurb: "Eight credits each month for a steady practice.",
    features: ["8 credits every month", "All class types", "Mat included", "Credits reset on renewal"],
    terms: ["Unused credits do not roll over.", "Each class uses one credit, including the 45-minute Express Flow.", "Cancel before renewal to stop the next charge.", "You can freeze once a year for up to 30 days."],
  },
  {
    id: "four",
    group: "membership",
    name: "4 Classes",
    price: 55,
    period: "per month",
    blurb: "Four credits a month when you want a lighter rhythm.",
    features: ["4 credits every month", "All class types", "Mat included", "Lowest monthly price"],
    terms: ["Unused credits do not roll over.", "Guest passes are not included on this plan.", "Cancel before your renewal date.", "A single extra class can be paid as a drop-in."],
  },
  {
    id: "pack5",
    group: "pack",
    name: "5-Class Pass",
    price: 99,
    period: "valid 4 months",
    blurb: "Five classes to use before the pass expires.",
    features: ["5 credits", "Valid for 4 months", "All class types", "Shareable with one friend"],
    terms: ["Credits expire four months from purchase.", "A friend may use one credit if you book it in their name at the desk.", "Passes are not refundable after the first class."],
  },
  {
    id: "pack10",
    group: "pack",
    name: "10-Class Pass",
    price: 180,
    period: "valid 6 months",
    blurb: "The best value if you come about twice a week.",
    features: ["10 credits", "Valid for 6 months", "All class types", "Mat included"],
    terms: ["Credits expire six months from purchase.", "One credit covers any scheduled class.", "Not refundable after the first class is taken."],
  },
  {
    id: "pack20",
    group: "pack",
    name: "20-Class Pass",
    price: 320,
    period: "valid 12 months",
    blurb: "A year of classes without a monthly renewal.",
    features: ["20 credits", "Valid for 12 months", "All class types", "Lowest price per class"],
    terms: ["Credits expire twelve months from purchase.", "They cannot be paused.", "Not refundable after the first class is taken."],
  },
  {
    id: "dropin",
    group: "drop",
    name: "Single Class",
    price: 22,
    period: "one class",
    blurb: "Book one class when you are in the neighborhood.",
    features: ["Any regular class", "Mat included", "Book up to an hour before"],
    terms: ["The visit is tied to the class you choose at checkout.", "Free cancellation up to 6 hours before the start.", "Inside 6 hours the fee is kept."],
  },
  {
    id: "intro",
    group: "drop",
    name: "Intro Offer",
    price: 15,
    period: "first class",
    blurb: "Your first class at Aluvita, at a quieter price.",
    features: ["New students only", "Any class except workshops", "Mat included"],
    terms: ["One intro price per person.", "It cannot be combined with a class pack.", "Free cancellation up to 6 hours before class."],
  },
];

export const announcements = [
  { id: "a1", title: "Thanksgiving hours", body: "We are closed Thursday, Nov 26. Friday sunrise flow is open and tends to fill." },
  { id: "a2", title: "Yin series with Mei", body: "Four Thursday evenings in November. Props are already set out for you." },
  { id: "a3", title: "Mats are included", body: "Members borrow a mat at the desk. A studio towel is $2 if you want one." },
];

export const promos = [
  { id: "first", title: "First class free", body: "New here? Your intro class is on us this month.", image: "promo1" as ImageKey, planId: "intro" },
  { id: "friend", title: "Bring a friend, 20% off", body: "Use code FRIEND20 on any class pack.", image: "promo2" as ImageKey, code: "FRIEND20" },
  { id: "sunrise", title: "Sunrise week", body: "6:30 AM classes all week. One credit, a clear head.", image: "promo3" as ImageKey },
];

export const hours = [
  { day: "Monday", open: "6:00 AM – 9:00 PM" },
  { day: "Tuesday", open: "6:00 AM – 9:00 PM" },
  { day: "Wednesday", open: "6:00 AM – 9:00 PM" },
  { day: "Thursday", open: "6:00 AM – 9:00 PM" },
  { day: "Friday", open: "6:00 AM – 9:00 PM" },
  { day: "Saturday", open: "7:30 AM – 6:00 PM" },
  { day: "Sunday", open: "8:00 AM – 5:00 PM" },
];

export const faqs = [
  { q: "What should I bring?", a: "Water and clothes you can move in. Mats are at the desk for members. Towels are $2. Grip socks are optional." },
  { q: "How early should I arrive?", a: "Ten minutes is enough. The door to a class closes five minutes after the start so the room can settle. Late arrival is a late cancel." },
  { q: "What is the cancellation policy?", a: "You can cancel free of charge until 6 hours before class. Inside that window the credit or drop-in fee is kept, unless we cancel the class." },
  { q: "How do waitlists work?", a: "Join from the class page. If a spot opens, we notify you and can book it automatically when that toggle is on. You can leave the list any time." },
  { q: "Do unused credits roll over?", a: "Monthly plan credits reset on your renewal date. Class-pack credits stay until the pass expires." },
  { q: "Where do I park?", a: "Street parking is on Union. The lot behind 1830 Union validates two hours when you show a booking." },
  { q: "Are there showers?", a: "There is a changing room and a restroom, and no showers. Most students come dressed for class." },
  { q: "Are the rooms heated?", a: "No. The rooms stay naturally warm. Power Yoga feels warm because of the work, not because of the thermostat." },
  { q: "Can I freeze a membership?", a: "Yes. Once each year you can pause billing for up to 30 days. Your renewal date moves with the freeze." },
  { q: "I have never tried yoga. Where do I start?", a: "Beginner Basics or Hatha Basics. Tell Priya it is your first class. She will place you where you can see and will not ask you to do anything extreme." },
];

export const policies = [
  { title: "Cancellation", body: "Cancel in the app until 6 hours before the start and your credit comes back, or your drop-in fee is refunded. Later than that, the visit is used. If we cancel, you are always refunded." },
  { title: "Late arrival", body: "The door closes five minutes after class begins. If you miss that window, the booking becomes a late cancel so the people inside are not interrupted." },
  { title: "Mat and towel rental", body: "A mat is included with every membership, pass, and drop-in. Ask at the desk. Studio towels are $2 and go in the hamper by the front door." },
  { title: "Health and safety", body: "Tell your teacher about injuries, pregnancy, or anything that changes how you should move. Yoga is physical. Stop a pose that feels sharp. We are not a medical clinic, and we will call for help if someone needs it." },
  { title: "Studio etiquette", body: "Phones stay silent. Shoes come off at the shelf. Save conversation for the lobby so the room can stay quiet. A light scent is fine. A strong fragrance is not, because the room is small." },
];

export const legalDocs = {
  terms: {
    title: "Terms of Service",
    body: [
      "These terms cover your use of the Aluvita Studio app and your visits to the studio at 1847 Union Street, San Francisco.",
      "Bookings are a hold on a spot. A membership or pass gives you credits, not a guarantee of a particular class if it is full. Waitlists are offered in the order people join.",
      "You can cancel without a fee until 6 hours before class. After that, the credit or drop-in payment is used. If Aluvita cancels, we return the credit or refund the fee.",
      "Monthly plans renew until you cancel. Class packs expire on the date shown at purchase. Intro pricing is limited to one visit per person.",
      "You are responsible for choosing classes that suit you and for telling the teacher about injuries or pregnancy. Stop any pose that causes sharp pain.",
      "Do not misuse the app, share your login, or scrape the schedule. We may suspend an account that abuses waitlists or no-shows repeatedly.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    body: [
      "We keep the details you give us to run your account: name, email, phone, bookings, payments, and optional notes such as injuries or emergency contacts.",
      "Payment cards are stored by our processor. The app shows brand and last four digits, not the full number.",
      "We use booking data to send the reminders you turn on, and to hold your spot. We do not sell your information.",
      "Health notes are visible to the teachers of classes you book, so they can offer a safer option. You can clear those notes in Edit Profile.",
      "You can download a copy of your data from Settings, or ask us to delete the account. Deleting removes your profile, bookings, and saved cards from the app.",
      "The studio address is 1847 Union Street. Email hello@aluvitastudio.com if you have a privacy question.",
    ],
  },
};

export function todayName() {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

export function todayHours() {
  return hours.find((h) => h.day === todayName())?.open ?? "";
}

export function downloadPdf(title: string, lines: string[]) {
  const esc = (line: string) => line.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const commands = [title, ...lines]
    .map((line, i) => `BT /F1 ${i === 0 ? 18 : 12} Tf 56 ${740 - i * 22} Td (${esc(line)}) Tj ET`)
    .join("\n");
  const objects = [
    "1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n",
    "2 0 obj<< /Type /Pages /Count 1 /Kids [3 0 R] >>endobj\n",
    "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>endobj\n",
    `4 0 obj<< /Length ${commands.length} >>stream\n${commands}\nendstream\nendobj\n`,
    "5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj\n",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i += 1) pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const blob = new Blob([pdf], { type: "application/pdf" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "aluvita-receipt.pdf";
  a.click();
  URL.revokeObjectURL(a.href);
}
