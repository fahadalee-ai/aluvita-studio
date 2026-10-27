import { Heart, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  Chip,
  Empty,
  FilterButton,
  IconButton,
  Screen,
  SearchBar,
  Segmented,
} from "@/components/ios/ui";
import {
  addDays,
  classCopy,
  classFilters,
  dateKey,
  formatDay,
  formatFull,
  formatRange,
  formatTime,
  instructorById,
  instructors,
  money,
  parseKey,
  type Session,
} from "@/lib/data";
import { images } from "@/lib/images";
import { useApp } from "@/lib/store";

let warmed = false;

export function ScheduleScreen() {
  const app = useApp();
  const anchor = parseKey(app.selectedDate);
  const weekStart = addDays(anchor, -anchor.getDay());
  const days = Array.from({ length: app.scheduleView === "week" ? 7 : 14 }, (_, i) =>
    addDays(app.scheduleView === "week" ? weekStart : new Date(), i),
  );

  useEffect(() => {
    if (warmed || app.schedulePhase !== "ready") return;
    warmed = true;
    app.refreshSchedule();
    // Run once when the schedule is first opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const list = app.sessions
    .filter((s) => s.date === app.selectedDate)
    .filter((s) => matches(s, app.filters))
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <Screen large title="Schedule" onRefresh={app.refreshSchedule} trailing={<FilterButton />}>
      <SearchBar value={app.filters.query} onChange={(query) => app.setFilters({ ...app.filters, query })} placeholder="Search classes or teachers" />
      <div className="alu-pad" style={{ marginBottom: 12 }}>
        <Segmented
          value={app.scheduleView}
          onChange={(id) => app.setScheduleView(id as "day" | "week")}
          options={[
            { id: "day", label: "Day" },
            { id: "week", label: "Week" },
          ]}
        />
      </div>
      <div className="alu-chip-row">
        {classFilters.map((chip) => (
          <Chip key={chip} selected={app.filters.category === chip} onClick={() => app.setFilters({ ...app.filters, category: chip })}>
            {chip}
          </Chip>
        ))}
        <Chip onClick={() => app.setOverlay({ type: "filters" })}>Filters</Chip>
      </div>
      {app.scheduleView === "week" ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px" }}>
            <Button variant="text" onClick={() => app.setSelectedDate(dateKey(addDays(weekStart, -7)))}>Prev</Button>
            <Button variant="text" onClick={() => app.setSelectedDate(dateKey(addDays(weekStart, 7)))}>Next</Button>
          </div>
          <div className="alu-week">
            {days.map((day) => {
              const key = dateKey(day);
              const count = app.sessions.filter((s) => s.date === key && matches(s, app.filters)).length;
              return (
                <button key={key} type="button" className={key === app.selectedDate ? "on" : ""} onClick={() => app.setSelectedDate(key)}>
                  <small className="alu-f" style={{ color: "inherit" }}>{day.toLocaleDateString("en-US", { weekday: "narrow" })}</small>
                  <b>{day.getDate()}</b>
                  <span className="dots">{Array.from({ length: Math.min(3, count) }).map((_, i) => <i key={i} />)}</span>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="alu-dates">
          {days.map((day) => {
            const key = dateKey(day);
            const today = dateKey(new Date());
            return (
              <button key={key} type="button" className={`alu-date ${key === app.selectedDate ? "on" : ""}`} onClick={() => app.setSelectedDate(key)}>
                <small>{key === today ? "Today" : day.toLocaleDateString("en-US", { weekday: "short" })}</small>
                <b>{day.getDate()}</b>
              </button>
            );
          })}
        </div>
      )}

      {app.schedulePhase === "loading" && (
        <div className="alu-pad" style={{ display: "grid", gap: 10 }}>
          <div className="alu-skel" style={{ height: 84 }} />
          <div className="alu-skel" style={{ height: 84 }} />
          <div className="alu-skel" style={{ height: 84 }} />
        </div>
      )}
      {app.schedulePhase === "error" && (
        <Empty
          title="Couldn't load the schedule"
          body="Check your connection and try again. The studio is still open if you are nearby."
          action="Try Again"
          onAction={app.refreshSchedule}
        />
      )}
      {app.schedulePhase === "ready" && list.length === 0 && (
        <Empty title="No classes match your filters" body="Try another day, or clear the filters to see the full room." action="Reset" onAction={app.resetFilters} />
      )}
      {app.schedulePhase === "ready" && list.length > 0 && (
        <div className="alu-inset">
          {list.map((session) => (
            <ClassRow key={session.id} session={session} />
          ))}
        </div>
      )}
    </Screen>
  );
}

function matches(session: Session, filters: { category: string; level: string; instructorId: string; time: string; duration: string; availableOnly: boolean; query: string }) {
  if (filters.category !== "All" && session.category !== filters.category) return false;
  if (filters.level !== "Any" && session.level !== filters.level && session.level !== "All Levels") return false;
  if (filters.instructorId !== "any" && session.instructorId !== filters.instructorId) return false;
  if (filters.duration !== "Any" && session.duration !== Number(filters.duration)) return false;
  if (filters.availableOnly && session.spots <= 0) return false;
  const hour = Number(session.time.slice(0, 2));
  if (filters.time === "Morning" && hour >= 12) return false;
  if (filters.time === "Afternoon" && (hour < 12 || hour >= 17)) return false;
  if (filters.time === "Evening" && hour < 17) return false;
  if (filters.query) {
    const teacher = instructorById(session.instructorId).name;
    const blob = `${session.name} ${session.category} ${teacher}`.toLowerCase();
    if (!blob.includes(filters.query.toLowerCase())) return false;
  }
  return true;
}

function ClassRow({ session }: { session: Session }) {
  const app = useApp();
  const teacher = instructorById(session.instructorId);
  const hold = useRef<number | null>(null);
  const full = session.spots <= 0;
  return (
    <button
      type="button"
      className="alu-class-row"
      onClick={() => app.push({ name: "class", sessionId: session.id })}
      onContextMenu={(e) => {
        e.preventDefault();
        const hostEl = e.currentTarget.closest(".alu") as HTMLElement;
        const host = hostEl.getBoundingClientRect();
        const scale = host.width / hostEl.offsetWidth || 1;
        app.setMenu({ sessionId: session.id, x: (e.clientX - host.left) / scale, y: (e.clientY - host.top) / scale });
      }}
      onPointerDown={(e) => {
        const hostEl = e.currentTarget.closest(".alu") as HTMLElement;
        const host = hostEl.getBoundingClientRect();
        const scale = host.width / hostEl.offsetWidth || 1;
        const x = (e.clientX - host.left) / scale;
        const y = (e.clientY - host.top) / scale;
        hold.current = window.setTimeout(() => app.setMenu({ sessionId: session.id, x, y }), 480);
      }}
      onPointerUp={() => hold.current && window.clearTimeout(hold.current)}
      onPointerLeave={() => hold.current && window.clearTimeout(hold.current)}
    >
      <span>
        <span className="alu-h" style={{ display: "block" }}>{formatTime(session.time)}</span>
        <span className="alu-f">{session.duration} min</span>
      </span>
      <span>
        <span className="alu-h" style={{ display: "block" }}>{session.name}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <img className="alu-avatar sm" src={images[teacher.image]} alt="" />
          <span className="alu-f" style={{ color: "var(--ink)" }}>{teacher.name}</span>
        </span>
        <span style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
          <Badge status={session.level} />
          <span className="alu-f" style={{ color: full ? "var(--warning)" : "var(--muted)", fontWeight: 600 }}>
            {full ? "Full – Waitlist" : `${session.spots} spots left`}
          </span>
        </span>
      </span>
    </button>
  );
}

export function ClassScreen({ sessionId }: { sessionId: string }) {
  const app = useApp();
  const session = app.sessions.find((s) => s.id === sessionId);
  if (!session) {
    return (
      <Screen title="Class" back>
        <Empty title="Class unavailable" body="This session is no longer on the schedule." action="Back to schedule" onAction={() => app.pop()} />
      </Screen>
    );
  }
  const teacher = instructorById(session.instructorId);
  const copy = classCopy(session.slug);
  const saved = app.saved.includes(session.slug);
  const full = session.spots <= 0;
  return (
    <Screen
      hero={images[session.image]}
      title={session.name}
      back
      trailing={
        <span style={{ display: "flex" }}>
          <IconButton label="Share" glass onClick={() => app.setOverlay({ type: "share", label: session.name })}>
            <Share2 size={18} />
          </IconButton>
          <IconButton
            label={saved ? "Remove favorite" : "Save class"}
            glass
            onClick={() => {
              app.toggleSaved(session.slug);
              app.toast(saved ? "Removed from favorites" : "Saved to favorites");
            }}
          >
            <Heart size={18} fill={saved ? "currentColor" : "none"} />
          </IconButton>
        </span>
      }
      footer={
        <>
          <Button
            onClick={() =>
              app.guard(() => {
                if (full) app.setOverlay({ type: "waitlist", sessionId });
                else app.setOverlay({ type: "book", sessionId, step: 1, pay: app.membership && app.membership.credits > 0 ? "credit" : app.membership && app.membership.passCredits > 0 ? "pass" : "card" });
              })
            }
          >
            {full ? "Join Waitlist" : "Book Class"}
          </Button>
          <Button variant="text" onClick={() => app.toast("Added to Calendar", `${session.name} · ${formatDay(session.date)}`)}>
            Add to Calendar
          </Button>
        </>
      }
    >
      <div className="alu-pad">
        <h1 className="alu-t1" style={{ margin: "8px 0 6px" }}>{session.name}</h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          <Badge status={session.level} />
          <Badge status={session.category} />
          <span className="alu-f">{session.duration} min</span>
        </div>
        <div className="alu-kv"><span>Date</span><b>{formatFull(session.date)}</b></div>
        <div className="alu-kv"><span>Time</span><b>{formatRange(session.time, session.duration)}</b></div>
        <div className="alu-kv"><span>Location</span><button type="button" className="alu-linkish" onClick={() => app.push({ name: "studio" })}>Studio {session.room}</button></div>
        <div className="alu-kv"><span>Spots</span><b>{full ? "Full – waitlist open" : `${session.spots} of ${session.capacity}`}</b></div>
        <div className="alu-kv"><span>Price</span><b>{session.credits} credit · {money(session.price)}</b></div>
        <h2 className="alu-t2">About this class</h2>
        <p className="alu-b" style={{ color: "var(--muted)" }}>{copy.description}</p>
        <h2 className="alu-t2">What to bring</h2>
        <ul className="alu-b" style={{ color: "var(--muted)", paddingLeft: 18 }}>
          {copy.bring.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <h2 className="alu-t2">Benefits</h2>
        <ul className="alu-b" style={{ color: "var(--muted)", paddingLeft: 18 }}>
          {copy.benefits.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <h2 className="alu-t2">Instructor</h2>
      </div>
      <button type="button" className="alu-inset" style={{ display: "flex", gap: 12, padding: 12, color: "inherit", textAlign: "left" }} onClick={() => app.push({ name: "instructor", instructorId: teacher.id })}>
        <img className="alu-avatar" src={images[teacher.image]} alt="" style={{ width: 64, height: 64 }} />
        <span>
          <strong className="alu-h">{teacher.name}</strong>
          <span className="alu-f" style={{ display: "block" }}>{teacher.focus} · {teacher.rating.toFixed(1)} · {teacher.reviews} reviews</span>
          <span className="alu-s" style={{ display: "block", marginTop: 4 }}>{teacher.short}</span>
        </span>
      </button>
    </Screen>
  );
}

export function InstructorScreen({ instructorId }: { instructorId: string }) {
  const app = useApp();
  const teacher = instructors.find((i) => i.id === instructorId) ?? instructors[0];
  const classes = app.sessions.filter((s) => s.instructorId === teacher.id && s.date >= dateKey(new Date())).slice(0, 4);
  return (
    <Screen hero={images[teacher.image]} title={teacher.name} back>
      <div className="alu-pad">
        <h1 className="alu-t1" style={{ marginBottom: 4 }}>{teacher.name}</h1>
        <p className="alu-f">{teacher.focus} · {teacher.rating.toFixed(1)} from {teacher.reviews} reviews</p>
        <p className="alu-b">{teacher.bio}</p>
        <h2 className="alu-t2">Specialties</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {teacher.specialties.map((item) => <span key={item} className="alu-badge">{item}</span>)}
        </div>
        <h2 className="alu-t2">Certifications</h2>
        <ul className="alu-b">
          {teacher.certifications.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <h2 className="alu-t2">Upcoming classes</h2>
      </div>
      <div className="alu-inset">
        {classes.map((session) => (
          <button key={session.id} type="button" className="alu-row" onClick={() => app.push({ name: "class", sessionId: session.id })}>
            <span className="alu-grow">
              <span className="alu-h" style={{ display: "block" }}>{session.name}</span>
              <span className="alu-f">{formatDay(session.date)} · {formatTime(session.time)}</span>
            </span>
          </button>
        ))}
        {classes.length === 0 && <p className="alu-f" style={{ padding: 16 }}>No upcoming classes this week.</p>}
      </div>
    </Screen>
  );
}
