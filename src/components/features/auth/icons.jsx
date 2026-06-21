/**
 * Iconos SVG inline para la pantalla de autenticación.
 * Cada uno hereda el color con `currentColor` y acepta className/props estándar de <svg>.
 *
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

export function PlaneTakeoffIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2 22h20" />
      <path d="M3.5 16.5 21 12c.8-.2 1.3-1 1.1-1.8-.2-.8-1-1.3-1.8-1.1l-4.9 1.3-6.2-5.4-1.9.5 3.4 5.9-4.2 1.1-2-1.6-1.4.4 2 4.7Z" />
    </svg>
  );
}

export function MailIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}

export function LockIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function UserIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

export function EyeIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOffIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M10.7 5.1A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a16.6 16.6 0 0 1-2.6 3.4" />
      <path d="M6.6 6.6A16.4 16.4 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

export function TicketIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4Z" />
      <path d="M13 7v10" />
    </svg>
  );
}

export function BuildingIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 7h0M12 7h0M15 7h0M9 11h0M12 11h0M15 11h0M9 15h0M15 15h0" />
      <path d="M11 21v-3a1 1 0 0 1 2 0v3" />
    </svg>
  );
}

export function MapIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m9 4 6 2 5.3-1.8a.6.6 0 0 1 .7.6v13.4a.6.6 0 0 1-.4.6L15 20l-6-2-5.3 1.8a.6.6 0 0 1-.7-.6V5.8a.6.6 0 0 1 .4-.6L9 4Z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}
