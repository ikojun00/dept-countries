import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CountriesPage from "./pages/CountriesPage";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROUTES } from "./constants/routes";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={token ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path={ROUTES.HOME}
        element={
          <ProtectedRoute>
            <CountriesPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
