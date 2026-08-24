import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import "./AdminLayout.css";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="admin-layout">
      <Sidebar collapsed={collapsed} />

      <div
        className={`admin-layout__main ${
          collapsed ? "admin-layout__main--collapsed" : ""
        }`}
      >
        <Header collapsed={collapsed} onToggleSidebar={() => setCollapsed((prev) => !prev)} />

        <main className="admin-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;