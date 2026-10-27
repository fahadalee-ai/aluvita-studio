import {
  Bell,
  Bookmark,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  Eye,
  EyeOff,
  House,
  Search,
  SlidersHorizontal,
  Star,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  formatDay,
  formatTime,
  instructorById,
  type BookingStatus,
  type Session,
} from "@/lib/data";
import { images } from "@/lib/images";
import { useApp, type TabId } from "@/lib/store";

export function IconButton({
  label,
  onClick,
  children,
  glass,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
  glass?: boolean;
}) {
  return (
    <button type="button" className={`alu-icon-btn ${glass ? "glass" : ""}`} aria-label={label} onClick={onClick}>
      {children}
    </button>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
  inline,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "text" | "destructive" | "apple" | "google";
  disabled?: boolean;
  type?: "button" | "submit";
  inline?: boolean;
}) {
  return (
    <button type={type} className={`alu-btn ${variant} ${inline ? "inline" : ""}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  helper,
  multiline,
  trailing,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  helper?: string;
  multiline?: boolean;
  trailing?: ReactNode;
}) {
  const [show, setShow] = useState(false);
  const secret = type === "password";
  return (
    <label className="alu-field">
      <span className="alu-label">{label}</span>
      <span className={secret || trailing ? "alu-input-wrap" : undefined}>
        {multiline ? (
          <textarea className={`alu-textarea ${error ? "bad" : ""}`} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input
            className={`alu-input ${error ? "bad" : ""}`}
            value={value}
            type={secret && show ? "text" : type}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        {secret && (
          <button type="button" className="alu-icon-btn" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((v) => !v)}>
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {trailing}
      </span>
      {error ? <span className="alu-error">{error}</span> : helper ? <span className="alu-help">{helper}</span> : null}
    </label>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="alu-pad" style={{ marginBottom: 12 }}>
      <div className="alu-input-wrap">
        <Search size={18} style={{ position: "absolute", left: 12, top: 15, color: "var(--muted)" }} />
        <input
          className="alu-input"
          style={{ paddingLeft: 38 }}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-label={placeholder}
        />
        {value && (
          <button type="button" className="alu-icon-btn" aria-label="Clear search" onClick={() => onChange("")}>
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export function Segmented({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="alu-seg" role="tablist">
      {options.map((option) => (
        <button key={option.id} type="button" role="tab" aria-selected={value === option.id} className={value === option.id ? "on" : ""} onClick={() => onChange(option.id)}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Chip({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" className={`alu-chip ${selected ? "on" : ""}`} aria-pressed={selected} onClick={onClick}>
      {children}
    </button>
  );
}

const badgeTone: Record<BookingStatus | "Active" | "Frozen" | "Cancels" | "Paid" | "Refunded" | "Failed" | "Missed", string> = {
  Confirmed: "ok",
  Completed: "done",
  Waitlisted: "wait",
  Cancelled: "bad",
  Missed: "bad",
  Active: "ok",
  Frozen: "wait",
  Cancels: "bad",
  Paid: "ok",
  Refunded: "wait",
  Failed: "bad",
};

export function Badge({ status }: { status: string }) {
  const tone = badgeTone[status as keyof typeof badgeTone] ?? "";
  return <span className={`alu-badge ${tone}`}>{status}</span>;
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (value: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className={`alu-switch ${on ? "on" : ""}`} onClick={() => onChange(!on)}>
      <i />
    </button>
  );
}

export function ToggleRow({
  title,
  subtitle,
  on,
  onChange,
}: {
  title: string;
  subtitle?: string;
  on: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="alu-row">
      <span className="alu-grow">
        <span className="alu-h" style={{ display: "block" }}>{title}</span>
        {subtitle && <span className="alu-f">{subtitle}</span>}
      </span>
      <Toggle on={on} onChange={onChange} label={title} />
    </div>
  );
}

export function Section({ children }: { children: ReactNode }) {
  return <div className="alu-section">{children}</div>;
}

export function Group({ children }: { children: ReactNode }) {
  return <div className="alu-inset">{children}</div>;
}

export function Row({
  title,
  subtitle,
  icon,
  trailing,
  onClick,
  destructive,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  destructive?: boolean;
}) {
  return (
    <button type="button" className="alu-row" onClick={onClick}>
      {icon}
      <span className="alu-grow">
        <span className="alu-h" style={{ display: "block", color: destructive ? "var(--danger)" : undefined }}>{title}</span>
        {subtitle && <span className="alu-f">{subtitle}</span>}
      </span>
      {trailing ?? (onClick ? <ChevronRight size={18} color="var(--muted)" /> : null)}
    </button>
  );
}

export function Empty({
  title,
  body,
  action,
  onAction,
}: {
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="alu-empty">
      <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
        <rect x="10" y="28" width="52" height="28" rx="8" fill="var(--fill)" />
        <path d="M16 28c4-12 36-12 40 0" fill="none" stroke="var(--btn)" strokeWidth="2" />
        <circle cx="50" cy="18" r="6" fill="var(--accent)" />
      </svg>
      <h3>{title}</h3>
      <p className="alu-f">{body}</p>
      {action && onAction && (
        <div style={{ marginTop: 12 }}>
          <Button onClick={onAction}>{action}</Button>
        </div>
      )}
    </div>
  );
}

export function ClassCard({ session, onClick }: { session: Session; onClick: () => void }) {
  const teacher = instructorById(session.instructorId);
  return (
    <button type="button" className="alu-class-card" onClick={onClick}>
      <div className="alu-class-photo">
        <img src={images[session.image]} alt="" />
        <span className="alu-badge">{session.level}</span>
      </div>
      <div className="alu-class-body">
        <strong>{session.name}</strong>
        <span>{teacher.name}</span>
        <span>
          {formatDay(session.date)} · {formatTime(session.time)}
        </span>
      </div>
    </button>
  );
}

export function CreditRing({ value, max }: { value: number; max: number | null }) {
  const pct = max && max > 0 ? Math.min(1, value / max) : 1;
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
      <circle cx="36" cy="36" r={r} stroke="var(--fill)" strokeWidth="6" fill="none" />
      <circle
        cx="36"
        cy="36"
        r={r}
        stroke="var(--primary)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${c * pct} ${c}`}
        transform="rotate(-90 36 36)"
      />
      <text x="36" y="40" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--ink)">
        {max === null ? "∞" : value}
      </text>
    </svg>
  );
}

export function Stars({ value, onChange }: { value: number; onChange?: (value: number) => void }) {
  return (
    <div className="alu-stars" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" className="alu-icon-btn" aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => onChange?.(n)}>
          <Star size={18} fill={n <= value ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  );
}

export function CheckMark() {
  return (
    <svg className="alu-mark" width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">
      <circle cx="42" cy="42" r="28" />
      <path d="M30 43 l8 8 16-18" />
    </svg>
  );
}

export function Wordmark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <p className={`alu-wordmark ${size}`}>
      Aluvita
      {size !== "sm" && <small>Studio</small>}
    </p>
  );
}

export function StatusBar({ light }: { light?: boolean }) {
  return (
    <>
      <div className="alu-island" />
      <div className={`alu-status ${light ? "light" : ""}`}>
        <span>9:41</span>
        <span className="alu-status-icons" aria-hidden="true">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
            <rect x="0" y="7" width="3" height="5" rx="0.5" />
            <rect x="4.5" y="5" width="3" height="7" rx="0.5" />
            <rect x="9" y="2.5" width="3" height="9.5" rx="0.5" />
            <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M1 4.5c4-3.5 10-3.5 14 0" />
            <path d="M3.5 7c2.6-2 6.4-2 9 0" />
            <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" />
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12">
            <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="currentColor" fill="none" />
            <rect x="2" y="2" width="14" height="8" rx="1" fill="currentColor" />
            <rect x="22.5" y="3.5" width="1.5" height="5" rx="0.5" fill="currentColor" />
          </svg>
        </span>
      </div>
    </>
  );
}

export function HomeIndicator() {
  return <div className="alu-home-ind" />;
}

const tabs: { id: TabId; label: string; icon: typeof House }[] = [
  { id: "home", label: "Home", icon: House },
  { id: "schedule", label: "Schedule", icon: CalendarDays },
  { id: "bookings", label: "Bookings", icon: Bookmark },
  { id: "memberships", label: "Memberships", icon: Wallet },
  { id: "profile", label: "Profile", icon: CircleUser },
];

export function TabBar() {
  const app = useApp();
  return (
    <nav className="alu-tabs" aria-label="Sections">
      {tabs.map((item) => {
        const Icon = item.icon;
        const on = app.tab === item.id && app.stack.at(-1)?.name === "tabs";
        return (
          <button key={item.id} type="button" className={`alu-tab ${on ? "on" : ""}`} onClick={() => app.openTab(item.id)}>
            <Icon size={22} strokeWidth={1.75} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

export function Screen({
  title,
  large,
  back,
  trailing,
  footer,
  onRefresh,
  hero,
  children,
}: {
  title?: string;
  large?: boolean;
  back?: boolean;
  trailing?: ReactNode;
  footer?: ReactNode;
  onRefresh?: () => void;
  hero?: string;
  children: ReactNode;
}) {
  const app = useApp();
  const scroller = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const [pull, setPull] = useState(0);
  const startY = useRef<number | null>(null);
  const pulled = useRef(0);
  const tabbed = app.stack.at(-1)?.name === "tabs" && !footer;
  const pad = footer ? 176 : tabbed ? 112 : 36;

  useEffect(() => {
    app.setChromeLight(Boolean(hero) && !compact);
  }, [hero, compact, app]);

  return (
    <div className="alu-fill">
      <header className={`alu-nav ${trailing && back ? "wide-trail" : ""} ${hero ? "overlay" : ""} ${!hero || compact ? "stuck" : ""} ${!back && trailing ? "wide-trail" : ""}`}>
        <div className="alu-nav-side">
          {back && (
            <IconButton label="Back" onClick={() => app.pop()} glass={Boolean(hero) && !compact}>
              <ChevronLeft size={26} strokeWidth={1.75} />
            </IconButton>
          )}
        </div>
        <div className="alu-nav-title" style={{ opacity: hero ? (compact ? 1 : 0) : !large || compact ? 1 : 0 }}>
          {title}
        </div>
        <div className="alu-nav-side right">{trailing}</div>
      </header>
      <div
        className="alu-scroll"
        ref={scroller}
        style={{ paddingBottom: pad, marginTop: hero ? -96 : 0 }}
        onScroll={(e) => setCompact(e.currentTarget.scrollTop > (hero ? 220 : 28))}
        onPointerDown={(e) => {
          if (scroller.current && scroller.current.scrollTop <= 0) startY.current = e.clientY;
        }}
        onPointerMove={(e) => {
          if (startY.current == null || !onRefresh) return;
          const dy = e.clientY - startY.current;
          if (dy > 8 && scroller.current && scroller.current.scrollTop <= 0) {
            pulled.current = Math.min(80, dy * 0.45);
            setPull(pulled.current);
          }
        }}
        onPointerUp={() => {
          if (pulled.current > 56) onRefresh?.();
          pulled.current = 0;
          setPull(0);
          startY.current = null;
        }}
      >
        {pull > 8 && <div className="alu-f" style={{ textAlign: "center", paddingTop: 8 }}>Release to refresh</div>}
        {hero && (
          <div className="alu-hero">
            <img src={hero} alt="" />
            <div className="alu-scrim" />
          </div>
        )}
        {large && title && <h1 className="alu-large">{title}</h1>}
        {children}
      </div>
      {footer && <div className="alu-dock">{footer}</div>}
    </div>
  );
}

export function BellButton() {
  const app = useApp();
  const count = app.notices.filter((n) => !n.read).length;
  return (
    <IconButton label="Notifications" onClick={() => (app.user ? app.push({ name: "notifications" }) : app.setOverlay({ type: "auth" }))}>
      <Bell size={22} strokeWidth={1.75} />
      {app.user && count > 0 && <span className="alu-badge-count">{count}</span>}
    </IconButton>
  );
}

export function FilterButton() {
  const app = useApp();
  const active = app.filters.level !== "Any" || app.filters.instructorId !== "any" || app.filters.time !== "Any" || app.filters.duration !== "Any" || app.filters.availableOnly;
  return (
    <IconButton label="Filters" onClick={() => app.setOverlay({ type: "filters" })}>
      <SlidersHorizontal size={18} />
      {active && <span className="alu-dot" style={{ position: "absolute", top: 10, right: 8 }} />}
    </IconButton>
  );
}

export function SwipeRow({
  children,
  actions,
}: {
  children: ReactNode;
  actions: { label: string; tone: "ok" | "danger"; onClick: () => void }[];
}) {
  const [x, setX] = useState(0);
  const start = useRef(0);
  const base = useRef(0);
  const width = actions.length * 88;
  return (
    <div className="alu-swipe">
      <div className="alu-swipe-actions">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className={action.tone}
            onClick={() => {
              setX(0);
              action.onClick();
            }}
          >
            {action.label}
          </button>
        ))}
      </div>
      <div
        className="alu-swipe-fore"
        style={{ transform: `translateX(${x}px)` }}
        onPointerDown={(e) => {
          start.current = e.clientX;
          base.current = x;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 0 && e.pointerType === "mouse" && !e.currentTarget.hasPointerCapture(e.pointerId)) return;
          const next = Math.min(0, Math.max(-width, base.current + (e.clientX - start.current)));
          setX(next);
        }}
        onPointerUp={() => setX((current) => (current < -width / 2 ? -width : 0))}
      >
        {children}
      </div>
    </div>
  );
}

export function Accordion({ items }: { items: { title: string; body: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Group>
      {items.map((item, index) => (
        <div key={item.title}>
          <button type="button" className="alu-row" aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)}>
            <span className="alu-grow alu-h">{item.title}</span>
            <ChevronRight size={18} style={{ transform: open === index ? "rotate(90deg)" : undefined }} />
          </button>
          {open === index && <p className="alu-c" style={{ margin: "0 16px 14px", color: "var(--muted)" }}>{item.body}</p>}
        </div>
      ))}
    </Group>
  );
}

export function MiniCalendar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const parsed = value ? value.split("-").map(Number) : [1994, 3, 12];
  const [cursor, setCursor] = useState(new Date(parsed[0] ?? 1994, (parsed[1] ?? 3) - 1, 1));
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const label = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <IconButton label="Previous month" onClick={() => setCursor(new Date(year, month - 1, 1))}>
          <ChevronLeft size={20} />
        </IconButton>
        <span className="alu-h">{label}</span>
        <IconButton label="Next month" onClick={() => setCursor(new Date(year, month + 1, 1))}>
          <ChevronRight size={20} />
        </IconButton>
      </div>
      <div className="alu-cal" aria-hidden="true">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={`${d}${i}`} className="alu-f" style={{ textAlign: "center" }}>{d}</span>
        ))}
      </div>
      <div className="alu-cal">
        {Array.from({ length: first }).map((_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          return (
            <button key={key} type="button" className={key === value ? "on" : ""} onClick={() => onChange(key)}>
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
