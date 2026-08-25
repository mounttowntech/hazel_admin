import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import VerifyOTP from "../pages/auth/VerifyOTP";

import AdminLayout from "../components/admin/Layout/AdminLayout";

import Dashboard from "../pages/dashboard/Dashboard";
import CategoryList from "../pages/admin/catalog/categories/CategoryList";
import BrandList from "../pages/admin/catalog/brands/BrandList";

const AppRoutes = () => {
  return (
    <Routes>
      {/* =================================
          AUTH ROUTES
      ================================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      {/* =================================
          ADMIN ROUTES
      ================================= */}
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/catalog/categories" element={<CategoryList />} />
        <Route path="/admin/catalog/brands" element={<BrandList />} />
        {/* add more admin routes here, all under this same AdminLayout wrapper */}
      </Route>

      {/* =================================
          DEFAULT ROUTE
      ================================= */}
      {/* 
      <Route path="*" element={<Navigate to="/login" replace />} />
      */}
    </Routes>
  );
};

export default AppRoutes;