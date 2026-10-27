import { useEffect, useRef, useState } from "react";
import { Button, CheckMark, TextField } from "@/components/ios/ui";
import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  goals,
  passwordStrength,
} from "@/lib/data";
import { images, logoUrl } from "@/lib/images";
import { useApp } from "@/lib/store";

const pages = [
  {
    image: images.onboarding1,
    title: "Find Your Flow",
    body: "Browse yoga classes for every level, from gentle stretches to powerful vinyasa.",
  },
  {
    image: images.onboarding2,
    title: "Book in Seconds",
    body: "Reserve your spot, join waitlists and get reminders so you never miss a class.",
  },
  {
    image: images.onboarding3,
    title: "Grow Your Practice",
    body: "Track your memberships, credits and bookings all in one calm place.",
  },
];

export function SplashScreen() {
  const app = useApp();
  useEffect(() => {
    app.setChromeLight(false);
  }, [app]);
  return (
    <div className="alu-splash">
      <div className="alu-logo-pop">
        <img src={logoUrl} alt="Aluvita Studio" />
      </div>
      <p className="alu-tag">Breathe. Move. Be.</p>
    </div>
  );
}

export function OnboardingScreen() {
  const app = useApp();
  const scroller = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  const go = (index: number) => {
    scroller.current?.scrollTo({ left: index * (scroller.current.clientWidth || 1), behavior: "smooth" });
    setPage(index);
  };

  return (
    <div className="alu-fill">
      <div style={{ position: "absolute", top: 54, right: 8, zIndex: 5 }}>
        <Button
          variant="text"
          onClick={() => {
            app.markOnboarded();
            app.reset({ name: "welcome" });
          }}
        >
          Skip
        </Button>
      </div>
      <div
        ref={scroller}
        onScroll={(e) => setPage(Math.round(e.currentTarget.scrollLeft / Math.max(1, e.currentTarget.clientWidth)))}
        style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", height: "100%" }}
      >
        {pages.map((item) => (
          <section key={item.title} style={{ minWidth: "100%", scrollSnapAlign: "start", display: "flex", flexDirection: "column" }}>
            <div style={{ position: "relative", height: "58%" }}>
              <img src={item.image} alt="" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 110, background: "linear-gradient(180deg, rgba(18,22,20,0.45), transparent)" }} />
            </div>
            <div className="alu-pad" style={{ paddingTop: 22, display: "flex", flexDirection: "column", flex: 1 }}>
              <h1 className="alu-t1" style={{ margin: "0 0 8px" }}>{item.title}</h1>
              <p className="alu-b" style={{ margin: 0, color: "var(--muted)" }}>{item.body}</p>
            </div>
          </section>
        ))}
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 28 }}>
        <div className="alu-dots" aria-hidden="true">
          {pages.map((item, index) => (
            <i key={item.title} className={index === page ? "on" : ""} />
          ))}
        </div>
        <Button
          onClick={() => {
            if (page < 2) go(page + 1);
            else {
              app.markOnboarded();
              app.reset({ name: "welcome" });
            }
          }}
        >
          {page < 2 ? "Next" : "Get Started"}
        </Button>
        <div style={{ textAlign: "center" }}>
          <Button
            variant="text"
            onClick={() => {
              app.markOnboarded();
              app.reset({ name: "login" });
            }}
          >
            I already have an account
          </Button>
        </div>
      </div>
    </div>
  );
}

export function WelcomeScreen() {
  const app = useApp();
  return (
    <div className="alu-fill">
      <div className="alu-scroll" style={{ padding: "78px 20px 28px", display: "flex", flexDirection: "column" }}>
        <img src={logoUrl} alt="Aluvita Studio" style={{ width: 168, borderRadius: 16, background: "#000" }} />
        <h1 className="alu-t1" style={{ margin: "22px 0 8px" }}>Welcome to Aluvita Studio</h1>
        <p className="alu-c" style={{ color: "var(--muted)", marginTop: 0 }}>A quiet room on Union Street. Book a class, keep your credits, and come back when you are ready.</p>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          <Button variant="apple" onClick={() => app.loginDemo()}>
            <AppleMark /> Continue with Apple
          </Button>
          <Button variant="google" onClick={() => app.loginDemo()}>
            <GoogleMark /> Continue with Google
          </Button>
          <Button variant="secondary" onClick={() => app.push({ name: "login" })}>Continue with Email</Button>
          <div style={{ textAlign: "center" }}>
            <Button variant="text" onClick={() => app.setGuest(true)}>Browse as Guest</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoginScreen() {
  const app = useApp();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState("");

  return (
    <form
      className="alu-fill"
      onSubmit={(e) => {
        e.preventDefault();
        if (!email.includes("@") || password.length < 6) {
          setError("Enter the email and password for your studio account.");
          return;
        }
        const result = app.login(email, password);
        if (!result.ok) setError("That email and password do not match. Try the preview account below.");
      }}
    >
      <div className="alu-scroll" style={{ padding: "64px 20px 28px" }}>
        <button type="button" className="alu-linkish" onClick={() => app.pop()}>Back</button>
        <img src={logoUrl} alt="Aluvita Studio" style={{ width: 140, borderRadius: 14, background: "#000", marginTop: 8 }} />
        <h1 className="alu-t1" style={{ margin: "16px 0" }}>Log In</h1>
        <TextField label="Email" type="email" value={email} onChange={setEmail} />
        <TextField label="Password" type="password" value={password} onChange={setPassword} error={error} />
        <button type="button" className="alu-linkish" onClick={() => app.push({ name: "forgot" })}>Forgot Password?</button>
        <div style={{ height: 12 }} />
        <Button type="submit">Log In</Button>
        <div style={{ height: 8 }} />
        <Button
          variant="secondary"
          onClick={() =>
            app.setAlert({
              title: "Sign in with Face ID?",
              message: "Aluvita Studio can use Face ID to open your account on this iPhone.",
              confirmLabel: "Allow",
              cancelLabel: "Don't Allow",
              onConfirm: () => {
                app.setAlert(null);
                app.loginDemo();
              },
            })
          }
        >
          Use Face ID
        </Button>
        <div style={{ height: 16 }} />
        <Button variant="apple" onClick={() => app.loginDemo()}><AppleMark /> Continue with Apple</Button>
        <div style={{ height: 8 }} />
        <Button variant="google" onClick={() => app.loginDemo()}><GoogleMark /> Continue with Google</Button>
        <p className="alu-f" style={{ textAlign: "center" }}>
          New here?{" "}
          <button type="button" className="alu-linkish" onClick={() => app.push({ name: "register" })}>Sign Up</button>
        </p>
        <p className="alu-f" style={{ textAlign: "center" }}>Preview account is filled in. Password studio123.</p>
      </div>
    </form>
  );
}

export function RegisterScreen() {
  const app = useApp();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    level: "Beginner",
    goals: [] as string[],
    agree: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const strength = passwordStrength(form.password);
  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <form
      className="alu-fill"
      onSubmit={(e) => {
        e.preventDefault();
        const next: Record<string, string> = {};
        if (form.name.trim().length < 3) next.name = "Enter your full name.";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
        if (form.phone.replace(/\D/g, "").length < 10) next.phone = "Enter a 10-digit phone number.";
        if (strength.score < 3) next.password = "Use 8 or more characters with upper and lower case and a number.";
        if (form.confirm !== form.password) next.confirm = "Passwords do not match.";
        if (!form.agree) next.agree = "Agree to the Terms and Privacy Policy to continue.";
        setErrors(next);
        if (Object.keys(next).length) return;
        const [firstName, ...rest] = form.name.trim().split(" ");
        app.register({
          id: `u-${Date.now()}`,
          firstName: firstName || "Friend",
          lastName: rest.join(" ") || "Member",
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          dob: "1996-01-01",
          emergencyName: "",
          emergencyPhone: "",
          health: "",
          experience: form.level as "Beginner" | "Intermediate" | "Advanced",
          goals: form.goals,
          favoriteTypes: form.goals,
          preferredTimes: [],
          preferredInstructors: [],
          language: "English",
        });
      }}
    >
      <div className="alu-scroll" style={{ padding: "64px 20px 32px" }}>
        <button type="button" className="alu-linkish" onClick={() => app.pop()}>Back</button>
        <img src={logoUrl} alt="Aluvita Studio" style={{ width: 120, borderRadius: 12, background: "#000", margin: "8px 0" }} />
        <h1 className="alu-t1" style={{ margin: "8px 0 16px" }}>Create Account</h1>
        <TextField label="Full Name" value={form.name} onChange={(v) => set("name", v)} error={errors.name} />
        <TextField label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} error={errors.email} />
        <TextField label="Phone" type="tel" value={form.phone} onChange={(v) => set("phone", v)} error={errors.phone} placeholder="(415) 555-0100" />
        <TextField label="Password" type="password" value={form.password} onChange={(v) => set("password", v)} error={errors.password} />
        {form.password && (
          <div style={{ marginTop: -6, marginBottom: 12 }}>
            <div className="alu-meter" aria-hidden="true">
              <span className={strength.tone} style={{ width: `${Math.max(12, (strength.score / 5) * 100)}%` }} />
            </div>
            <p className="alu-f">Strength: {strength.label}</p>
          </div>
        )}
        <TextField label="Confirm Password" type="password" value={form.confirm} onChange={(v) => set("confirm", v)} error={errors.confirm} />
        <p className="alu-label">Yoga experience</p>
        <div className="alu-seg" style={{ margin: "8px 0 16px" }}>
          {["Beginner", "Intermediate", "Advanced"].map((level) => (
            <button key={level} type="button" className={form.level === level ? "on" : ""} onClick={() => set("level", level)}>
              {level}
            </button>
          ))}
        </div>
        <p className="alu-label">Goals</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "8px 0 12px" }}>
          {goals.map((goal) => (
            <button
              key={goal}
              type="button"
              className={`alu-chip ${form.goals.includes(goal) ? "on" : ""}`}
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  goals: f.goals.includes(goal) ? f.goals.filter((g) => g !== goal) : [...f.goals, goal],
                }))
              }
            >
              {goal}
            </button>
          ))}
        </div>
        <button type="button" className="alu-checkrow" onClick={() => setForm((f) => ({ ...f, agree: !f.agree }))}>
          <span className={`alu-box ${form.agree ? "on" : ""}`}>{form.agree && <CheckIcon />}</span>
          <span>
            I agree to the{" "}
            <em className="alu-linkish" style={{ fontStyle: "normal" }} onClick={(e) => { e.stopPropagation(); app.setOverlay({ type: "legal", doc: "terms" }); }}>Terms</em>
            {" "}&{" "}
            <em className="alu-linkish" style={{ fontStyle: "normal" }} onClick={(e) => { e.stopPropagation(); app.setOverlay({ type: "legal", doc: "privacy" }); }}>Privacy Policy</em>
          </span>
        </button>
        {errors.agree && <p className="alu-error">{errors.agree}</p>}
        <div style={{ height: 12 }} />
        <Button type="submit">Create Account</Button>
        <p className="alu-f" style={{ textAlign: "center" }}>
          Already have an account?{" "}
          <button type="button" className="alu-linkish" onClick={() => app.reset({ name: "login" })}>Log In</button>
        </p>
      </div>
    </form>
  );
}

export function VerifyScreen() {
  const app = useApp();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [left, setLeft] = useState(30);
  const [done, setDone] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (left <= 0) return;
    const t = window.setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(t);
  }, [left]);

  if (done) {
    return (
      <div className="alu-fill" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <CheckMark />
        <h1 className="alu-t2">You are verified</h1>
        <p className="alu-c" style={{ color: "var(--muted)" }}>Your account is ready. We will take you into the studio.</p>
        <Button onClick={() => app.verify()}>Continue</Button>
      </div>
    );
  }

  const digits = code.padEnd(6, " ").slice(0, 6).split("");

  return (
    <div className="alu-fill">
      <div className="alu-scroll alu-pad" style={{ paddingTop: 78 }}>
        <h1 className="alu-t1">Enter the code</h1>
        <p className="alu-c" style={{ color: "var(--muted)" }}>We sent a 6-digit code to {app.pendingUser?.email ?? "your email"}. For this preview, any 6 digits will do.</p>
        <div className="alu-otp">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputs.current[index] = el; }}
              inputMode="numeric"
              maxLength={1}
              value={digit.trim()}
              aria-label={`Digit ${index + 1}`}
              onChange={(e) => {
                const next = code.split("");
                next[index] = e.target.value.replace(/\D/g, "").slice(-1);
                const joined = next.join("").replace(/\s/g, "").slice(0, 6);
                setCode(joined);
                if (e.target.value && inputs.current[index + 1]) inputs.current[index + 1]?.focus();
              }}
              onPaste={(e) => {
                const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                if (!text) return;
                e.preventDefault();
                setCode(text);
              }}
            />
          ))}
        </div>
        {error && <p className="alu-error" style={{ textAlign: "center" }}>{error}</p>}
        <div style={{ height: 18 }} />
        <Button
          onClick={() => {
            if (code.replace(/\D/g, "").length < 6) {
              setError("Enter all 6 digits.");
              return;
            }
            setDone(true);
          }}
        >
          Verify
        </Button>
        <p className="alu-f" style={{ textAlign: "center" }}>
          {left > 0 ? `Resend code in ${left}s` : (
            <button type="button" className="alu-linkish" onClick={() => { setLeft(30); app.toast("Code sent"); }}>Resend code</button>
          )}
        </p>
      </div>
    </div>
  );
}

export function ForgotScreen() {
  const app = useApp();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  return (
    <form
      className="alu-fill"
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          setError("Enter the email on your account.");
          return;
        }
        app.push({ name: "forgotSent", email });
      }}
    >
      <div className="alu-scroll alu-pad" style={{ paddingTop: 78 }}>
        <button type="button" className="alu-linkish" onClick={() => app.pop()}>Back</button>
        <h1 className="alu-t1">Forgot password</h1>
        <p className="alu-c" style={{ color: "var(--muted)" }}>We will send a reset link to this address.</p>
        <TextField label="Email" type="email" value={email} onChange={setEmail} error={error} />
        <Button type="submit">Send Reset Link</Button>
      </div>
    </form>
  );
}

export function ForgotSentScreen({ email }: { email: string }) {
  const app = useApp();
  return (
    <div className="alu-fill">
      <div className="alu-scroll alu-pad" style={{ paddingTop: 90, textAlign: "center" }}>
        <CheckMark />
        <h1 className="alu-t2">Check your inbox</h1>
        <p className="alu-c" style={{ color: "var(--muted)" }}>A reset link is on its way to {email}. It expires in 30 minutes.</p>
        <Button onClick={() => app.push({ name: "reset", email })}>Enter a new password</Button>
        <Button variant="text" onClick={() => app.reset({ name: "login" })}>Back to Log In</Button>
      </div>
    </div>
  );
}

export function ResetScreen({ email }: { email: string }) {
  const app = useApp();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const strength = passwordStrength(password);
  return (
    <form
      className="alu-fill"
      onSubmit={(e) => {
        e.preventDefault();
        if (strength.score < 3) {
          setError("Choose a stronger password.");
          return;
        }
        if (password !== confirm) {
          setError("Passwords do not match.");
          return;
        }
        app.resetPassword(email, password);
        app.setAlert({
          title: "Password updated",
          message: "You can log in with your new password.",
          confirmLabel: "Log In",
          onConfirm: () => {
            app.setAlert(null);
            app.reset({ name: "login" });
          },
        });
      }}
    >
      <div className="alu-scroll alu-pad" style={{ paddingTop: 78 }}>
        <h1 className="alu-t1">New password</h1>
        <p className="alu-f">For {email}</p>
        <TextField label="New password" type="password" value={password} onChange={setPassword} />
        <div className="alu-meter"><span className={strength.tone} style={{ width: `${(strength.score / 5) * 100}%` }} /></div>
        <p className="alu-f">Strength: {strength.label || "Too short"}</p>
        <TextField label="Confirm password" type="password" value={confirm} onChange={setConfirm} error={error} />
        <Button type="submit">Update Password</Button>
      </div>
    </form>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 7 l3 3 7-7" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor" aria-hidden="true">
      <path d="M13.1 9.5c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8s-1.7-.8-2.9-.8c-1.5 0-2.8.9-3.6 2.2-1.5 2.7-.4 6.6 1.1 8.8.7 1.1 1.6 2.3 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.7.7 2.9.7 1.9-1.1 2.6-2.2c.8-1.2 1.1-2.3 1.2-2.4-.1 0-2.2-.8-2.2-3.6zM11 3.2c.6-.7 1-1.7.9-2.7-1 .1-2.1.6-2.7 1.4-.6.7-1.1 1.7-.9 2.6 1 .1 2.1-.5 2.7-1.3z" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#EA4335" d="M9 7.4v3.3h4.6c-.2 1.1-.8 2-1.7 2.6l2.7 2.1c1.6-1.5 2.5-3.6 2.5-6.1 0-.6 0-1.1-.1-1.6H9z" />
      <path fill="#34A853" d="M9 18c2.2 0 4.1-.7 5.5-2l-2.7-2.1c-.7.5-1.7.8-2.8.8-2.2 0-4-1.5-4.7-3.4L1.5 13.5C2.9 16.2 5.7 18 9 18z" />
      <path fill="#4A90E2" d="M4.3 11.3A5.4 5.4 0 0 1 4 9c0-.8.1-1.6.3-2.3L1.5 4.5A9 9 0 0 0 0 9c0 1.5.4 2.9 1 4.1l3.3-1.8z" />
      <path fill="#FBBC05" d="M9 3.6c1.2 0 2.3.4 3.2 1.2l2.4-2.4C13.1.9 11.2 0 9 0 5.7 0 2.9 1.8 1.5 4.5L4.3 6.7C5 4.7 6.8 3.6 9 3.6z" />
    </svg>
  );
}
