import {
  Routes,
  Route,
} from "react-router-dom";

import Login from "../pages/auth/Login";
import VerifyOTP from "../pages/auth/VerifyOTP";

import AdminLayout from "../components/admin/Layout/AdminLayout";

import Dashboard from "../pages/dashboard/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>

      {/* =================================
          AUTH ROUTES
      ================================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/verify-otp"
        element={<VerifyOTP />}
      />

      {/* =================================
          ADMIN ROUTES
      ================================= */}

      <Route element={<AdminLayout />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

      </Route>

      {/* =================================
          DEFAULT ROUTE
      ================================= */}

      {/* 
      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />
      */}

    </Routes>
  );
};

export default AppRoutes;