/**
 * Iconos SVG inline para la sección de viajes. Heredan color con `currentColor`.
 * @param {import('react').SVGProps<SVGSVGElement>} props
 */
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export const PlaneIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M17.8 19.8 16 14l3-3c1-1 1.3-2.3.8-2.8-.5-.5-1.8-.2-2.8.8l-3 3-5.8-1.8a.7.7 0 0 0-.7.2l-.8.8 4 2.4-2.4 2.4-1.8-.4-.7.7L8 18l1.5 2.5.7-.7-.4-1.8 2.4-2.4 2.4 4 .8-.8a.7.7 0 0 0 .2-.7Z" />
  </svg>
);

export const BedIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 7v12M3 13h18v6M21 19v-5a3 3 0 0 0-3-3H9v4" />
    <circle cx="6.5" cy="9.5" r="1.5" />
  </svg>
);

export const CoffeeIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 9h12v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Z" />
    <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17M7 3v2M11 3v2" />
  </svg>
);

export const CarIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13" />
    <path d="M4 13h16v4H4zM6 17v1.5M18 17v1.5" />
    <circle cx="7.5" cy="15" r="0.5" />
    <circle cx="16.5" cy="15" r="0.5" />
  </svg>
);

export const SailboatIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 18h18l-2 3H5l-2-3ZM12 3 5 15h7V3ZM12 6l5 9h-5" />
  </svg>
);

export const MapPinIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const StarIcon = (p) => (
  <svg {...base} fill="currentColor" stroke="none" viewBox="0 0 24 24" aria-hidden {...p}>
    <path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9L12 3Z" />
  </svg>
);

export const ShareIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
  </svg>
);

export const HeartIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 20s-7-4.6-7-9.6A3.9 3.9 0 0 1 12 7a3.9 3.9 0 0 1 7 3.4c0 5-7 9.6-7 9.6Z" />
  </svg>
);

export const BoltIcon = (p) => (
  <svg {...base} fill="currentColor" stroke="none" viewBox="0 0 24 24" aria-hidden {...p}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
  </svg>
);

export const CheckIcon = (p) => (
  <svg {...base} {...p}>
    <path d="m5 12 5 5 9-11" />
  </svg>
);

export const InfoIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h0" />
  </svg>
);

export const CalendarIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </svg>
);

export const MinusIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
  </svg>
);

export const PlusIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const ArrowRightIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowLeftIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
);

export const ChevronRightIcon = (p) => (
  <svg {...base} {...p}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const BellIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
);

export const PlaneLogoIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M2 22h20" />
    <path d="M3.5 16.5 21 12c.8-.2 1.3-1 1.1-1.8-.2-.8-1-1.3-1.8-1.1l-4.9 1.3-6.2-5.4-1.9.5 3.4 5.9-4.2 1.1-2-1.6-1.4.4 2 4.7Z" />
  </svg>
);
