import { Suspense, lazy } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PuzzlePlayPage = lazy(() => import('./pages/PuzzlePlayPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const FeedPage = lazy(() => import('./pages/FeedPage'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
              <Route path="/feed" element={<PrivateRoute><FeedPage /></PrivateRoute>} />
              <Route path="/profile/:id" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />
              <Route path="/puzzle/:id" element={<PrivateRoute><PuzzlePlayPage /></PrivateRoute>} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
