import { Suspense, lazy } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import DarkModeToggle from './components/DarkModeToggle';
import PrivateRoute from './components/PrivateRoute';
import SkipToContent from './components/SkipToContent';
import { AuthProvider } from './context/AuthContext';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PuzzlePlayPage = lazy(() => import('./pages/PuzzlePlayPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const FeedPage = lazy(() => import('./pages/FeedPage'));
const Error404 = lazy(() => import('./pages/Error404'));
const Error500 = lazy(() => import('./pages/Error500'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <SkipToContent />
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-16 sm:pb-0">
          <header className="flex justify-end p-4">
            <DarkModeToggle />
          </header>
          <main id="main-content" tabIndex={-1} className="outline-none">
            <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path="/feed" element={<PrivateRoute><FeedPage /></PrivateRoute>} />
                <Route path="/profile/:id" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />
                <Route path="/puzzle/:id" element={<PrivateRoute><PuzzlePlayPage /></PrivateRoute>} />
                <Route path="/500" element={<Error500 />} />
                <Route path="*" element={<Error404 />} />
              </Routes>
            </Suspense>
          </main>
          <BottomNav />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
