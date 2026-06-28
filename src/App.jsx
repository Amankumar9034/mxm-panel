import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AppUsersPage from './pages/AppUsersPage';
import CategoryPage from './pages/CategoryPage';
import ProductListPage from './pages/ProductListPage';
import ReportedListPage from './pages/ReportedListPage';
import ActionHistoryPage from './pages/ActionHistoryPage';
import ChangePasswordPage from './pages/ChangePasswordPage';

function AppRoutes() {
  const { isLoggedIn } = useAuth();
  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><AppUsersPage /></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><ProductListPage /></ProtectedRoute>} />
      <Route path="/reported" element={<ProtectedRoute><ReportedListPage /></ProtectedRoute>} />
      <Route path="/action-history" element={<ProtectedRoute><ActionHistoryPage /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

