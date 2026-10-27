import {
  Bell,
  CreditCard,
  HelpCircle,
  Info,
  Lock,
  LogOut,
  MapPin,
  Settings,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  Badge,
  Button,
  Empty,
  Group,
  MiniCalendar,
  Row,
  Screen,
  Section,
  Segmented,
  SwipeRow,
  TextField,
  ToggleRow,
} from "@/components/ios/ui";
import {
  faqs,
  formatFull,
  goals,
  hours,
  instructors,
  legalDocs,
  passwordStrength,
  policies,
  todayName,
} from "@/lib/data";
import { images, logoUrl } from "@/lib/images";
import { plans } from "@/lib/data";
import { useApp } from "@/lib/store";
import { classCopy } from "@/lib/data";

export function ProfileScreen() {
  const app = useApp();
  const user = app.user;
  return (
    <Screen large title="Profile">
      {user ? (
        <div className="alu-pad" style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 12 }}>
          <button type="button" className="alu-icon-btn" style={{ width: 88, height: 88 }} aria-label="Edit photo" onClick={() => app.setOverlay({ type: "photo" })}>
            <img className="alu-avatar lg" src={user.avatar || images.member} alt="" />
          </button>
          <div>
            <strong className="alu-t2">{user.firstName} {user.lastName}</strong>
            <div className="alu-f">{user.email}</div>
            <div className="alu-f">Member since {user.memberSince}</div>
            {app.membership && <Badge status={app.membership.name} />}
          </div>
        </div>
      ) : (
        <div className="alu-pad" style={{ marginBottom: 12 }}>
          <div className="alu-card" style={{ padding: 16 }}>
            <h2 className="alu-t2" style={{ marginTop: 0 }}>You are browsing as a guest</h2>
            <p className="alu-c" style={{ color: "var(--muted)" }}>Sign in to keep bookings, credits, and reminders.</p>
            <Button onClick={() => app.reset({ name: "login" })}>Log In</Button>
          </div>
        </div>
      )}
      <Section>Account</Section>
      <Group>
        <Row icon={<UserRound size={20} />} title="Personal Information" onClick={() => app.push({ name: "editProfile" })} />
        <Row icon={<BadgeIcon />} title="Membership Details" onClick={() => app.push({ name: "membership" })} />
        <Row icon={<CreditCard size={20} />} title="Payment Methods" onClick={() => app.push({ name: "payments" })} />
        <Row icon={<CreditCard size={20} />} title="Purchase History" onClick={() => app.push({ name: "purchases" })} />
        <Row title="Preferences" onClick={() => app.push({ name: "preferences" })} />
      </Group>
      <Section>Studio</Section>
      <Group>
        <Row icon={<Bell size={20} />} title="Notifications" onClick={() => app.push({ name: "notifications" })} />
        <Row icon={<Info size={20} />} title="Studio Information" onClick={() => app.push({ name: "studio" })} />
        <Row icon={<Settings size={20} />} title="Settings" onClick={() => app.push({ name: "settings" })} />
        <Row icon={<HelpCircle size={20} />} title="Help & Support" onClick={() => app.push({ name: "help" })} />
      </Group>
      {user && (
        <Group>
          <Row icon={<LogOut size={20} />} title="Log Out" destructive onClick={() => app.setOverlay({ type: "logout" })} />
        </Group>
      )}
    </Screen>
  );
}

function BadgeIcon() {
  return <span className="alu-badge">8</span>;
}

export function EditProfileScreen() {
  const app = useApp();
  const user = app.user;
  const [form, setForm] = useState(() => ({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    dob: user?.dob ?? "1994-03-12",
    emergencyName: user?.emergencyName ?? "",
    emergencyPhone: user?.emergencyPhone ?? "",
    health: user?.health ?? "",
  }));
  const [openDob, setOpenDob] = useState(false);
  if (!user) return <Screen title="Edit Profile" back><Empty title="Sign in to edit" body="Your profile is saved with your account." action="Log In" onAction={() => app.setOverlay({ type: "auth" })} /></Screen>;
  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));
  return (
    <Screen title="Edit Profile" back>
      <div className="alu-pad">
        <div style={{ textAlign: "center" }}>
          <img className="alu-avatar lg" src={user.avatar || images.member} alt="" />
          <div><Button variant="text" onClick={() => app.setOverlay({ type: "photo" })}>Change Photo</Button></div>
        </div>
        <TextField label="First name" value={form.firstName} onChange={(v) => set("firstName", v)} />
        <TextField label="Last name" value={form.lastName} onChange={(v) => set("lastName", v)} />
        <TextField label="Email" value={form.email} onChange={(v) => set("email", v)} />
        <TextField label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
        <p className="alu-label">Date of birth</p>
        <button type="button" className="alu-input" style={{ textAlign: "left", marginBottom: 12 }} onClick={() => setOpenDob((v) => !v)}>{formatFull(form.dob)}</button>
        {openDob && <MiniCalendar value={form.dob} onChange={(dob) => set("dob", dob)} />}
        <TextField label="Emergency contact" value={form.emergencyName} onChange={(v) => set("emergencyName", v)} />
        <TextField label="Emergency phone" value={form.emergencyPhone} onChange={(v) => set("emergencyPhone", v)} />
        <TextField label="Health notes" value={form.health} onChange={(v) => set("health", v)} multiline helper="Teachers see this only for classes you book." />
        <Button
          onClick={() => {
            app.updateUser(form);
            app.toast("Profile saved");
            app.pop();
          }}
        >
          Save
        </Button>
      </div>
    </Screen>
  );
}

export function PasswordScreen() {
  const app = useApp();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const strength = passwordStrength(next);
  return (
    <Screen title="Change Password" back>
      <form
        className="alu-pad"
        onSubmit={(e) => {
          e.preventDefault();
          if (!app.user || current !== app.user.password) {
            setError("Current password is not right.");
            return;
          }
          if (strength.score < 3) {
            setError("Use a stronger new password.");
            return;
          }
          if (next !== confirm) {
            setError("New passwords do not match.");
            return;
          }
          app.updateUser({ password: next });
          app.setAlert({
            title: "Password changed",
            message: "Use this password the next time you log in with email.",
            confirmLabel: "OK",
            onConfirm: () => {
              app.setAlert(null);
              app.pop();
            },
          });
        }}
      >
        <TextField label="Current password" type="password" value={current} onChange={setCurrent} />
        <TextField label="New password" type="password" value={next} onChange={setNext} />
        <div className="alu-meter"><span className={strength.tone} style={{ width: `${(strength.score / 5) * 100}%` }} /></div>
        <p className="alu-f">Strength: {next ? strength.label : "—"}</p>
        <TextField label="Confirm new password" type="password" value={confirm} onChange={setConfirm} error={error} />
        <Button type="submit">Update Password</Button>
      </form>
    </Screen>
  );
}

export function PreferencesScreen() {
  const app = useApp();
  const user = app.user;
  if (!user) return <Screen title="Preferences" back><Empty title="Sign in first" body="Preferences are saved on your account." /></Screen>;
  const toggle = (list: string[], value: string) => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  return (
    <Screen large title="Preferences" back>
      <Section>Favorite class types</Section>
      <div className="alu-pad" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {["Vinyasa", "Hatha", "Yin", "Power", "Prenatal", "Meditation", "Restorative"].map((item) => (
          <button key={item} type="button" className={`alu-chip ${user.favoriteTypes.includes(item) ? "on" : ""}`} onClick={() => app.updateUser({ favoriteTypes: toggle(user.favoriteTypes, item) })}>
            {item}
          </button>
        ))}
      </div>
      <Section>Preferred times</Section>
      <div className="alu-pad" style={{ display: "flex", gap: 8 }}>
        {["Morning", "Afternoon", "Evening"].map((item) => (
          <button key={item} type="button" className={`alu-chip ${user.preferredTimes.includes(item) ? "on" : ""}`} onClick={() => app.updateUser({ preferredTimes: toggle(user.preferredTimes, item) })}>
            {item}
          </button>
        ))}
      </div>
      <Section>Preferred instructors</Section>
      <Group>
        {instructors.map((teacher) => (
          <Row
            key={teacher.id}
            title={teacher.name}
            subtitle={teacher.focus}
            trailing={user.preferredInstructors.includes(teacher.id) ? <Badge status="Active" /> : <span className="alu-f">Add</span>}
            onClick={() => app.updateUser({ preferredInstructors: toggle(user.preferredInstructors, teacher.id) })}
          />
        ))}
      </Group>
      <Section>Language</Section>
      <div className="alu-pad">
        <Segmented
          value={user.language}
          onChange={(id) => {
            app.updateUser({ language: id as "English" | "Spanish" });
            app.toast(id === "Spanish" ? "Idioma guardado" : "Language saved", "This preview stays in English.");
          }}
          options={[
            { id: "English", label: "English" },
            { id: "Spanish", label: "Español" },
          ]}
        />
      </div>
      <div className="alu-pad"><p className="alu-f">Goals on your account: {user.goals.join(", ") || goals.slice(0, 2).join(", ")}</p></div>
    </Screen>
  );
}

export function NotificationsScreen() {
  const app = useApp();
  const [pullKey, setPullKey] = useState(0);
  const filtered = app.notices.filter((notice) => {
    if (app.notifTab === "bookings") return ["booking", "reminder", "cancel", "waitlist"].includes(notice.kind);
    if (app.notifTab === "promos") return notice.kind === "promo" || notice.kind === "announcement";
    return true;
  });
  const groups = ["Today", "Earlier"] as const;
  return (
    <Screen
      large
      title="Notifications"
      back
      onRefresh={() => {
        setPullKey((n) => n + 1);
        app.toast("Notifications updated");
      }}
      trailing={<Button variant="text" onClick={() => app.markAllRead()}>Mark all as read</Button>}
    >
      <div className="alu-pad" style={{ marginBottom: 8 }}>
        <Segmented
          value={app.notifTab}
          onChange={(id) => app.setNotifTab(id as "all" | "bookings" | "promos")}
          options={[
            { id: "all", label: "All" },
            { id: "bookings", label: "Bookings" },
            { id: "promos", label: "Promotions" },
          ]}
        />
      </div>
      {filtered.length === 0 && <Empty title="You're all caught up" body="Booking updates and studio notes will land here." />}
      {groups.map((group) => {
        const rows = filtered.filter((notice) => notice.group === group);
        if (!rows.length) return null;
        return (
          <div key={`${group}-${pullKey}`}>
            <Section>{group}</Section>
            <Group>
              {rows.map((notice) => (
                <SwipeRow
                  key={notice.id}
                  actions={[
                    { label: notice.read ? "Unread" : "Read", tone: "ok", onClick: () => app.markRead(notice.id) },
                    { label: "Delete", tone: "danger", onClick: () => app.removeNotice(notice.id) },
                  ]}
                >
                  <button type="button" className="alu-row" style={{ alignItems: "flex-start" }} onClick={() => app.markRead(notice.id)}>
                    {!notice.read && <span className="alu-dot" style={{ marginTop: 8 }} />}
                    <span className="alu-grow">
                      <span className="alu-h" style={{ display: "block" }}>{notice.title}</span>
                      <span className="alu-f">{notice.body}</span>
                      {notice.kind === "waitlist" && (
                        <span className="alu-linkish" onClick={(e) => { e.stopPropagation(); const session = app.sessions.find((s) => s.slug === notice.slug); if (session) app.push({ name: "class", sessionId: session.id }); }}>
                          Book Now
                        </span>
                      )}
                    </span>
                    <span className="alu-f">{notice.time}</span>
                  </button>
                </SwipeRow>
              ))}
            </Group>
          </div>
        );
      })}
    </Screen>
  );
}

export function StudioScreen() {
  const app = useApp();
  const gallery = [images.studio1, images.studio2, images.studio3, images.studio4];
  const classTypes = [
    ["morning-vinyasa", "Vinyasa Flow"],
    ["hatha-basics", "Hatha"],
    ["yin-yoga", "Yin"],
    ["power-yoga", "Power Yoga"],
    ["prenatal", "Prenatal"],
    ["meditation", "Meditation"],
    ["restorative", "Restorative"],
    ["beginner", "Beginner Basics"],
  ] as const;
  return (
    <Screen large title="Studio" back>
      <div className="alu-gallery">
        {gallery.map((src) => (
          <figure key={src}><img src={src} alt="Aluvita Studio interior" /></figure>
        ))}
      </div>
      <div className="alu-pad">
        <img src={logoUrl} alt="" style={{ width: 120, borderRadius: 12, background: "#000" }} />
        <h2 className="alu-t2">About Aluvita Studio</h2>
        <p className="alu-b">Aluvita is a neighborhood yoga room on Union Street. We opened in 2016 so a practice could feel calm the moment you walk in. Classes stay small, the light is natural, and teachers cue with care.</p>
        <p className="alu-b">Whether you want a strong flow or a long rest, you should feel expected.</p>
      </div>
      <Section>Location</Section>
      <div className="alu-pad">
        <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", height: 180 }}>
          <img src={images.map} alt="Map of the studio neighborhood" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <span style={{ position: "absolute", left: "58%", top: "42%", width: 18, height: 18, borderRadius: "50% 50% 50% 0", background: "#d98b63", transform: "rotate(-45deg)" }} />
        </div>
        <p className="alu-h">1847 Union Street<br />San Francisco, CA 94123</p>
        <p className="alu-f">Street parking on Union. The lot behind 1830 Union validates two hours with a class booking.</p>
        <a className="alu-btn" href="https://maps.apple.com/?q=1847+Union+Street+San+Francisco" target="_blank" rel="noreferrer">Get Directions</a>
      </div>
      <Section>Contact</Section>
      <div className="alu-pad" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <a className="alu-btn secondary" href="tel:+14155550198">Call</a>
        <a className="alu-btn secondary" href="mailto:hello@aluvitastudio.com">Email</a>
        <a className="alu-btn secondary" href="https://wa.me/14155550198" target="_blank" rel="noreferrer">WhatsApp</a>
        <a className="alu-btn secondary" href="https://instagram.com/aluvitastudio" target="_blank" rel="noreferrer">Instagram</a>
      </div>
      <Section>Opening hours</Section>
      <Group>
        {hours.map((row) => (
          <div key={row.day} className={`alu-hour ${row.day === todayName() ? "today" : ""}`}>
            <span>{row.day}{row.day === todayName() ? " · Today" : ""}</span>
            <span>{row.open}</span>
          </div>
        ))}
      </Group>
      <Section>Class descriptions</Section>
      <Accordion items={classTypes.map(([slug, title]) => ({ title, body: classCopy(slug).description }))} />
      <Section>Studio policies</Section>
      <Accordion items={policies.map((policy) => ({ title: policy.title, body: policy.body }))} />
      <Section>FAQs</Section>
      <Accordion items={faqs.map((faq) => ({ title: faq.q, body: faq.a }))} />
      <div className="alu-pad"><Button variant="secondary" onClick={() => app.openTab("schedule")}><MapPin size={18} /> See today's classes</Button></div>
    </Screen>
  );
}

export function SettingsScreen() {
  const app = useApp();
  const steps = [0.9, 1, 1.15, 1.3, 1.45];
  return (
    <Screen large title="Settings" back>
      <Section>Notifications</Section>
      <Group>
        <ToggleRow title="Booking confirmations" on={app.prefs.booking} onChange={(booking) => app.setPrefs({ booking })} />
        <ToggleRow title="Class reminders" on={app.prefs.reminder} onChange={(reminder) => app.setPrefs({ reminder })} />
        <ToggleRow title="Cancellation alerts" on={app.prefs.cancellation} onChange={(cancellation) => app.setPrefs({ cancellation })} />
        <ToggleRow title="Waitlist alerts" on={app.prefs.waitlist} onChange={(waitlist) => app.setPrefs({ waitlist })} />
        <ToggleRow title="Announcements" on={app.prefs.announcements} onChange={(announcements) => app.setPrefs({ announcements })} />
        <ToggleRow title="Promotions" on={app.prefs.promotions} onChange={(promotions) => app.setPrefs({ promotions })} />
      </Group>
      <div className="alu-pad">
        <p className="alu-label">Reminder timing</p>
        <Segmented
          value={app.prefs.reminderTiming}
          onChange={(id) => app.setPrefs({ reminderTiming: id as "1h" | "3h" | "1d" })}
          options={[{ id: "1h", label: "1 hour" }, { id: "3h", label: "3 hours" }, { id: "1d", label: "1 day" }]}
        />
        <div style={{ height: 12 }} />
        <ToggleRow title="Push" on={app.prefs.push} onChange={(push) => app.setPrefs({ push })} />
        <ToggleRow title="Email" on={app.prefs.email} onChange={(email) => app.setPrefs({ email })} />
        <ToggleRow title="SMS" on={app.prefs.sms} onChange={(sms) => app.setPrefs({ sms })} />
      </div>
      <Section>Account</Section>
      <Group>
        <Row title="Edit Profile" onClick={() => app.push({ name: "editProfile" })} />
        <Row title="Change Password" onClick={() => app.push({ name: "password" })} />
        <Row title="Linked Accounts" onClick={() => app.push({ name: "linked" })} />
        <Row
          title="Delete Account"
          destructive
          onClick={() =>
            app.setAlert({
              title: "Delete your account?",
              message: "Bookings, saved cards, and profile notes will be removed from this device.",
              confirmLabel: "Delete",
              destructive: true,
              onConfirm: () => app.deleteAccount(),
            })
          }
        />
      </Group>
      <Section>Privacy</Section>
      <Group>
        <ToggleRow title="Face ID lock" subtitle="Ask for Face ID when opening the app" on={app.prefs.faceId} onChange={(faceId) => app.setPrefs({ faceId })} />
        <ToggleRow title="Share usage data" on={app.prefs.dataSharing} onChange={(dataSharing) => app.setPrefs({ dataSharing })} />
        <ToggleRow title="Marketing emails" on={app.prefs.marketing} onChange={(marketing) => app.setPrefs({ marketing })} />
        <Row icon={<Lock size={18} />} title="Privacy Policy" onClick={() => app.push({ name: "legal", doc: "privacy" })} />
        <Row title="Terms of Service" onClick={() => app.push({ name: "legal", doc: "terms" })} />
        <Row title="Download My Data" onClick={() => app.toast("Export started", `We'll email a copy to ${app.user?.email ?? "you"}.`)} />
      </Group>
      <Section>App</Section>
      <div className="alu-pad">
        <p className="alu-label">Appearance</p>
        <Segmented
          value={app.appearance}
          onChange={(id) => app.setAppearance(id as "light" | "dark" | "system")}
          options={[{ id: "light", label: "Light" }, { id: "dark", label: "Dark" }, { id: "system", label: "System" }]}
        />
        <p className="alu-label" style={{ marginTop: 14 }}>Text size</p>
        <input
          type="range"
          min={0}
          max={4}
          step={1}
          value={steps.indexOf(app.typeScale) < 0 ? 1 : steps.indexOf(app.typeScale)}
          aria-label="Text size"
          onChange={(e) => app.setTypeScale(steps[Number(e.target.value)] ?? 1)}
          style={{ width: "100%" }}
        />
        <p className="alu-b">Text size follows this slider so layouts can grow with you.</p>
      </div>
      <Group>
        <Row title="Language" subtitle={app.user?.language ?? "English"} onClick={() => app.push({ name: "preferences" })} />
        <ToggleRow title="Calendar sync" on={app.prefs.calendarSync} onChange={(calendarSync) => app.setPrefs({ calendarSync })} />
        <Row title="Design system" subtitle="Colors, type, and components" onClick={() => app.push({ name: "design" })} />
        <div className="alu-row"><span className="alu-grow">Version</span><span className="alu-f">1.0.0 (24)</span></div>
      </Group>
      <Group>
        <Row title="Log Out" destructive onClick={() => app.setOverlay({ type: "logout" })} />
      </Group>
    </Screen>
  );
}

export function HelpScreen() {
  const app = useApp();
  const [message, setMessage] = useState("");
  return (
    <Screen large title="Help & Support" back>
      <div className="alu-pad">
        <p className="alu-b">The front desk answers most notes the same day, between opening and the last class.</p>
        <TextField label="Message the studio" value={message} onChange={setMessage} multiline placeholder="Tell us what you need" />
        <Button
          onClick={() => {
            if (message.trim().length < 8) {
              app.toast("Write a little more", "A sentence is enough.");
              return;
            }
            setMessage("");
            app.toast("Message sent", "We'll reply from hello@aluvitastudio.com.");
          }}
        >
          Send
        </Button>
      </div>
      <Group>
        <Row title="Call the studio" subtitle="(415) 555-0198" onClick={() => { window.location.href = "tel:+14155550198"; }} />
        <Row title="Email" subtitle="hello@aluvitastudio.com" onClick={() => { window.location.href = "mailto:hello@aluvitastudio.com"; }} />
        <Row title="FAQs and policies" onClick={() => app.push({ name: "studio" })} />
      </Group>
    </Screen>
  );
}

export function LegalScreen({ doc }: { doc: "terms" | "privacy" }) {
  const page = legalDocs[doc];
  return (
    <Screen large title={page.title} back>
      <div className="alu-pad">
        {page.body.map((paragraph) => <p key={paragraph} className="alu-b">{paragraph}</p>)}
      </div>
    </Screen>
  );
}

export function LinkedScreen() {
  const app = useApp();
  return (
    <Screen large title="Linked Accounts" back>
      <Group>
        <ToggleRow title="Apple" subtitle={app.prefs.apple ? "Connected" : "Not connected"} on={app.prefs.apple} onChange={(apple) => app.setPrefs({ apple })} />
        <ToggleRow title="Google" subtitle={app.prefs.google ? "Connected" : "Not connected"} on={app.prefs.google} onChange={(google) => app.setPrefs({ google })} />
      </Group>
      <p className="alu-f alu-pad">Linked accounts can sign you in. Email and password still work.</p>
    </Screen>
  );
}

export function DesignScreen() {
  const app = useApp();
  const session = app.sessions.find((s) => s.spots > 0);
  const colors = [
    ["Sage", "#5E8C7B", "#1f2724"],
    ["Primary Dark", "#3F6657", "#fff"],
    ["Terracotta", "#D98B63", "#2a160e"],
    ["Background", "#FAF7F2", "#1f2724"],
    ["Surface", "#FFFFFF", "#1f2724"],
    ["Ink", "#1F2724", "#fff"],
    ["Secondary text", "#5F6B66", "#fff"],
    ["Success", "#146C32", "#fff"],
    ["Warning", "#8A5A00", "#fff"],
    ["Error", "#B42323", "#fff"],
  ];
  return (
    <Screen large title="Design System" back>
      <div className="alu-pad">
        <p className="alu-b">Aluvita uses sage, sand, and terracotta. Buttons and links use Primary Dark so text stays above WCAG AA. Sage is reserved for large fills and rings.</p>
        <h2 className="alu-t2">Color</h2>
        <div className="alu-doc-grid">
          {colors.map(([name, hex, ink]) => (
            <div key={name} className="alu-swatch" style={{ background: hex, color: ink }}>
              {name}<br />{hex}
            </div>
          ))}
        </div>
        <h2 className="alu-t2">Type</h2>
        <p className="alu-large" style={{ margin: 0 }}>Large Title</p>
        <p className="alu-t1">Title 1</p>
        <p className="alu-t2">Title 2</p>
        <p className="alu-h">Headline</p>
        <p className="alu-b">Body copy stays at 17pt and can grow with the text-size slider in Settings.</p>
        <p className="alu-c">Callout at 16pt.</p>
        <p className="alu-s">Subheadline at 15pt.</p>
        <p className="alu-f">Footnote at 13pt. Secondary text does not go smaller than this.</p>
        <h2 className="alu-t2">Buttons</h2>
        <div style={{ display: "grid", gap: 8 }}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="text">Text button</Button>
          <Button variant="apple">Continue with Apple</Button>
        </div>
        <h2 className="alu-t2">Field</h2>
        <TextField label="Email" value="sara.alvarez@email.com" onChange={() => undefined} helper="Helper text sits under the field." />
        <TextField label="Password" value="" onChange={() => undefined} error="Passwords do not match." />
        <h2 className="alu-t2">Status</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Badge status="Confirmed" />
          <Badge status="Waitlisted" />
          <Badge status="Cancelled" />
          <Badge status="Completed" />
        </div>
        <h2 className="alu-t2">States</h2>
        <Button variant="secondary" onClick={() => { app.setSchedulePhase("error"); app.openTab("schedule"); }}>Preview schedule error</Button>
        <div style={{ height: 8 }} />
        <Button variant="secondary" onClick={() => app.push({ name: "payResult", ok: false })}>Preview payment failed</Button>
        <div style={{ height: 8 }} />
        <Button variant="secondary" onClick={() => { app.setBookingTab("waitlist"); app.openTab("bookings"); }}>Preview waitlist</Button>
        {session && (
          <div style={{ marginTop: 16 }}>
            <p className="alu-h">Class card</p>
          </div>
        )}
      </div>
      {session && (
        <div className="alu-hscroll">
          <button type="button" className="alu-class-card" onClick={() => app.push({ name: "class", sessionId: session.id })}>
            <div className="alu-class-photo"><img src={images[session.image]} alt="" /></div>
            <div className="alu-class-body"><strong>{session.name}</strong><span>{session.level}</span></div>
          </button>
        </div>
      )}
      <p className="alu-f alu-pad">Plans on file: {plans.map((plan) => plan.name).slice(0, 3).join(", ")}.</p>
    </Screen>
  );
}
