import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// ── Placeholder pages ──────────────────────────────────────────────────────
function LoginPage()    { return <div>Login Page</div>; }
function RegisterPage() { return <div>Register Page</div>; }
function BoardPage()    { return <div>Board Page</div>; }
// ──────────────────────────────────────────────────────────────────────────

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/board" element={<BoardPage />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/board" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
