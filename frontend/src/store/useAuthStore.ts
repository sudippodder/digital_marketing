import { create } from 'zustand';
import { User, Client } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  activeClient: Client | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setActiveClient: (client: Client | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  activeClient: JSON.parse(localStorage.getItem('activeClient') || 'null'),

  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user });
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },

  setActiveClient: (client) => {
    if (client) {
      localStorage.setItem('activeClient', JSON.stringify(client));
    } else {
      localStorage.removeItem('activeClient');
    }
    set({ activeClient: client });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('activeClient');
    set({ user: null, token: null, activeClient: null });
  },
}));
