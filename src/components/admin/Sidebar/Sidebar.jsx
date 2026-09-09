
import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  Home,
  LayoutGrid,
  ChevronDown,
  Archive,
  ClipboardList,
  Users,
  Ticket,
  Tag,
  
  Star,
  CreditCard,
  BarChart2,
  Settings,
  Layers,
} from "lucide-react";

import "./Sidebar.css";

// ==========================================================
// SIDEBAR NAVIGATION CONFIG
// ==========================================================

const navConfig = [
  // ========================================================
  // DASHBOARD
  // ========================================================

  {
    label: "Dashboard",
    icon: Home,
    path: "/admin/dashboard",
  },

  // ========================================================
  // CATALOG
  // ========================================================

  {
    label: "Catalog",
    icon: LayoutGrid,
    children: [
      {
        label: "Categories",
        path: "/admin/catalog/categories",
      },
      {
        label: "Sub Categories",
        path: "/admin/catalog/subcategories",
      },
      {
        label: "Brands",
        path: "/admin/catalog/brands",
      },
      {
        label: "Product Length",
        path: "/admin/catalog/product-length",
      },
      {
        label: "Products",
        path: "/admin/catalog/products",
      },
      {
        label: "Product Variants",
        path: "/admin/catalog/product-variants",
      },
      {
        label: "Sizes",
        path: "/admin/catalog/size",
      },
      {
        label: "Colors",
        path: "/admin/catalog/colors",
      },
    ],
  },

  // ========================================================
  // INVENTORY
  // ========================================================

  {
    label: "Inventory",
    icon: Archive,
    children: [
      {
        label: "Stock Overview",
        path: "/admin/inventory/stock",
      },
      {
        label: "Low Stock",
        path: "/admin/inventory/low-stock",
      },
    ],
  },

  // ========================================================
  // ORDERS
  // ========================================================

  {
    label: "Orders",
    icon: ClipboardList,
    path: "/admin/orders",
  },

  // ========================================================
  // CUSTOMERS
  // ========================================================

  {
    label: "Customers",
    icon: Users,
    path: "/admin/customers",
  },

  // ========================================================
  // COUPONS
  // ========================================================

  {
    label: "Coupons",
    icon: Ticket,
    path: "/admin/coupons",
  },

  // ========================================================
  // DISCOUNTS
  // ========================================================

  {
    label: "Discounts",
    icon: Tag,
    path: "/admin/discounts",
  },

  // ========================================================
  // MERCHANDISING
  // ========================================================

  {
    label: "Promotions",
    icon: Layers,
    children: [
      {
        label: "Banners",
        path: "/admin/promotions/banners",
      },
      {
        label: "Banner Products",
        path: "/admin/promotions/banner-products",
      },
      {
        label: "New Arrivals",
        path: "/admin/promotions/new-arrivals",
      },
      {
        label: "Trending Products",
        path: "/admin/promotions/trending-products",
      },
    ],
  },

  // ========================================================
  // REVIEWS
  // ========================================================

  {
    label: "Reviews",
    icon: Star,
    path: "/admin/reviews",
  },

  // ========================================================
  // PAYMENTS
  // ========================================================

  {
    label: "Payments",
    icon: CreditCard,
    path: "/admin/payments",
  },

  // ========================================================
  // REPORTS
  // ========================================================

  {
    label: "Reports",
    icon: BarChart2,
    children: [
      {
        label: "Sales Report",
        path: "/admin/reports/sales",
      },
      {
        label: "Customer Report",
        path: "/admin/reports/customers",
      },
    ],
  },

  // ========================================================
  // SETTINGS
  // ========================================================

  {
    label: "Settings",
    icon: Settings,
    children: [
      {
        label: "General",
        path: "/admin/settings/general",
      },
      {
        label: "Roles & Permissions",
        path: "/admin/settings/roles",
      },
    ],
  },
];

// ==========================================================
// SIDEBAR COMPONENT
// ==========================================================

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside className="hz-sidebar">

      {/* ================================================== */}
      {/* LOGO */}
      {/* ================================================== */}

      <div className="hz-sidebar__logo">

        <div className="hz-sidebar__logo-icon">

          {/* Dress silhouette */}

          <svg
            viewBox="0 0 40 48"
            className="hz-sidebar__dress-icon"
          >
            <circle
              cx="20"
              cy="8"
              r="5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />

            <path
              d="M13 13 L9 44 H31 L27 13 C25 16 15 16 13 13 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>

        </div>

        <div className="hz-sidebar__logo-text">

          <span className="hz-sidebar__logo-title">
            HAZEL
          </span>

          <span className="hz-sidebar__logo-subtitle">
            E-COMMERCE ADMIN
          </span>

        </div>

      </div>

      {/* ================================================== */}
      {/* NAVIGATION */}
      {/* ================================================== */}

      <nav className="hz-sidebar__nav">

        <ul className="hz-sidebar__list">

          {navConfig.map((item) => {

            const Icon = item.icon;

            const hasChildren = Boolean(item.children);

            const isOpen = Boolean(
              openMenus[item.label]
            );

            // ==================================================
            // NORMAL MENU ITEM
            // ==================================================

            if (!hasChildren) {
              return (
                <li
                  key={item.label}
                  className="hz-sidebar__item"
                >

                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      "hz-sidebar__link" +
                      (isActive
                        ? " hz-sidebar__link--active"
                        : "")
                    }
                  >

                    <Icon
                      size={18}
                      className="hz-sidebar__icon"
                    />

                    <span>{item.label}</span>

                  </NavLink>

                </li>
              );
            }

            // ==================================================
            // PARENT MENU WITH CHILDREN
            // ==================================================

            return (
              <li
                key={item.label}
                className="hz-sidebar__item"
              >

                <button
                  type="button"
                  className="hz-sidebar__link hz-sidebar__link--parent"
                  onClick={() =>
                    toggleMenu(item.label)
                  }
                  aria-expanded={isOpen}
                >

                  <Icon
                    size={18}
                    className="hz-sidebar__icon"
                  />

                  <span>{item.label}</span>

                  <ChevronDown
                    size={16}
                    className={
                      "hz-sidebar__chevron" +
                      (isOpen
                        ? " hz-sidebar__chevron--open"
                        : "")
                    }
                  />

                </button>

                {/* ================================================== */}
                {/* SUB MENU */}
                {/* ================================================== */}

                <ul
                  className={
                    "hz-sidebar__submenu" +
                    (isOpen
                      ? " hz-sidebar__submenu--open"
                      : "")
                  }
                >

                  {item.children.map(
                    (child) => (
                      <li key={child.label}>

                        <NavLink
                          to={child.path}
                          className={({ isActive }) =>
                            "hz-sidebar__sublink" +
                            (isActive
                              ? " hz-sidebar__sublink--active"
                              : "")
                          }
                        >
                          {child.label}
                        </NavLink>

                      </li>
                    )
                  )}

                </ul>

              </li>
            );
          })}

        </ul>

      </nav>

    </aside>
  );
};

export default Sidebar;
