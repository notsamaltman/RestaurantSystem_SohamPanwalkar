import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import FeaturePage from "./pages/FeaturePage";
import RedirectPage from "./pages/AdminRegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { ProtectedRoutes } from "./utils/auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/feature" replace />} />
        <Route path="/feature" element={<FeaturePage />} />
        <Route path="/register" element={<RedirectPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoutes>
            <DashboardPage/>
          </ProtectedRoutes>
        } />
        <Route path="/login" element={ <LoginPage/> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
