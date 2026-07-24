export type Amenity = {
  title: string;
  description: string;
  icon: string;
};

const ICON_BASE = "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267";

export const amenities: Amenity[] = [
  {
    title: "Coffee Shop",
    description:
      "On-site cafés provide a convenient place for quick meetings, informal discussions, a moment to recharge, or simply starting the day with good coffee and a fresh bite.",
    icon: `${ICON_BASE}/6a02e415eafef35fdc5d478e_coffee.svg`,
  },
  {
    title: "Gym",
    description:
      "Stay active without leaving the office. Our state-of-the-art gym is equipped with modern fitness facilities, helping you maintain a healthy work-life balance.",
    icon: `${ICON_BASE}/6a02e4baa6b297feec4255bf_gym.svg`,
  },
  {
    title: "Walking, Running & Cycling Trails",
    description:
      "Re-energize with a scenic 1.8 km walking, running and cycling trails. Explore lush gardens, pause areas, and serene green spaces to promote health and well-being.",
    icon: `${ICON_BASE}/6a02e59f46b7a936146f111d_bicycle.svg`,
  },
  {
    title: "Restaurant & Bar",
    description:
      "Unwind and connect with colleagues at our rooftop bar, offering stunning views, refreshing drinks, and a vibrant social atmosphere. Fond is perfect for after-work gatherings or casual business meet-ups.",
    icon: `${ICON_BASE}/6a02e63258c8e5cfbb55ba52_bar.svg`,
  },
  {
    title: "Corporate Accommodation",
    description:
      "Stay close to where business happens with fully serviced corporate accommodation designed for visiting executives, project teams, and professionals working within the Midpoint estate.",
    icon: `${ICON_BASE}/6a148c1488ace6e336cde23a_accomodation.svg`,
  },
  {
    title: "Padel Court",
    description:
      "Take a break and challenge colleagues to a match on our rooftop padel courts. An exciting way to stay fit, have fun, and foster stronger team connections.",
    icon: `${ICON_BASE}/6a02e7abd666d08db6c6ae77_padel.svg`,
  },
];
