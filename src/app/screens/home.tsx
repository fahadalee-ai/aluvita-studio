import { BellButton, Button, ClassCard, CreditRing, Screen, Wordmark } from "@/components/ios/ui";
import {
  announcements,
  formatDay,
  formatRange,
  greeting,
  instructorById,
  isUpcoming,
  promos,
  startsIn,
  todayHours,
} from "@/lib/data";
import { images } from "@/lib/images";
import { useApp } from "@/lib/store";

export function HomeScreen() {
  const app = useApp();
  const name = app.user?.firstName;
  const upcoming = app.user
    ? app.bookings
        .filter((b) => b.status === "Confirmed" && isUpcoming(b))
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))[0]
    : undefined;
  const featured = app.sessions
    .filter((s) => isUpcoming(s))
    .filter((s, index, list) => list.findIndex((item) => item.slug === s.slug) === index)
    .slice(0, 6);

  return (
    <Screen
      large
      title={greeting(name)}
      trailing={
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Wordmark size="sm" />
          <BellButton />
        </span>
      }
    >
      <div className="alu-pad">
        <button type="button" className="alu-promo" style={{ width: "100%", height: 168 }} onClick={() => app.push({ name: "studio" })}>
          <img src={images.studio1} alt="" />
          <div className="alu-scrim" />
          <div className="alu-promo-copy">
            <strong>Aluvita Studio</strong>
            <span>Pacific Heights · Open today until {todayHours().split("–")[1]?.trim() || "evening"}</span>
          </div>
        </button>
      </div>
      <div className="alu-pad" style={{ margin: "14px 0" }}>
        <Button onClick={() => app.openTab("schedule")}>Book a Class</Button>
      </div>

      <div className="alu-section" style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Upcoming class</span>
      </div>
      {upcoming ? (
        <div className="alu-inset" style={{ padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <strong className="alu-h">{upcoming.title}</strong>
            <span className="alu-badge ok">{startsIn(upcoming.date, upcoming.time)}</span>
          </div>
          <p className="alu-s" style={{ margin: "6px 0", color: "var(--muted)" }}>
            {instructorById(upcoming.instructorId).name}
            <br />
            {formatDay(upcoming.date)} · {formatRange(upcoming.time, upcoming.duration)}
            <br />
            {upcoming.room}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              inline
              onClick={() => upcoming.sessionId && app.push({ name: "class", sessionId: upcoming.sessionId })}
            >
              View
            </Button>
            <Button inline variant="secondary" onClick={() => app.setOverlay({ type: "cancel", bookingId: upcoming.id })}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="alu-inset" style={{ padding: 16 }}>
          <p className="alu-h" style={{ margin: 0 }}>Nothing on the books</p>
          <p className="alu-f">When you reserve a class, the countdown will live here.</p>
        </div>
      )}

      <div className="alu-section">Membership</div>
      {app.user && app.membership ? (
        <button type="button" className="alu-inset" style={{ padding: 14, display: "flex", gap: 12, alignItems: "center", color: "inherit", textAlign: "left" }} onClick={() => app.push({ name: "membership" })}>
          <CreditRing value={app.membership.credits} max={app.membership.creditsTotal} />
          <span className="alu-grow">
            <strong className="alu-h">{app.membership.name}</strong>
            <span className="alu-f" style={{ display: "block" }}>
              {app.membership.creditsTotal === null ? "Unlimited visits" : `${app.membership.credits} credits left`}
            </span>
            <span className="alu-f">Renews {app.membership.renews}</span>
          </span>
          <span className="alu-linkish">Manage</span>
        </button>
      ) : (
        <div className="alu-inset" style={{ padding: 16 }}>
          <p className="alu-h" style={{ margin: 0 }}>No active membership</p>
          <p className="alu-f">A monthly plan or a class pack keeps a spot easier to hold.</p>
          <Button onClick={() => app.openTab("memberships")}>See plans</Button>
        </div>
      )}

      <div className="alu-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Featured classes</span>
        <button type="button" className="alu-linkish" onClick={() => app.openTab("schedule")}>See all</button>
      </div>
      <div className="alu-hscroll">
        {featured.map((session) => (
          <ClassCard key={session.id} session={session} onClick={() => app.push({ name: "class", sessionId: session.id })} />
        ))}
      </div>

      <div className="alu-section">Promotions</div>
      <div className="alu-hscroll">
        {promos.map((promo) => (
          <button
            key={promo.id}
            type="button"
            className="alu-promo"
            onClick={() => {
              if ("planId" in promo && promo.planId) app.push({ name: "plan", planId: promo.planId });
              else if ("code" in promo && promo.code) {
                app.toast("Code copied", promo.code);
                app.openTab("memberships");
              } else app.openTab("schedule");
            }}
          >
            <img src={images[promo.image]} alt="" />
            <div className="alu-scrim" />
            <div className="alu-promo-copy">
              <strong>{promo.title}</strong>
              <span>{promo.body}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="alu-section">Meet our instructors</div>
      <div className="alu-hscroll">
        {["sara", "daniel", "mei", "priya", "olivia", "liam"].map((id) => {
          const teacher = instructorById(id);
          return (
            <button key={id} type="button" className="alu-inst" onClick={() => app.push({ name: "instructor", instructorId: id })}>
              <img src={images[teacher.image]} alt="" />
              <span>{teacher.name.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      <div className="alu-section">Studio announcements</div>
      <div className="alu-inset">
        {announcements.map((item) => (
          <button key={item.id} type="button" className="alu-row" onClick={() => app.push({ name: "studio" })}>
            <span className="alu-grow">
              <span className="alu-h" style={{ display: "block" }}>{item.title}</span>
              <span className="alu-f">{item.body}</span>
            </span>
          </button>
        ))}
      </div>
      <div style={{ height: 8 }} />
    </Screen>
  );
}
