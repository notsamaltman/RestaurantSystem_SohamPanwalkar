import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import FeaturePage from "./pages/FeaturePage";
import RedirectPage from "./pages/AdminRegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RestaurantPageOne from "./pages/RestaurantPageOne";
import RestaurantPageTwo from "./pages/RestaurantPageTwo";
import RestaurantPageThree from "./pages/RestaurantPageThree";
import TablesQRPage from "./pages/TablesQRPage";
import OrderingPage from "./pages/customer/OrderPage";
import OrderManagementPage from "./pages/ManageRestaurantPage";
import OrderPlacedPage from "./pages/customer/OrderPlacedPage";
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
        <Route path="/register/restaurant-1" element={
          <ProtectedRoutes>
            <RestaurantPageOne/>
          </ProtectedRoutes>
        } />
        <Route path="/register/restaurant-2" element={
          <ProtectedRoutes>
            <RestaurantPageTwo/>
          </ProtectedRoutes>
        } />
        <Route path="/register/restaurant-3" element={
          <ProtectedRoutes>
            <RestaurantPageThree/>
          </ProtectedRoutes>
        } />
        <Route path="/dashboard/qrs" element={
          <ProtectedRoutes>
            <TablesQRPage/>
          </ProtectedRoutes>
        } />
        <Route path="/dashboard/manage" element={
          <ProtectedRoutes>
            <OrderManagementPage/>
          </ProtectedRoutes>
        } />
        <Route path="/customer/order/:restaurant_id/:table_id" element={
          <OrderingPage/>
        } />
        <Route path="/customer/order/:restaurant_id/:table_id/:order_id" element={
          <OrderPlacedPage/>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
