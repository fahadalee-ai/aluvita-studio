import { useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HomeIndicator, StatusBar, TabBar } from "@/components/ios/ui";
import { Overlays } from "@/app/overlays";
import {
  ForgotScreen,
  ForgotSentScreen,
  LoginScreen,
  OnboardingScreen,
  RegisterScreen,
  ResetScreen,
  SplashScreen,
  VerifyScreen,
  WelcomeScreen,
} from "@/app/screens/auth";
import { BookedScreen, BookingsScreen } from "@/app/screens/bookings";
import { HomeScreen } from "@/app/screens/home";
import {
  AddCardScreen,
  CheckoutScreen,
  MembershipManageScreen,
  MembershipsScreen,
  PayResultScreen,
  PaymentsScreen,
  PlanScreen,
  PurchasesScreen,
  ReceiptScreen,
} from "@/app/screens/memberships";
import {
  DesignScreen,
  EditProfileScreen,
  HelpScreen,
  LegalScreen,
  LinkedScreen,
  NotificationsScreen,
  PasswordScreen,
  PreferencesScreen,
  ProfileScreen,
  SettingsScreen,
  StudioScreen,
} from "@/app/screens/profile";
import { ClassScreen, InstructorScreen, ScheduleScreen } from "@/app/screens/schedule";
import { routeKey, useApp, type Route } from "@/lib/store";

function renderRoute(route: Route, tab: string) {
  switch (route.name) {
    case "splash":
      return <SplashScreen />;
    case "onboarding":
      return <OnboardingScreen />;
    case "welcome":
      return <WelcomeScreen />;
    case "login":
      return <LoginScreen />;
    case "register":
      return <RegisterScreen />;
    case "verify":
      return <VerifyScreen />;
    case "forgot":
      return <ForgotScreen />;
    case "forgotSent":
      return <ForgotSentScreen email={route.email} />;
    case "reset":
      return <ResetScreen email={route.email} />;
    case "tabs":
      if (tab === "schedule") return <ScheduleScreen />;
      if (tab === "bookings") return <BookingsScreen />;
      if (tab === "memberships") return <MembershipsScreen />;
      if (tab === "profile") return <ProfileScreen />;
      return <HomeScreen />;
    case "class":
      return <ClassScreen sessionId={route.sessionId} />;
    case "instructor":
      return <InstructorScreen instructorId={route.instructorId} />;
    case "booked":
      return <BookedScreen bookingId={route.bookingId} />;
    case "plan":
      return <PlanScreen planId={route.planId} />;
    case "checkout":
      return <CheckoutScreen planId={route.planId} />;
    case "payResult":
      return <PayResultScreen ok={route.ok} purchaseId={route.purchaseId} />;
    case "payments":
      return <PaymentsScreen />;
    case "addCard":
      return <AddCardScreen />;
    case "purchases":
      return <PurchasesScreen />;
    case "receipt":
      return <ReceiptScreen purchaseId={route.purchaseId} />;
    case "notifications":
      return <NotificationsScreen />;
    case "studio":
      return <StudioScreen />;
    case "settings":
      return <SettingsScreen />;
    case "editProfile":
      return <EditProfileScreen />;
    case "password":
      return <PasswordScreen />;
    case "preferences":
      return <PreferencesScreen />;
    case "membership":
      return <MembershipManageScreen />;
    case "help":
      return <HelpScreen />;
    case "legal":
      return <LegalScreen doc={route.doc} />;
    case "linked":
      return <LinkedScreen />;
    case "design":
      return <DesignScreen />;
    default:
      return null;
  }
}

export function PhoneApp() {
  const app = useApp();
  const dark = useDark(app.appearance);
  const embedded = useEmbedded();
  const mobile = useMobile() || embedded;
  const scale = useScale(mobile);
  const route = app.stack[app.stack.length - 1] ?? { name: "splash" as const };

  return (
    <div className="alu-stage">
      <div>
        <div style={{ width: mobile ? "100vw" : 393 * scale, height: mobile ? "100dvh" : 852 * scale }}>
          <div
            className={`alu-device ${mobile ? "full" : ""}`}
            style={mobile ? undefined : { transform: `scale(${scale})`, transformOrigin: "top left" }}
          >
            <div className={`alu ${dark ? "dark" : ""} ${embedded ? "embed" : ""}`} style={{ ["--type" as string]: app.typeScale }}>
              {!embedded && <StatusBar light={app.chromeLight || route.name === "onboarding"} />}
              <div key={`${routeKey(route)}-${route.name === "tabs" ? app.tab : ""}`} className={`alu-pane ${app.dir}`}>
                {renderRoute(route, app.tab)}
              </div>
              {route.name === "tabs" && <TabBar />}
              {!embedded && <HomeIndicator />}
              <Overlays />
            </div>
          </div>
        </div>
        {!mobile && <p className="alu-caption">Aluvita Studio · iPhone 15 Pro · 393 × 852</p>}
      </div>
    </div>
  );
}

function useEmbedded() {
  const href = useLocation({ select: (location) => location.href });
  const flagged = /(?:\?|&)embed=1(?:&|$)/.test(href);
  const [framed, setFramed] = useState(false);
  useEffect(() => {
    try {
      setFramed(window.parent !== window);
    } catch {
      setFramed(true);
    }
  }, []);
  return flagged || framed;
}

function useMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const read = () => setMobile(window.innerWidth < 520);
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  return mobile;
}

function useScale(mobile: boolean) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      if (mobile) {
        setScale(1);
        return;
      }
      const next = Math.min(1, (window.innerWidth - 48) / 393, (window.innerHeight - 72) / 852);
      setScale(next);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [mobile]);
  return scale;
}

function useDark(appearance: "light" | "dark" | "system") {
  const [system, setSystem] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setSystem(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return appearance === "dark" || (appearance === "system" && system);
}
