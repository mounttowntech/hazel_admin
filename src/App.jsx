// import Header from "./components/admin/Header/Header";
// import Sidebar from "./components/admin/Sidebar/Sidebar";
import AppRoutes from "../src/routes/AppRoutes";
import { GoogleOAuthProvider } from "@react-oauth/google";
const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID;
function App() {
  return (
    <>
     <GoogleOAuthProvider
         clientId={googleClientId}
       >
    <div className="app-layout">
      {/* <Sidebar /> */}

      <div className="main-section">
        {/* <Header /> */}

        <main className="main-content">
          <AppRoutes />
        </main>
      </div>
    </div>
    </GoogleOAuthProvider>
    </>
  );
}

export default App;