import { useState, type ReactNode } from "react";
import { Button, Segmented, Toggle } from "@/components/ios/ui";
import { instructorById, instructors, legalDocs, money } from "@/lib/data";
import { useApp } from "@/lib/store";

export function Overlays() {
  const app = useApp();
  const overlay = app.overlay;
  return (
    <>
      {overlay && <button type="button" className="alu-backdrop" aria-label="Dismiss" onClick={() => app.setOverlay(null)} />}
      {overlay?.type === "filters" && <FilterSheet />}
      {overlay?.type === "book" && <BookSheet sessionId={overlay.sessionId} step={overlay.step} pay={overlay.pay} />}
      {overlay?.type === "waitlist" && <WaitlistSheet sessionId={overlay.sessionId} />}
      {overlay?.type === "auth" && <AuthSheet />}
      {overlay?.type === "cancel" && <CancelSheet bookingId={overlay.bookingId} />}
      {overlay?.type === "logout" && (
        <ActionList
          message="You can sign back in any time. Your preview account stays on this device."
          actions={[
            { label: "Log Out", danger: true, onClick: () => app.logout() },
            { label: "Cancel", onClick: () => app.setOverlay(null) },
          ]}
        />
      )}
      {overlay?.type === "photo" && (
        <ActionList
          message="Profile photo"
          actions={[
            { label: "Take Photo", onClick: () => { app.updateUser({ avatar: undefined }); app.setOverlay(null); app.toast("Photo updated"); } },
            { label: "Choose Photo", onClick: () => document.getElementById("alu-photo")?.click() },
            { label: "Cancel", onClick: () => app.setOverlay(null) },
          ]}
        />
      )}
      {overlay?.type === "share" && (
        <ActionList
          message={overlay.label}
          actions={[
            { label: "Messages", onClick: () => { app.setOverlay(null); app.toast("Shared"); } },
            { label: "Mail", onClick: () => { app.setOverlay(null); app.toast("Draft started"); } },
            { label: "Copy Link", onClick: () => { app.setOverlay(null); app.toast("Link copied"); } },
            { label: "Cancel", onClick: () => app.setOverlay(null) },
          ]}
        />
      )}
      {overlay?.type === "freeze" && <FreezeSheet />}
      {overlay?.type === "cancelPlan" && <CancelPlanSheet />}
      {overlay?.type === "legal" && <LegalSheet doc={overlay.doc} />}
      {app.alert && (
        <div className="alu-alert-wrap">
          <div className="alu-alert" role="alertdialog" aria-modal="true">
            <h3>{app.alert.title}</h3>
            <p>{app.alert.message}</p>
            <div className="alu-alert-acts">
              {app.alert.cancelLabel !== undefined && (
                <button type="button" onClick={() => app.setAlert(null)}>{app.alert.cancelLabel}</button>
              )}
              <button type="button" className={app.alert.destructive ? "danger" : ""} onClick={app.alert.onConfirm}>
                {app.alert.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
      {app.menu && <ContextMenu />}
      <input
        id="alu-photo"
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            app.updateUser({ avatar: String(reader.result) });
            app.setOverlay(null);
            app.toast("Photo updated");
          };
          reader.readAsDataURL(file);
        }}
      />
      {app.toasts.length > 0 && (
        <div className="alu-toasts">
          {app.toasts.map((toast) => (
            <button key={toast.id} type="button" className="alu-toast" onClick={() => app.dismissToast(toast.id)}>
              <strong className="alu-h">{toast.title}</strong>
              {toast.body && <div className="alu-f">{toast.body}</div>}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function Sheet({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="alu-sheet" role="dialog" aria-label={title}>
      <div className="alu-grab" />
      <div className="alu-sheet-body">
        <h2 className="alu-t2" style={{ marginTop: 4 }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

function ActionList({ message, actions }: { message?: string; actions: { label: string; danger?: boolean; onClick: () => void }[] }) {
  const last = actions[actions.length - 1];
  const rest = actions.slice(0, -1);
  return (
    <div className="alu-actions">
      <div className="alu-action-group">
        {message && <p className="alu-f" style={{ textAlign: "center", padding: "12px 16px 0" }}>{message}</p>}
        {rest.map((action) => (
          <button key={action.label} type="button" className={action.danger ? "danger" : ""} onClick={action.onClick}>{action.label}</button>
        ))}
      </div>
      {last && (
        <div className="alu-action-group">
          <button type="button" onClick={last.onClick}><strong>{last.label}</strong></button>
        </div>
      )}
    </div>
  );
}

function FilterSheet() {
  const app = useApp();
  const f = app.filters;
  const set = (patch: Partial<typeof f>) => app.setFilters({ ...f, ...patch });
  return (
    <Sheet title="Filters">
      <p className="alu-label">Level</p>
      <Segmented
        value={f.level}
        onChange={(level) => set({ level })}
        options={["Any", "Beginner", "Intermediate", "Advanced"].map((id) => ({ id, label: id }))}
      />
      <p className="alu-label">Time of day</p>
      <Segmented
        value={f.time}
        onChange={(time) => set({ time })}
        options={["Any", "Morning", "Afternoon", "Evening"].map((id) => ({ id, label: id }))}
      />
      <p className="alu-label">Duration</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0" }}>
        {["Any", "30", "45", "60", "75"].map((id) => (
          <button key={id} type="button" className={`alu-chip ${f.duration === id ? "on" : ""}`} onClick={() => set({ duration: id })}>
            {id === "Any" ? "Any" : `${id} min`}
          </button>
        ))}
      </div>
      <p className="alu-label">Instructor</p>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
        <button type="button" className={`alu-chip ${f.instructorId === "any" ? "on" : ""}`} onClick={() => set({ instructorId: "any" })}>Any</button>
        {instructors.map((teacher) => (
          <button key={teacher.id} type="button" className={`alu-chip ${f.instructorId === teacher.id ? "on" : ""}`} onClick={() => set({ instructorId: teacher.id })}>
            {teacher.name.split(" ")[0]}
          </button>
        ))}
      </div>
      <div className="alu-row" style={{ paddingInline: 0 }}>
        <span className="alu-grow">Available only</span>
        <Toggle label="Available only" on={f.availableOnly} onChange={(availableOnly) => set({ availableOnly })} />
      </div>
      <Button onClick={() => app.setOverlay(null)}>Apply</Button>
      <Button variant="text" onClick={() => { app.resetFilters(); app.setOverlay(null); }}>Reset</Button>
    </Sheet>
  );
}

function BookSheet({ sessionId, step, pay }: { sessionId: string; step: 1 | 2; pay: "credit" | "pass" | "card" }) {
  const app = useApp();
  const session = app.sessions.find((s) => s.id === sessionId);
  if (!session) return null;
  const teacher = instructorById(session.instructorId);
  const options = [
    { id: "credit" as const, title: "Membership credit", detail: app.membership ? `${app.membership.credits} credits left` : "No membership", disabled: !app.membership || app.membership.credits <= 0 },
    { id: "pass" as const, title: "Class pass", detail: app.membership ? `${app.membership.passName} · ${app.membership.passCredits} left` : "No pass", disabled: !app.membership || app.membership.passCredits <= 0 },
    { id: "card" as const, title: "Pay single class", detail: money(session.price), disabled: false },
  ];
  return (
    <Sheet title={step === 1 ? "Review booking" : "Confirm"}>
      <p className="alu-h" style={{ marginTop: 0 }}>{session.name}</p>
      <p className="alu-f">{teacher.name} · {session.room} · {session.duration} min</p>
      {step === 1 && options.map((option) => (
        <button key={option.id} type="button" disabled={option.disabled} className={`alu-radio ${pay === option.id ? "on" : ""}`} onClick={() => app.setOverlay({ type: "book", sessionId, step: 1, pay: option.id })}>
          <span className="alu-grow">
            <strong className="alu-h">{option.title}</strong>
            <span className="alu-f" style={{ display: "block" }}>{option.detail}</span>
          </span>
        </button>
      ))}
      {step === 2 && (
        <div className="alu-card" style={{ padding: 14 }}>
          <div className="alu-kv"><span>Class</span><b>{session.name}</b></div>
          <div className="alu-kv"><span>Payment</span><b>{pay === "credit" ? "1 credit" : pay === "pass" ? "1 pass credit" : money(session.price)}</b></div>
          <div className="alu-kv"><span>After booking</span><b>{pay === "credit" && app.membership ? `${app.membership.credits - 1} credits left` : pay === "pass" && app.membership ? `${app.membership.passCredits - 1} pass credits` : "Charged today"}</b></div>
        </div>
      )}
      <Button
        onClick={() => {
          if (step === 1) app.setOverlay({ type: "book", sessionId, step: 2, pay });
          else app.book(sessionId, pay);
        }}
      >
        {step === 1 ? "Continue" : "Confirm Booking"}
      </Button>
    </Sheet>
  );
}

function WaitlistSheet({ sessionId }: { sessionId: string }) {
  const app = useApp();
  const session = app.sessions.find((s) => s.id === sessionId);
  const [auto, setAuto] = useState(true);
  if (!session) return null;
  return (
    <Sheet title="Join waitlist">
      <p className="alu-b">{session.name} is full. You'll be #3.</p>
      <div className="alu-row" style={{ paddingInline: 0 }}>
        <span className="alu-grow">Auto-book when a spot opens</span>
        <Toggle label="Auto-book" on={auto} onChange={setAuto} />
      </div>
      <Button onClick={() => app.joinWaitlist(sessionId, auto)}>Join Waitlist</Button>
    </Sheet>
  );
}

function AuthSheet() {
  const app = useApp();
  return (
    <Sheet title="Sign in to book">
      <p className="alu-c">Create a free account or log in to reserve your spot.</p>
      <Button onClick={() => { app.setOverlay(null); app.push({ name: "login" }); }}>Log In</Button>
      <div style={{ height: 8 }} />
      <Button variant="secondary" onClick={() => { app.setOverlay(null); app.push({ name: "register" }); }}>Create Account</Button>
      <Button variant="text" onClick={() => app.setOverlay(null)}>Continue browsing</Button>
    </Sheet>
  );
}

function CancelSheet({ bookingId }: { bookingId: string }) {
  const app = useApp();
  return (
    <ActionList
      message="Free cancellation up to 6 hours before class. Your credit comes back to the plan you used."
      actions={[
        {
          label: "Cancel Class",
          danger: true,
          onClick: () =>
            app.setAlert({
              title: "Cancel this class?",
              message: "Your credit will be returned if you paid with a membership or pass.",
              confirmLabel: "Cancel Class",
              cancelLabel: "Keep",
              destructive: true,
              onConfirm: () => app.cancelBooking(bookingId),
            }),
        },
        { label: "Keep Booking", onClick: () => app.setOverlay(null) },
      ]}
    />
  );
}

function FreezeSheet() {
  const app = useApp();
  return (
    <Sheet title="Freeze membership">
      <p className="alu-b">You can pause billing once a year for up to 30 days. Your renewal date moves with the freeze, and credits stay where they are.</p>
      <Button onClick={() => app.freezeMembership()}>Freeze for 30 days</Button>
      <Button variant="text" onClick={() => app.setOverlay(null)}>Not now</Button>
    </Sheet>
  );
}

function CancelPlanSheet() {
  const app = useApp();
  return (
    <Sheet title="Cancel membership">
      <p className="alu-b">Your plan stays active until {app.membership?.renews}. After that, unused monthly credits expire. Class-pack credits stay until their own date.</p>
      <Button
        variant="destructive"
        onClick={() =>
          app.setAlert({
            title: "Cancel membership?",
            message: `You can keep coming through ${app.membership?.renews ?? "the renewal date"}.`,
            confirmLabel: "Confirm Cancel",
            cancelLabel: "Keep Plan",
            destructive: true,
            onConfirm: () => app.cancelMembership(),
          })
        }
      >
        Continue
      </Button>
    </Sheet>
  );
}

function LegalSheet({ doc }: { doc: "terms" | "privacy" }) {
  const page = legalDocs[doc];
  return (
    <Sheet title={page.title}>
      {page.body.slice(0, 3).map((paragraph) => <p key={paragraph} className="alu-c">{paragraph}</p>)}
    </Sheet>
  );
}

function ContextMenu() {
  const app = useApp();
  const menu = app.menu;
  if (!menu) return null;
  const session = app.sessions.find((s) => s.id === menu.sessionId);
  if (!session) return null;
  const saved = app.saved.includes(session.slug);
  const close = () => app.setMenu(null);
  return (
    <div className="alu-menu" style={{ left: Math.min(menu.x, 170), top: Math.min(menu.y, 620) }}>
      <button type="button" onClick={() => { close(); app.push({ name: "class", sessionId: session.id }); }}>View Details</button>
      <button
        type="button"
        onClick={() => {
          close();
          app.guard(() => {
            if (session.spots <= 0) app.setOverlay({ type: "waitlist", sessionId: session.id });
            else app.setOverlay({ type: "book", sessionId: session.id, step: 1, pay: "credit" });
          });
        }}
      >
        {session.spots <= 0 ? "Join Waitlist" : "Book"}
      </button>
      <button type="button" onClick={() => { close(); app.setOverlay({ type: "share", label: session.name }); }}>Share</button>
      <button type="button" onClick={() => { close(); app.toggleSaved(session.slug); app.toast(saved ? "Removed" : "Saved"); }}>{saved ? "Unfavorite" : "Favorite"}</button>
    </div>
  );
}
