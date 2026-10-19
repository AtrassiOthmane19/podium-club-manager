import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { can } from './config/roles';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import MemberProfile from './pages/MemberProfile';
import Subscriptions from './pages/Subscriptions';
import Payments from './pages/Payments';
import Attendance from './pages/Attendance';
import Users from './pages/Users';

function ProtectedRoute({ children, page }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#0A0A0A', color: '#F5F5F5' }}>
      Chargement...
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (page && !can(user, page)) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard"     element={<ProtectedRoute page="dashboard">    <Dashboard />     </ProtectedRoute>} />
      <Route path="/members"       element={<ProtectedRoute page="members">      <Members />       </ProtectedRoute>} />
      <Route path="/members/:id"   element={<ProtectedRoute page="members">      <MemberProfile /> </ProtectedRoute>} />
      <Route path="/subscriptions" element={<ProtectedRoute page="subscriptions"><Subscriptions /> </ProtectedRoute>} />
      <Route path="/payments"      element={<ProtectedRoute page="payments">     <Payments />      </ProtectedRoute>} />
      <Route path="/attendance"    element={<ProtectedRoute page="attendance">   <Attendance />    </ProtectedRoute>} />
      <Route path="/users"         element={<ProtectedRoute page="users">        <Users />         </ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
