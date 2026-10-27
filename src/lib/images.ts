import logo from "@/img/logo.png";
import onboarding1 from "@/img/ai/onboarding-1.jpg";
import onboarding2 from "@/img/ai/onboarding-2.jpg";
import onboarding3 from "@/img/ai/onboarding-3.jpg";
import vinyasa from "@/img/ai/class-vinyasa.jpg";
import hatha from "@/img/ai/class-hatha.jpg";
import yin from "@/img/ai/class-yin.jpg";
import power from "@/img/ai/class-power.jpg";
import prenatal from "@/img/ai/class-prenatal.jpg";
import meditation from "@/img/ai/class-meditation.jpg";
import restorative from "@/img/ai/class-restorative.jpg";
import beginner from "@/img/ai/class-beginner.jpg";
import sara from "@/img/ai/instructor-sara.jpg";
import daniel from "@/img/ai/instructor-daniel.jpg";
import mei from "@/img/ai/instructor-mei.jpg";
import priya from "@/img/ai/instructor-priya.jpg";
import olivia from "@/img/ai/instructor-olivia.jpg";
import liam from "@/img/ai/instructor-liam.jpg";
import member from "@/img/ai/member-sara.jpg";
import studio1 from "@/img/ai/studio-interior-1.jpg";
import studio2 from "@/img/ai/studio-interior-2.jpg";
import studio3 from "@/img/ai/studio-interior-3.jpg";
import studio4 from "@/img/ai/studio-interior-4.jpg";
import promo1 from "@/img/ai/promo-first-class.jpg";
import promo2 from "@/img/ai/promo-friend.jpg";
import promo3 from "@/img/ai/promo-sunrise.jpg";
import map from "@/img/ai/map-studio.jpg";

export const logoUrl = logo;

export const images = {
  onboarding1,
  onboarding2,
  onboarding3,
  vinyasa,
  hatha,
  yin,
  power,
  prenatal,
  meditation,
  restorative,
  beginner,
  sara,
  daniel,
  mei,
  priya,
  olivia,
  liam,
  member,
  studio1,
  studio2,
  studio3,
  studio4,
  promo1,
  promo2,
  promo3,
  map,
} as const;

export type ImageKey = keyof typeof images;
