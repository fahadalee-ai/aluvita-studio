import { Badge, Button, CheckMark, Empty, Screen, Segmented, Stars, SwipeRow, Toggle } from "@/components/ios/ui";
import { formatDay, formatRange, formatTime, instructorById, isUpcoming } from "@/lib/data";
import { images } from "@/lib/images";
import { useApp } from "@/lib/store";

export function BookingsScreen() {
  const app = useApp();
  const upcoming = app.bookings.filter((b) => (b.status === "Confirmed") && isUpcoming(b));
  const past = app.bookings.filter((b) => b.status === "Completed" || b.status === "Missed" || b.status === "Cancelled" || (b.status === "Confirmed" && !isUpcoming(b)));
  const wait = app.bookings.filter((b) => b.status === "Waitlisted");
  const rows = app.bookingTab === "upcoming" ? upcoming : app.bookingTab === "past" ? past : wait;

  return (
    <Screen large title="My Bookings">
      <div className="alu-pad" style={{ marginBottom: 12 }}>
        <Segmented
          value={app.bookingTab}
          onChange={(id) => app.setBookingTab(id as "upcoming" | "past" | "waitlist")}
          options={[
            { id: "upcoming", label: "Upcoming" },
            { id: "past", label: "Past" },
            { id: "waitlist", label: "Waitlist" },
          ]}
        />
      </div>
      {!app.user && (
        <Empty title="Sign in to see bookings" body="Your reserved classes, waitlists, and history live with your account." action="Log In" onAction={() => app.setOverlay({ type: "auth" })} />
      )}
      {app.user && rows.length === 0 && (
        <Empty
          title={app.bookingTab === "upcoming" ? "No upcoming classes" : app.bookingTab === "past" ? "No past classes yet" : "You are not on a waitlist"}
          body="The schedule has room this week. Find a class that fits the day you actually have."
          action="Browse Classes"
          onAction={() => app.openTab("schedule")}
        />
      )}
      {app.user && rows.map((booking) => {
        const teacher = instructorById(booking.instructorId);
        if (app.bookingTab === "upcoming") {
          return (
            <SwipeRow
              key={booking.id}
              actions={[
                { label: "Calendar", tone: "ok", onClick: () => app.toast("Added to Calendar", booking.title) },
                { label: "Cancel", tone: "danger", onClick: () => app.setOverlay({ type: "cancel", bookingId: booking.id }) },
              ]}
            >
              <button type="button" className="alu-row" style={{ alignItems: "flex-start" }} onClick={() => booking.sessionId && app.push({ name: "class", sessionId: booking.sessionId })}>
                <img className="alu-avatar sm" src={images[booking.image]} alt="" style={{ width: 56, height: 56, borderRadius: 14 }} />
                <span className="alu-grow">
                  <span className="alu-h" style={{ display: "block" }}>{booking.title}</span>
                  <span className="alu-f" style={{ display: "block" }}>{formatDay(booking.date)} · {formatTime(booking.time)} · {booking.room}</span>
                  <span className="alu-f" style={{ display: "block" }}>{teacher.name}</span>
                </span>
                <Badge status="Confirmed" />
              </button>
            </SwipeRow>
          );
        }
        if (app.bookingTab === "waitlist") {
          return (
            <div key={booking.id} className="alu-inset" style={{ padding: 14 }}>
              {booking.spotOpened && <div className="alu-banner" style={{ margin: "0 0 10px" }}>A spot opened up!</div>}
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <strong className="alu-h">{booking.title}</strong>
                <Badge status="Waitlisted" />
              </div>
              <p className="alu-f">{formatDay(booking.date)} · {formatRange(booking.time, booking.duration)} · {teacher.name}</p>
              <p className="alu-h">You're #{booking.waitlistPos ?? 3}</p>
              <div className="alu-row" style={{ paddingInline: 0 }}>
                <span className="alu-grow">Auto-book when a spot opens</span>
                <Toggle label="Auto-book" on={Boolean(booking.autoBook)} onChange={(value) => app.setAutoBook(booking.id, value)} />
              </div>
              {booking.spotOpened && <Button onClick={() => app.claimSpot(booking.id)}>Book Now</Button>}
              <Button
                variant="text"
                onClick={() =>
                  app.setAlert({
                    title: "Leave the waitlist?",
                    message: "You will lose your place. You can join again if the class is still full.",
                    confirmLabel: "Leave",
                    destructive: true,
                    onConfirm: () => app.leaveWaitlist(booking.id),
                  })
                }
              >
                Leave Waitlist
              </Button>
            </div>
          );
        }
        return (
          <div key={booking.id} className="alu-inset" style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong className="alu-h">{booking.title}</strong>
              <Badge status={booking.status === "Confirmed" ? "Completed" : booking.status} />
            </div>
            <p className="alu-f">{formatDay(booking.date)} · {teacher.name}</p>
            {booking.status !== "Cancelled" && (
              <Stars value={booking.rating ?? 0} onChange={(value) => app.rate(booking.id, value)} />
            )}
            <Button
              variant="secondary"
              onClick={() => {
                const next = app.sessions.find((s) => s.slug === booking.slug && s.date >= dateKeySafe());
                if (next) app.push({ name: "class", sessionId: next.id });
                else app.openTab("schedule");
              }}
            >
              Book Again
            </Button>
          </div>
        );
      })}
    </Screen>
  );
}

function dateKeySafe() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function BookedScreen({ bookingId }: { bookingId: string }) {
  const app = useApp();
  const booking = app.bookings.find((b) => b.id === bookingId);
  if (!booking) return <Screen title="Booking" back><Empty title="Booking not found" body="It may have been removed." /></Screen>;
  return (
    <Screen title="You're booked" back>
      <div className="alu-pad" style={{ textAlign: "center", paddingTop: 24 }}>
        <CheckMark />
        <h1 className="alu-t1">You're booked</h1>
        <p className="alu-c" style={{ color: "var(--muted)" }}>{booking.title} with {booking.instructorName || instructorById(booking.instructorId).name}</p>
        <div className="alu-card" style={{ textAlign: "left", padding: 16, marginTop: 8 }}>
          <div className="alu-kv"><span>When</span><b>{formatDay(booking.date)} · {formatTime(booking.time)}</b></div>
          <div className="alu-kv"><span>Where</span><b>{booking.room}</b></div>
          <div className="alu-kv"><span>Booking ID</span><b>{booking.code}</b></div>
          <div className="alu-kv"><span>Paid with</span><b>{booking.payment === "credit" ? "Membership credit" : booking.payment === "pass" ? "Class pass" : "Card"}</b></div>
        </div>
        <div style={{ textAlign: "left", marginTop: 16 }}>
          <p className="alu-h">Set reminder</p>
          <Segmented
            value={booking.reminder ?? "1h"}
            onChange={(id) => app.setReminder(booking.id, id as "1h" | "3h" | "1d")}
            options={[
              { id: "1h", label: "1 hour" },
              { id: "3h", label: "3 hours" },
              { id: "1d", label: "1 day" },
            ]}
          />
        </div>
        <div style={{ height: 16 }} />
        <Button onClick={() => app.toast("Added to Calendar")}>Add to Calendar</Button>
        <div style={{ height: 8 }} />
        <Button variant="secondary" onClick={() => { app.setBookingTab("upcoming"); app.openTab("bookings"); }}>View My Bookings</Button>
      </div>
    </Screen>
  );
}
