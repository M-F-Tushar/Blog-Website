/**
 * Centralized cosmic class names for admin components.
 * Single source of truth to avoid duplication across 30+ admin files.
 */

export const cosmic = {
  // ─── Layout & Containers ──────────────────────────────────
  /** Main page container with glass effect */
  container: 'max-w-7xl mx-auto admin-glass-cosmic rounded-2xl p-8',

  /** Smaller container for forms/settings */
  containerSm: 'max-w-4xl mx-auto admin-glass-cosmic rounded-2xl p-8',

  /** Inner section card (nested inside a container) */
  card: 'admin-glass rounded-xl p-6',

  /** Elevated card with cosmic cyan tint */
  cardCosmic:
    'admin-glass-cosmic rounded-xl p-6 hover:border-primary-500/20 transition-all duration-300',

  /** Elevated card with nebula violet tint */
  cardNebula: 'admin-glass-nebula rounded-xl p-6',

  // ─── Typography ───────────────────────────────────────────
  /** Primary page heading */
  pageTitle: 'text-3xl font-bold font-serif admin-text-gradient',

  /** Section heading inside cards */
  sectionTitle: 'text-2xl font-bold font-serif text-secondary-50',

  /** Sub-section heading */
  subTitle: 'text-xl font-semibold text-secondary-100',

  /** Section label (small uppercase) */
  sectionLabel: 'text-xs font-semibold uppercase tracking-wider text-secondary-500',

  /** Body text */
  bodyText: 'text-secondary-300',

  /** Muted/helper text */
  mutedText: 'text-sm text-secondary-500',

  // ─── Form Elements ────────────────────────────────────────
  /** Standard text input */
  input:
    'w-full px-4 py-2.5 bg-elevated/80 border border-white/10 rounded-lg text-secondary-200 placeholder-secondary-500 admin-input-glow focus:border-primary-500/50 focus:outline-none transition-all duration-200',

  /** Textarea */
  textarea:
    'w-full px-4 py-2.5 bg-elevated/80 border border-white/10 rounded-lg text-secondary-200 placeholder-secondary-500 admin-input-glow focus:border-primary-500/50 focus:outline-none transition-all duration-200 resize-y min-h-[100px]',

  /** Select dropdown */
  select:
    'w-full px-4 py-2.5 bg-elevated/80 border border-white/10 rounded-lg text-secondary-200 admin-input-glow focus:border-primary-500/50 focus:outline-none transition-all duration-200',

  /** Form label */
  label: 'block text-sm font-medium text-secondary-300 mb-2',

  /** Form field wrapper */
  fieldGroup: 'space-y-1.5',

  // ─── Buttons ──────────────────────────────────────────────
  /** Primary action button (cyan gradient) */
  buttonPrimary:
    'px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 hover:from-primary-500 hover:to-primary-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',

  /** Secondary button */
  buttonSecondary:
    'px-6 py-2.5 bg-elevated border border-white/10 text-secondary-200 font-medium rounded-lg hover:border-primary-500/30 hover:text-primary-300 transition-all duration-200',

  /** Danger button */
  buttonDanger:
    'px-6 py-2.5 bg-error-500/10 border border-error-500/20 text-error-400 font-medium rounded-lg hover:bg-error-500/20 hover:border-error-500/30 transition-all duration-200',

  /** Small inline button */
  buttonSmall:
    'px-3 py-1.5 text-sm bg-elevated/80 border border-white/10 text-secondary-300 rounded-lg hover:border-primary-500/30 hover:text-primary-300 transition-all duration-200',

  /** Icon-only button */
  buttonIcon:
    'p-2 rounded-lg bg-elevated/50 border border-white/[0.06] text-secondary-400 hover:text-primary-300 hover:border-primary-500/30 transition-all duration-200',

  // ─── Table ────────────────────────────────────────────────
  /** Table wrapper */
  tableWrapper: 'overflow-x-auto admin-scrollbar',

  /** Table element */
  table: 'min-w-full divide-y divide-white/[0.06]',

  /** Table header row */
  tableHead: 'bg-elevated/50',

  /** Table header cell */
  tableHeadCell:
    'px-6 py-3 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider',

  /** Table body */
  tableBody: 'divide-y divide-white/[0.06]',

  /** Table row */
  tableRow: 'hover:bg-white/[0.03] transition-colors duration-150',

  /** Table cell */
  tableCell: 'px-6 py-4 whitespace-nowrap text-sm text-secondary-300',

  // ─── Badges ───────────────────────────────────────────────
  /** Published/Active badge */
  badgeSuccess:
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500/10 text-primary-300 border border-primary-500/20',

  /** Draft/Pending badge */
  badgeWarning:
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-500/10 text-gold-300 border border-gold-500/20',

  /** Error/Archived badge */
  badgeDanger:
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-500/10 text-error-300 border border-error-500/20',

  /** Neutral badge */
  badgeNeutral:
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-500/10 text-secondary-300 border border-secondary-500/20',

  /** Accent badge */
  badgeAccent:
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-500/10 text-accent-300 border border-accent-500/20',

  // ─── Tabs ─────────────────────────────────────────────────
  /** Active tab */
  tabActive:
    'px-4 py-2 text-sm font-medium rounded-lg bg-primary-500/15 text-primary-300 border border-primary-500/30',

  /** Inactive tab */
  tabInactive:
    'px-4 py-2 text-sm font-medium rounded-lg text-secondary-400 border border-white/[0.06] hover:border-white/10 hover:text-secondary-200 transition-all duration-200',

  // ─── Alerts ───────────────────────────────────────────────
  /** Success alert */
  alertSuccess: 'p-4 rounded-xl bg-success-500/10 border border-success-500/20 text-success-300',

  /** Error alert */
  alertError: 'p-4 rounded-xl bg-error-500/10 border border-error-500/20 text-error-300',

  /** Warning alert */
  alertWarning: 'p-4 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-300',

  /** Info alert */
  alertInfo: 'p-4 rounded-xl bg-info-500/10 border border-info-500/20 text-info-300',

  // ─── Sidebar ──────────────────────────────────────────────
  /** Sidebar container */
  sidebar:
    'w-64 bg-abyss/80 backdrop-blur-xl border-r border-white/[0.06] flex-shrink-0 flex flex-col',

  /** Sidebar brand area */
  sidebarBrand: 'p-6 border-b border-white/[0.06]',

  /** Sidebar nav link (active) */
  navActive:
    'block w-full text-left px-4 py-2.5 text-sm font-medium text-primary-300 bg-primary-500/10 border-l-2 border-primary-400 admin-active-glow transition-all duration-200',

  /** Sidebar nav link (inactive) */
  navInactive:
    'block w-full text-left px-4 py-2.5 text-sm text-secondary-400 border-l-2 border-transparent hover:bg-white/[0.04] hover:text-secondary-200 transition-all duration-200',

  // ─── Action Links ─────────────────────────────────────────
  /** Edit link */
  linkEdit: 'text-primary-400 hover:text-primary-300 transition-colors duration-150',

  /** Delete link */
  linkDelete: 'text-error-400 hover:text-error-300 transition-colors duration-150',

  /** Featured star (active) */
  starActive: 'text-gold-400 hover:text-gold-300 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]',

  /** Featured star (inactive) */
  starInactive: 'text-secondary-600 hover:text-gold-400 transition-colors duration-200',

  // ─── Misc ─────────────────────────────────────────────────
  /** Cosmic divider line */
  divider: 'admin-cosmic-divider my-6',

  /** Empty state wrapper */
  emptyState: 'text-center py-12 text-secondary-500',

  /** Loading overlay */
  loadingOverlay: 'flex items-center justify-center min-h-[200px]',

  /** Tag chip */
  tag: 'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-elevated border border-white/[0.06] text-secondary-300',
} as const;

export default cosmic;
