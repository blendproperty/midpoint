export type Amenity = {
  title: string;
  description: string;
  icon: string;
};

export const amenities: Amenity[] = [
  {
    title: "Coffee Shop",
    description:
      "Coffee and casual meeting space within the wider Midpoint amenity offering. Confirm the current venue and opening hours before visiting.",
    icon: "/images/amenities/icon-coffee.svg",
  },
  {
    title: "Gym",
    description:
      "Fitness facilities form part of the Midpoint amenity plan. Ask the leasing team about current access and operating arrangements.",
    icon: "/images/amenities/icon-gym.svg",
  },
  {
    title: "Walking, Running & Cycling Trails",
    description:
      "Approximately 1.8 km of walking, running and cycling routes through the estate grounds.",
    icon: "/images/amenities/icon-bicycle.svg",
  },
  {
    title: "Restaurant & Bar",
    description:
      "Fond provides restaurant and bar space at Midpoint. Confirm current opening hours and access directly with the venue.",
    icon: "/images/amenities/icon-bar.svg",
  },
  {
    title: "Corporate Accommodation",
    description:
      "Corporate accommodation is planned for visiting teams and short stays. Confirm completion and booking availability before making arrangements.",
    icon: "/images/amenities/icon-accommodation.svg",
  },
  {
    title: "Padel Court",
    description:
      "Padel facilities form part of the estate amenity offering. Confirm current booking and access arrangements before visiting.",
    icon: "/images/amenities/icon-padel.svg",
  },
];
