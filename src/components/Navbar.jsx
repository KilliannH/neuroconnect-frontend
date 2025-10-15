// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-screen-lg mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          NeuroConnect
        </Link>

        <div className="space-x-4 text-sm sm:text-base">
          {isAuthenticated ? (
            <>
              <Link to="/feed" className="text-gray-700 hover:text-blue-600">Fil</Link>
              <span className="text-gray-600">{user?.username}</span>
              <button
                onClick={logout}
                className="text-red-600 hover:underline"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Connexion</Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-600">Inscription</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
