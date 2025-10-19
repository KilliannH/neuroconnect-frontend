import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';

import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🛡️ Route protégée */}
        <Route
          path="/feed"
          element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          }
        />
        <Route 
          path='/posts/:id' 
          element={
          <PrivateRoute>
            <PostDetail />
          </PrivateRoute>
          }
        />
        <Route 
          path="/profile"
          element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
