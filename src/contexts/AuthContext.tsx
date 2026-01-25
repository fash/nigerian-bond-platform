"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the User type
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bvn?: string;
  walletBalance: number;
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (userData: Omit<User, 'id' | 'joinedAt'>) => void;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Check Local Storage on Load
  useEffect(() => {
    const storedUser = localStorage.getItem('bond_user_session');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }
    setLoading(false);
  }, []);

  // 2. Register
  const register = (userData: Omit<User, 'id' | 'joinedAt'>) => {
    const newSession: User = { 
      ...userData, 
      id: `user_${Date.now()}`, 
      joinedAt: new Date().toISOString() 
    };
    
    localStorage.setItem('bond_user_session', JSON.stringify(newSession));
    setUser(newSession);
  };

  // 3. Login
  const login = (email: string) => {
    const storedUserStr = localStorage.getItem('bond_user_session');
    
    if (!storedUserStr) {
      throw new Error("No account found. Please register first.");
    }

    const storedUser: User = JSON.parse(storedUserStr);

    if (storedUser.email && storedUser.email.toLowerCase() === email.toLowerCase()) {
      setUser(storedUser);
    } else {
      throw new Error("Invalid email or user does not exist.");
    }
  };

  
  const logout = () => {
    localStorage.removeItem('bond_user_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};