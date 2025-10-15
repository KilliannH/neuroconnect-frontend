// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, LogIn, LogOut, User, Newspaper } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-screen-lg mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <Home className="w-5 h-5" />
          NeuroConnect
        </Link>

        {/* Nav items */}
        <div className="flex items-center gap-4 text-sm sm:text-base">
          {isAuthenticated ? (
            <>
              <Link to="/feed" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
                <Newspaper className="w-4 h-4" />
                Fil
              </Link>
              <span className="flex items-center gap-1 text-gray-600">
                <User className="w-4 h-4" />
                {user?.username}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1 text-red-600 hover:underline"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
                <LogIn className="w-4 h-4" />
                Connexion
              </Link>
              <Link to="/register" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
                <User className="w-4 h-4" />
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
