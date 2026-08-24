import "./Header.css";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9Z" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.3l.06.06A1.65 1.65 0 0 0 8.92 4.7H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.3 9c.14.36.4.68.7.9" />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

const Header = ({ collapsed, onToggleSidebar }) => {
  return (
    <header className={`admin-header ${collapsed ? "admin-header--collapsed" : ""}`}>
      <div className="admin-header__left">
        <button type="button" className="admin-header__menu-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <MenuIcon />
        </button>

        <div className="admin-header__search">
          <SearchIcon />
          <input type="text" placeholder="Search here..." />
        </div>
      </div>

      <div className="admin-header__right">
        <button type="button" className="admin-header__icon-btn" aria-label="Notifications">
          <BellIcon />
          <span className="admin-header__badge">3</span>
        </button>

        <button type="button" className="admin-header__icon-btn" aria-label="Settings">
          <SettingsIcon />
        </button>

        <div className="admin-header__divider" />

        <div className="admin-header__profile">
          <div className="admin-header__avatar">A</div>
          <div className="admin-header__profile-text">
            <span className="admin-header__name">Admin</span>
            <span className="admin-header__role">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;