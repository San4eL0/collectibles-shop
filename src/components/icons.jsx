/* Современные линейные SVG-иконки в киберпанк-стиле */

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const IconSearch = () => (
  <svg {...base}><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
);

export const IconCart = () => (
  <svg {...base}>
    <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 9H6" />
    <circle cx="10.5" cy="21" r="1.2" />
    <circle cx="17.5" cy="21" r="1.2" />
  </svg>
);

export const IconUser = () => (
  <svg {...base}><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" /></svg>
);

export const IconLogout = () => (
  <svg {...base}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
);

export const IconSun = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
    <line x1="4.9" y1="4.9" x2="7" y2="7" /><line x1="17" y1="17" x2="19.1" y2="19.1" />
    <line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
    <line x1="4.9" y1="19.1" x2="7" y2="17" /><line x1="17" y1="7" x2="19.1" y2="4.9" />
  </svg>
);

export const IconMoon = () => (
  <svg {...base}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
);

export const IconGrid = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

export const IconBox = () => (
  <svg {...base}>
    <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
    <polyline points="3 8 12 13 21 8" />
    <line x1="12" y1="13" x2="12" y2="21" />
  </svg>
);

export const IconShield = () => (
  <svg {...base}><path d="M12 22s8-3 8-10V6l-8-4-8 4v6c0 7 8 10 8 10z" /><polyline points="9 12 11 14 15 9" /></svg>
);

export const IconStar = () => (
  <svg {...base.replace('1.8', '1.5')}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);

export const IconPlus = () => (
  <svg {...base}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);

export const IconTrash = () => (
  <svg {...base}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
);

export const IconEdit = () => (
  <svg {...base}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
);

export const IconFilter = () => (
  <svg {...base}><polygon points="22 3 2 3 10 12.5 10 19 14 21 14 12.5 22 3" /></svg>
);

export const IconArrowRight = () => (
  <svg {...base}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);

export const IconChevronLeft = () => (
  <svg {...base}><polyline points="15 18 9 12 15 6" /></svg>
);

export const IconChevronRight = () => (
  <svg {...base}><polyline points="9 18 15 12 9 6" /></svg>
);

export const IconMenu = () => (
  <svg {...base}><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>
);

export const IconHome = () => (
  <svg {...base}><path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5z" /></svg>
);

export const IconCheck = () => (
  <svg {...base}><polyline points="4 12 10 18 20 6" /></svg>
);

export const IconClose = () => (
  <svg {...base}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);