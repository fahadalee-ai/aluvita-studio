import { useState } from "react";
import { Badge, Button, CheckMark, CreditRing, Empty, Group, Row, Screen, Segmented, SwipeRow, TextField } from "@/components/ios/ui";
import { downloadPdf, money, plans, type PayCard } from "@/lib/data";
import { useApp } from "@/lib/store";

export function MembershipsScreen() {
  const app = useApp();
  const visible = plans.filter((plan) =>
    app.planTab === "membership" ? plan.group === "membership" : app.planTab === "packs" ? plan.group === "pack" : plan.group === "drop",
  );
  return (
    <Screen large title="Memberships">
      {app.user && app.membership && (
        <div className="alu-inset" style={{ padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
          <CreditRing value={app.membership.credits} max={app.membership.creditsTotal} />
          <div className="alu-grow">
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <strong className="alu-h">{app.membership.name}</strong>
              <Badge status={app.membership.status} />
            </div>
            <p className="alu-f" style={{ margin: "4px 0" }}>
              {app.membership.creditsTotal === null ? "Unlimited this month" : `${app.membership.credits} of ${app.membership.creditsTotal} credits`}
              {" · "}Renews {app.membership.renews}
            </p>
            <Button inline onClick={() => app.push({ name: "membership" })}>Manage</Button>
          </div>
        </div>
      )}
      <div className="alu-pad" style={{ margin: "8px 0 14px" }}>
        <Segmented
          value={app.planTab}
          onChange={(id) => app.setPlanTab(id as "membership" | "packs" | "drop")}
          options={[
            { id: "membership", label: "Memberships" },
            { id: "packs", label: "Class Packs" },
            { id: "drop", label: "Drop-In" },
          ]}
        />
      </div>
      <div className="alu-pad" style={{ display: "grid", gap: 12 }}>
        {visible.map((plan) => (
          <button key={plan.id} type="button" className="alu-card" style={{ padding: 16, textAlign: "left", color: "inherit" }} onClick={() => app.push({ name: "plan", planId: plan.id })}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <strong className="alu-t2">{plan.name}</strong>
              {plan.popular && <span className="alu-badge popular">Most Popular</span>}
            </div>
            <p className="alu-h" style={{ margin: "4px 0" }}>{money(plan.price)} <span className="alu-f">{plan.period}</span></p>
            <p className="alu-s" style={{ color: "var(--muted)" }}>{plan.blurb}</p>
            <ul className="alu-s" style={{ paddingLeft: 18, color: "var(--ink)" }}>
              {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
          </button>
        ))}
      </div>
    </Screen>
  );
}

export function PlanScreen({ planId }: { planId: string }) {
  const app = useApp();
  const plan = plans.find((item) => item.id === planId);
  if (!plan) return <Screen title="Plan" back><Empty title="Plan unavailable" body="Choose another plan from the list." /></Screen>;
  return (
    <Screen
      title={plan.name}
      back
      large
      footer={<Button onClick={() => app.guard(() => app.push({ name: "checkout", planId }))}>Purchase</Button>}
    >
      <div className="alu-pad">
        <p className="alu-t2" style={{ marginTop: 0 }}>{money(plan.price)} <span className="alu-f">{plan.period}</span></p>
        <p className="alu-b">{plan.blurb}</p>
        <h2 className="alu-h">Included</h2>
        <ul>{plan.features.map((feature) => <li key={feature} className="alu-b">{feature}</li>)}</ul>
        <h2 className="alu-h">Terms</h2>
        {plan.terms.map((term) => <p key={term} className="alu-c" style={{ color: "var(--muted)" }}>{term}</p>)}
      </div>
    </Screen>
  );
}

export function CheckoutScreen({ planId }: { planId: string }) {
  const app = useApp();
  const plan = plans.find((item) => item.id === planId);
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState("");
  const [promoError, setPromoError] = useState("");
  const [method, setMethod] = useState("Apple Pay");
  const [paying, setPaying] = useState(false);
  if (!plan) return null;
  const rate = applied === "WELCOME10" ? 0.9 : applied === "FRIEND20" ? 0.8 : 1;
  const total = Math.round(plan.price * rate);
  const submit = (chosen: string) => {
    setPaying(true);
    window.setTimeout(() => {
      setPaying(false);
      app.pay(plan.id, chosen, applied);
    }, 700);
  };
  return (
    <Screen title="Checkout" back footer={<Button disabled={paying} onClick={() => submit(method)}>{paying ? "Processing…" : `Pay ${money(total)}`}</Button>}>
      <div className="alu-pad">
        <div className="alu-card" style={{ padding: 16 }}>
          <div className="alu-kv"><span>Item</span><b>{plan.name}</b></div>
          <div className="alu-kv"><span>Price</span><b>{money(plan.price)}</b></div>
          <div className="alu-kv"><span>Promo</span><b>{applied ? `− ${money(plan.price - total)}` : "—"}</b></div>
          <div className="alu-kv"><span>Tax</span><b>$0</b></div>
          <div className="alu-kv"><span>Total</span><b>{money(total)}</b></div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginTop: 12 }}>
          <div style={{ flex: 1 }}>
            <TextField label="Promo code" value={promo} onChange={setPromo} error={promoError} helper="Try WELCOME10 or FRIEND20" />
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            const code = promo.trim().toUpperCase();
            if (code === "WELCOME10" || code === "FRIEND20" || code === "FAIL") {
              setApplied(code);
              setPromoError("");
              app.toast(code === "FAIL" ? "Code noted" : "Promo applied");
            } else setPromoError("That code is not active.");
          }}
        >
          Apply
        </Button>
        <h2 className="alu-h">Payment method</h2>
        <Button variant="apple" onClick={() => submit("Apple Pay")}>Pay with Apple Pay</Button>
        <div style={{ height: 10 }} />
        {app.cards.map((card) => {
          const label = `${card.brand} ••${card.last4}`;
          return (
            <button key={card.id} type="button" className={`alu-radio ${method === label ? "on" : ""}`} onClick={() => setMethod(label)}>
              <span className="alu-grow">
                <strong className="alu-h">{label}</strong>
                <span className="alu-f" style={{ display: "block" }}>Exp {card.exp}{card.declines ? " · Declined last time" : ""}{card.isDefault ? " · Default" : ""}</span>
              </span>
            </button>
          );
        })}
        <Button variant="text" onClick={() => app.push({ name: "addCard" })}>Add Payment Method</Button>
      </div>
    </Screen>
  );
}

export function PayResultScreen({ ok, purchaseId }: { ok: boolean; purchaseId?: string }) {
  const app = useApp();
  const purchase = app.purchases.find((item) => item.id === purchaseId);
  return (
    <Screen title={ok ? "Payment complete" : "Payment failed"}>
      <div className="alu-pad" style={{ textAlign: "center", paddingTop: 28 }}>
        {ok ? <CheckMark /> : <p className="alu-t1" style={{ color: "var(--danger)" }}>Not completed</p>}
        <h1 className="alu-t2">{ok ? "You're all set" : "The bank declined this payment"}</h1>
        <p className="alu-c" style={{ color: "var(--muted)" }}>
          {ok ? "A receipt is in Purchase History." : "Nothing was charged. Try another card or Apple Pay."}
        </p>
        {purchase && (
          <div className="alu-card" style={{ textAlign: "left", padding: 16 }}>
            <div className="alu-kv"><span>Item</span><b>{purchase.item}</b></div>
            <div className="alu-kv"><span>Amount</span><b>{money(purchase.amount)}</b></div>
            <div className="alu-kv"><span>Method</span><b>{purchase.method}</b></div>
          </div>
        )}
        <div style={{ height: 16 }} />
        {ok && purchase && <Button onClick={() => app.push({ name: "receipt", purchaseId: purchase.id })}>View Receipt</Button>}
        {!ok && <Button onClick={() => app.pop()}>Try Again</Button>}
        <div style={{ height: 8 }} />
        <Button variant="secondary" onClick={() => app.openTab("memberships")}>Done</Button>
      </div>
    </Screen>
  );
}

export function PaymentsScreen() {
  const app = useApp();
  return (
    <Screen large title="Payment Methods" back>
      <div className="alu-inset">
        {app.cards.length === 0 && <p className="alu-f" style={{ padding: 16 }}>No cards saved yet.</p>}
        {app.cards.map((card) => (
          <SwipeRow key={card.id} actions={[{ label: "Delete", tone: "danger", onClick: () => app.removeCard(card.id) }]}>
            <button type="button" className="alu-row" onClick={() => app.setDefaultCard(card.id)}>
              <CardBrand brand={card.brand} />
              <span className="alu-grow">
                <span className="alu-h" style={{ display: "block" }}>{card.brand} ••{card.last4}</span>
                <span className="alu-f">Expires {card.exp}</span>
              </span>
              {card.isDefault && <Badge status="Active" />}
            </button>
          </SwipeRow>
        ))}
      </div>
      <div className="alu-pad">
        <Button onClick={() => app.push({ name: "addCard" })}>Add Payment Method</Button>
      </div>
    </Screen>
  );
}

export function AddCardScreen() {
  const app = useApp();
  const [form, setForm] = useState({ number: "", exp: "", cvc: "", name: "", zip: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));
  return (
    <form
      className="alu-fill"
      onSubmit={(e) => {
        e.preventDefault();
        const next: Record<string, string> = {};
        const digits = form.number.replace(/\s/g, "");
        if (digits.length < 15) next.number = "Enter the full card number.";
        if (!/^\d{2}\/\d{2}$/.test(form.exp)) next.exp = "Use MM/YY.";
        if (form.cvc.length < 3) next.cvc = "Enter the CVC.";
        if (form.name.trim().length < 3) next.name = "Enter the name on the card.";
        if (form.zip.trim().length < 5) next.zip = "Enter the billing ZIP.";
        setErrors(next);
        if (Object.keys(next).length) return;
        const brand: PayCard["brand"] = digits.startsWith("4") ? "Visa" : digits.startsWith("3") ? "Amex" : "Mastercard";
        app.addCard({
          id: `c-${Date.now()}`,
          brand,
          last4: digits.slice(-4),
          exp: form.exp,
          isDefault: app.cards.length === 0,
          declines: digits.endsWith("0002"),
        });
      }}
    >
      <Screen title="Add Card" back>
        <div className="alu-pad">
          <TextField label="Card number" value={form.number} onChange={(v) => set("number", v)} error={errors.number} placeholder="4242 4242 4242 4242" />
          <TextField label="Expiry" value={form.exp} onChange={(v) => set("exp", v)} error={errors.exp} placeholder="MM/YY" />
          <TextField label="CVC" value={form.cvc} onChange={(v) => set("cvc", v)} error={errors.cvc} />
          <TextField label="Name on card" value={form.name} onChange={(v) => set("name", v)} error={errors.name} />
          <TextField label="Billing ZIP" value={form.zip} onChange={(v) => set("zip", v)} error={errors.zip} />
          <Button type="submit">Save Card</Button>
        </div>
      </Screen>
    </form>
  );
}

export function PurchasesScreen() {
  const app = useApp();
  const months = [...new Set(app.purchases.map((p) => p.month))];
  return (
    <Screen large title="Purchase History" back>
      {app.purchases.length === 0 && <Empty title="No purchases yet" body="Class packs and memberships you buy will show up here." />}
      {months.map((month) => (
        <div key={month}>
          <div className="alu-section">{month}</div>
          <Group>
            {app.purchases.filter((p) => p.month === month).map((purchase) => (
              <Row
                key={purchase.id}
                title={purchase.item}
                subtitle={purchase.dateLabel}
                trailing={<span style={{ display: "flex", alignItems: "center", gap: 8 }}><b>{money(purchase.amount)}</b><Badge status={purchase.status} /></span>}
                onClick={() => app.push({ name: "receipt", purchaseId: purchase.id })}
              />
            ))}
          </Group>
        </div>
      ))}
    </Screen>
  );
}

export function ReceiptScreen({ purchaseId }: { purchaseId: string }) {
  const app = useApp();
  const purchase = app.purchases.find((item) => item.id === purchaseId);
  if (!purchase) return <Screen title="Receipt" back><Empty title="Receipt missing" body="This payment is no longer on the device." /></Screen>;
  const lines = [`${purchase.item}`, `Date: ${purchase.dateLabel}`, `Amount: ${money(purchase.amount)}`, `Status: ${purchase.status}`, `Method: ${purchase.method}`, "Aluvita Studio · 1847 Union Street"];
  return (
    <Screen
      title="Receipt"
      back
      footer={
        <Button
          onClick={() => {
            downloadPdf("Aluvita Studio Receipt", lines);
            app.toast("Receipt downloaded");
          }}
        >
          Download PDF
        </Button>
      }
    >
      <div className="alu-pad">
        <h1 className="alu-t2">{purchase.item}</h1>
        <Badge status={purchase.status} />
        <div className="alu-kv"><span>Date</span><b>{purchase.dateLabel}</b></div>
        <div className="alu-kv"><span>Amount</span><b>{money(purchase.amount)}</b></div>
        <div className="alu-kv"><span>Method</span><b>{purchase.method}</b></div>
        <div className="alu-kv"><span>Receipt</span><b>{purchase.id.toUpperCase()}</b></div>
        <Button variant="secondary" onClick={() => app.setOverlay({ type: "share", label: `Receipt ${purchase.item}` })}>Share</Button>
      </div>
    </Screen>
  );
}

function CardBrand({ brand }: { brand: string }) {
  return <span className="alu-badge">{brand === "Visa" ? "VISA" : brand === "Amex" ? "AMEX" : "MC"}</span>;
}

export function MembershipManageScreen() {
  const app = useApp();
  const plan = app.membership;
  if (!app.user) return <Screen title="Membership" back><Empty title="Sign in required" body="Membership details are part of your account." action="Log In" onAction={() => app.setOverlay({ type: "auth" })} /></Screen>;
  if (!plan) return <Screen title="Membership" back><Empty title="No membership yet" body="Choose a monthly plan or a class pack when you are ready." action="See plans" onAction={() => app.openTab("memberships")} /></Screen>;
  return (
    <Screen large title="Membership" back>
      <div className="alu-inset" style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <strong className="alu-t2">{plan.name}</strong>
          <Badge status={plan.status} />
        </div>
        <div className="alu-kv"><span>Started</span><b>{plan.started}</b></div>
        <div className="alu-kv"><span>{plan.status === "Cancels" ? "Access until" : "Renews"}</span><b>{plan.renews}</b></div>
        <div className="alu-kv"><span>Credits</span><b>{plan.creditsTotal === null ? "Unlimited" : `${plan.credits} / ${plan.creditsTotal}`}</b></div>
        <div className="alu-kv"><span>{plan.passName}</span><b>{plan.passCredits} left</b></div>
      </div>
      <div className="alu-pad" style={{ display: "grid", gap: 8 }}>
        <Button variant="secondary" onClick={() => app.setOverlay({ type: "freeze" })}>Freeze Membership</Button>
        <Button variant="destructive" onClick={() => app.setOverlay({ type: "cancelPlan" })}>Cancel Membership</Button>
      </div>
    </Screen>
  );
}
