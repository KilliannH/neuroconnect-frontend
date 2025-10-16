// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false); // 🔓 pas de token → fin du chargement
      return;
    }

    api.get('/users/me')
      .then(res => {
        console.log(res.data);
        setIsAuthenticated(true);
        setUser(res.data);
      })
      .catch(() => {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false)); // ✅ fin du chargement
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setLoading(true);
    api.get('/users/me')
      .then(res => setUser(res.data))
      .finally(() => setLoading(false));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
