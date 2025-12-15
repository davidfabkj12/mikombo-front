import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import '@/App.css';
import { Toaster } from '@/components/ui/sonner';

// Context
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Public Pages
import Home from '@/pages/Home';
import Visites from '@/pages/Visites';
import Produits from '@/pages/Produits';
import APropos from '@/pages/APropos';
import Panier from '@/pages/Panier';
import Reserver from '@/pages/Reserver';

// Auth Pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import MonCompte from '@/pages/client/MonCompte';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProduits from '@/pages/admin/AdminProduits';
import AdminAnimaux from '@/pages/admin/AdminAnimaux';
import AdminCultures from '@/pages/admin/AdminCultures';
import AdminReservations from '@/pages/admin/AdminReservations';
import AdminCommandes from '@/pages/admin/AdminCommandes';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Protected Route
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="visites" element={<Visites />} />
                <Route path="produits" element={<Produits />} />
                <Route path="a-propos" element={<APropos />} />
                <Route path="panier" element={<Panier />} />
                <Route path="reserver" element={<Reserver />} />
              </Route>
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Client Routes */}
              <Route path="/mon-compte" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<MonCompte />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="produits" element={<AdminProduits />} />
                <Route path="animaux" element={<AdminAnimaux />} />
                <Route path="cultures" element={<AdminCultures />} />
                <Route path="reservations" element={<AdminReservations />} />
                <Route path="commandes" element={<AdminCommandes />} />
              </Route>
            </Routes>
            <Toaster position="top-right" richColors />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
