import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const cartCount = (() => {
    try { return JSON.parse(localStorage.getItem('wambux_cart') || '[]').length; }
    catch { return 0; }
  })();

  const handleLogout = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    logout();
    setMenuOpen(false);
    navigate('/', { replace: true });
  };

  return (
    <div className="navigation w-nav" role="banner">
      <div className="navigation-wrap">
        {/* Logo */}
        <Link to="/" className="logo-link w-nav-brand">
          <img
            src="/images/wambuxstore_logo.jpg"
            width="108"
            alt="WambuXtore Logo"
            className="logo-image"
          />
        </Link>

        {/* Center nav */}
        <div className="menu">
          <nav role="navigation" className="navigation-items w-nav-menu">
            <Link
              to="/about"
              className={`navigation-item w-nav-link${isActive('/about') ? ' w--current' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/products"
              className={`navigation-item w-nav-link${isActive('/products') ? ' w--current' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/contact"
              className={`navigation-item w-nav-link${isActive('/contact') ? ' w--current' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/wishlist"
              className={`navigation-item w-nav-link${isActive('/wishlist') ? ' w--current' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Wishlist
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <div
            className={`menu-button w-nav-button${menuOpen ? ' w--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            role="button"
            tabIndex={0}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setMenuOpen((open) => !open);
              }
            }}
          >
            <img src="/images/menu-icon.png" width="22" alt="Menu" className="menu-icon" />
          </div>
        </div>

        {/* Right side actions */}
        <div className="nav-actions">
          {/* Cart */}
          <Link
            to="/checkout"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              background: '#f0f0f0',
              borderRadius: '50%',
              textDecoration: 'none',
              fontSize: '16px',
            }}
            title="Checkout"
          >
            🛒
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#1a1b1f',
                color: '#fff',
                fontSize: '10px',
                fontWeight: '700',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isLoggedIn ? (
            <div className="nav-user-actions">
              <span className="nav-username">
                Hi, {user.username}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="logout-button"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="primary-button cc-contact-us w-inline-block"
            >
              <div>Sign In</div>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="w-nav-overlay" style={{ display: 'block' }}>
          <nav role="navigation" className="navigation-items w-nav-menu" style={{ display: 'block' }}>
            <Link to="/about" className="navigation-item w-nav-link" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/products" className="navigation-item w-nav-link" onClick={() => setMenuOpen(false)}>Products</Link>
            <Link to="/contact" className="navigation-item w-nav-link" onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link to="/wishlist" className="navigation-item w-nav-link" onClick={() => setMenuOpen(false)}>Wishlist</Link>
            {isLoggedIn ? (
              <button
                type="button"
                className="navigation-item w-nav-link"
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
              >
                Logout
              </button>
            ) : (
              <Link to="/auth" className="navigation-item w-nav-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

export default Navbar;
