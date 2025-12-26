import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import FeaturePage from "./pages/FeaturePage";
import RedirectPage from "./pages/RedirectPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/feature" replace />} />
        <Route path="/feature" element={<FeaturePage />} />
        <Route path="/redirect" element={<RedirectPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
