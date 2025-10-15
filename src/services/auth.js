// src/services/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth'; // adapte selon ton backend

export async function login(email, password) {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  const token = response.data;
  localStorage.setItem('token', token);
  return token;
}

export async function register(username, email, password) {
  const response = await axios.post(`${API_URL}/register`, {
    username,
    email,
    password
  });
  return response.data;
}
