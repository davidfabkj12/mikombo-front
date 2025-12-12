import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';

const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/visites', label: 'Visites & Animaux' },
    { to: '/produits', label: 'Produits Bio' },
    { to: '/a-propos', label: 'À Propos' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="font-bold text-xl" style={{ fontFamily: 'Playfair Display' }}>Mikombo Park</span>
              <div className="w-100 h-100 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 flex items-center justify-center">
                  <img src="logo1.jpg" alt="Dreamcode Hub Logo" className="w-32 h-16 rounded-lg" />
                </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-medium transition-colors ${
                    isActive(link.to)
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                  data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/panier" className="relative" data-testid="cart-button">
                <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-primary transition-colors" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center" data-testid="cart-count">
                    {getItemCount()}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to={user.role === 'admin' ? '/admin' : '/mon-compte'}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                    data-testid="user-account-link"
                  >
                    <User className="w-5 h-5" />
                    <span>{user.prenom}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-secondary transition-colors"
                    data-testid="logout-button"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`font-medium transition-colors ${
                    isActive('/login')
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                  data-testid="login-button"
                >
                  Connexion
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-button"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t" data-testid="mobile-menu">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block py-2 ${
                    isActive(link.to) ? 'text-primary font-semibold' : 'text-gray-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t flex flex-col gap-2">
                <Link
                  to="/panier"
                  className="flex items-center gap-2 py-2 text-gray-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Panier ({getItemCount()})
                </Link>
                {user ? (
                  <>
                    <Link
                      to={user.role === 'admin' ? '/admin' : '/mon-compte'}
                      className="flex items-center gap-2 py-2 text-gray-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      Mon Compte
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 py-2 text-gray-600"
                    >
                      <LogOut className="w-5 h-5" />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="py-2 px-4 bg-primary text-white rounded-full text-center"
                    className="py-2 px-4 bg-primary text-gray rounded-full text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-brown text-white py-12" style={{ backgroundColor: 'var(--brown)' }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white" style={{ fontFamily: 'Playfair Display' }}>Mikombo Park</h3>
              <p className="text-gray-300">Parc agro-touristique près de Lubumbashi, RDC. Production bio et visite d'animaux.</p>
              <h3 className="text-xl font-bold mb-4 text-white" style={{ fontFamily: 'Playfair Display' }}>Park Mikombo</h3>
              <p className="text-gray-300">Park agro-touristique près de Lubumbashi, RDC. Production bio et visite d'animaux.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Liens Rapides</h4>
              <ul className="space-y-2">
                <li><Link to="/visites" className="text-gray-300 hover:text-white transition-colors">Visites</Link></li>
                <li><Link to="/produits" className="text-gray-300 hover:text-white transition-colors">Produits</Link></li>
                <li><Link to="/a-propos" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Contact</h4>
              <p className="text-gray-300">Email: info@mikombopark.com</p>
              <p className="text-gray-300">Tél: +243 XXX XXX XXX</p>
              <p className="text-gray-300">Lubumbashi, RDC</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-600 text-center text-gray-300">
            <p>&copy; 2024 Mikombo Park. Tous droits réservés.</p>
            <p>&copy; 2026 Mikombo Park. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
