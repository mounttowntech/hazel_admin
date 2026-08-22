
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "../../src/pages/auth/Login";
import VerifyOTP from "../../src/pages/auth/VerifyOTP";

const AppRoutes = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* AUTH */}

        <Route
          path="/login"
          element={<Login />}
        />

       <Route
        path="/verify-otp"
        element={<VerifyOTP />}
      />

        {/* HOME */}

        <Route
          path="/"
          element={
            <div>
              Hazel E-Commerce Home
            </div>
          }
        />

      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;