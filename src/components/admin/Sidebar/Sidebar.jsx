import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

/* ---- lightweight inline icons (no external icon library) ---- */
const Icon = ({ d, viewBox = "0 0 24 24" }) => (
  <svg viewBox={viewBox} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  dashboard: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z",
  catalog: "M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z",
  inventory: "M3 7l9-4 9 4-9 4-9-4Zm0 0v10l9 4 9-4V7M12 11v10",
  orders: "M6 3h9l3 3v15H6V3Zm3 6h6M9 12h6M9 15h4",
  customers: "M17 20v-2a4 4 0 0 0-3-3.87M9 20v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2M13 10a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z",
  coupons: "M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Zm6-2v12",
  discounts: "M20 12 12 20l-8-8V4h8l8 8ZM8 8h.01",
  banners: "M4 4h16v13l-8 3-8-3V4Z",
  reviews: "m12 3 2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L12 3Z",
  payments: "M3 7h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Zm0 0 1.6-3H19l1.6 3M3 11h18",
  reports: "M4 20V4m5 16V9m5 11V6m5 14v-8",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3a7.96 7.96 0 0 0-.4-2.5l1.9-1.5-2-3.5-2.3.9a8 8 0 0 0-2.2-1.3L14.5 2h-5l-.5 2.1a8 8 0 0 0-2.2 1.3l-2.3-.9-2 3.5 1.9 1.5A7.96 7.96 0 0 0 4 12c0 .85.14 1.7.4 2.5l-1.9 1.5 2 3.5 2.3-.9c.66.56 1.4 1 2.2 1.3l.5 2.1h5l.5-2.1a8 8 0 0 0 2.2-1.3l2.3.9 2-3.5-1.9-1.5c.26-.8.4-1.65.4-2.5Z",
  chevron: "m9 6 6 6-6 6",
  dot: "M12 8v8M8 12h8",
};

const catalogChildren = [
  { label: "Categories", to: "/admin/catalog/categories" },
  { label: "Brands", to: "/admin/catalog/brands" },
  { label: "Product Length", to: "/admin/catalog/product-length" },
  { label: "Neck Patterns", to: "/admin/catalog/neck-patterns" },
  { label: "Products", to: "/admin/catalog/products" },
  { label: "Product Variants", to: "/admin/catalog/product-variants" },
  { label: "Sizes", to: "/admin/catalog/sizes" },
  { label: "Colors", to: "/admin/catalog/colors" },
  { label: "Product Images", to: "/admin/catalog/product-images" },
];

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: icons.dashboard },
  { label: "Catalog", icon: icons.catalog, children: catalogChildren },
  { label: "Inventory", to: "/admin/inventory", icon: icons.inventory },
  { label: "Orders", to: "/admin/orders", icon: icons.orders },
  { label: "Customers", to: "/admin/customers", icon: icons.customers },
  { label: "Coupons", to: "/admin/coupons", icon: icons.coupons },
  { label: "Discounts", to: "/admin/discounts", icon: icons.discounts },
  { label: "Banners", to: "/admin/banners", icon: icons.banners },
  { label: "Reviews", to: "/admin/reviews", icon: icons.reviews },
  { label: "Payments", to: "/admin/payments", icon: icons.payments },
  { label: "Reports", to: "/admin/reports", icon: icons.reports },
  { label: "Settings", to: "/admin/settings", icon: icons.settings },
];

const Sidebar = ({ collapsed }) => {
  const [openMenu, setOpenMenu] = useState("Catalog");

  const toggleMenu = (label) => {
    setOpenMenu((prev) => (prev === label ? "" : label));
  };

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar__brand">
        <span className="sidebar__brand-icon">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 2 5 7v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V7l-7-5Z" />
          </svg>
        </span>
        {!collapsed && (
          <span className="sidebar__brand-text">
            HAZEL
            <small>E-COMMERCE ADMIN</small>
          </span>
        )}
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) =>
          item.children ? (
            <div className="sidebar__group" key={item.label}>
              <button
                type="button"
                className={`sidebar__item sidebar__item--parent ${
                  openMenu === item.label ? "is-open" : ""
                }`}
                onClick={() => toggleMenu(item.label)}
              >
                <Icon d={item.icon} />
                {!collapsed && <span className="sidebar__label">{item.label}</span>}
                {!collapsed && (
                  <span className="sidebar__chevron">
                    <Icon d={icons.chevron} />
                  </span>
                )}
              </button>

              {!collapsed && openMenu === item.label && (
                <div className="sidebar__submenu">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.label}
                      to={child.to}
                      className={({ isActive }) =>
                        `sidebar__subitem ${isActive ? "is-active" : ""}`
                      }
                    >
                      <Icon d={icons.dot} />
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `sidebar__item ${isActive ? "is-active" : ""}`
              }
            >
              <Icon d={item.icon} />
              {!collapsed && <span className="sidebar__label">{item.label}</span>}
            </NavLink>
          )
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;