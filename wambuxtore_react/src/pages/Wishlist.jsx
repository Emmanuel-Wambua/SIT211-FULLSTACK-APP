import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';
const PLACEHOLDER = 'https://cdn.prod.website-files.com/plugins/Basic/assets/placeholder.60f9b1840c.svg';

const styles = {
  emptyWrap: {
    textAlign: 'center',
    padding: '80px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  emptyIcon: {
    fontSize: '56px',
    lineHeight: 1,
  },
  emptyTitle: {
    fontFamily: 'Oswald, sans-serif',
    fontSize: '24px',
    fontWeight: '500',
    color: '#1a1b1f',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    margin: 0,
  },
  emptyText: {
    color: '#888',
    fontSize: '14px',
    maxWidth: '320px',
    lineHeight: '1.7',
    margin: 0,
  },
  browseBtn: {
    display: 'inline-block',
    marginTop: '8px',
    padding: '12px 28px',
    background: '#1a1b1f',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    textDecoration: 'none',
    fontFamily: 'Montserrat, sans-serif',
  },
  card: {
    background: '#fff',
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1px solid #ebebeb',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  },
  imageWrap: {
    width: '100%',
    height: '220px',
    background: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    padding: '12px',
  },
  cardBody: {
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  cardName: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '15px',
    fontWeight: '700',
    color: '#1a1b1f',
    margin: 0,
  },
  cardDesc: {
    fontSize: '13px',
    color: '#888',
    lineHeight: '1.6',
    margin: 0,
    flex: 1,
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '12px',
    flexWrap: 'wrap',
  },
  addToCartBtn: {
    flex: 1,
    padding: '10px 16px',
    background: '#1a1b1f',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'Montserrat, sans-serif',
    transition: 'opacity 0.2s',
  },
  removeBtn: {
    padding: '10px 14px',
    background: '#fff',
    color: '#e53935',
    border: '1.5px solid #ffd0d0',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'Montserrat, sans-serif',
    transition: 'all 0.2s',
  },
  loginPrompt: {
    background: '#1a1b1f',
    color: '#fff',
    borderRadius: '14px',
    padding: '48px 32px',
    textAlign: 'center',
    maxWidth: '420px',
    margin: '60px auto',
  },
  loginTitle: {
    fontFamily: 'Oswald, sans-serif',
    fontSize: '24px',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    margin: '0 0 12px',
  },
  loginText: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '24px',
    lineHeight: '1.7',
  },
  loginBtn: {
    display: 'inline-block',
    padding: '12px 32px',
    background: '#fff',
    color: '#1a1b1f',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    textDecoration: 'none',
    fontFamily: 'Montserrat, sans-serif',
  },
  summaryBar: {
    background: '#1a1b1f',
    borderRadius: '12px',
    padding: '20px 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '40px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  summaryText: {
    color: '#fff',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '14px',
    fontWeight: '600',
  },
  checkoutBtn: {
    padding: '12px 28px',
    background: '#fff',
    color: '#1a1b1f',
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'Montserrat, sans-serif',
    textDecoration: 'none',
    display: 'inline-block',
  },
};

function WishlistCard({ product, onRemove, onAddToCart, inCart }) {
  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.10)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
      }}
    >
      <div className="wishlist-image-wrap" style={styles.imageWrap}>
        <img src={product.image_url || PLACEHOLDER} alt={product.name} style={styles.image} />
      </div>
      <div className="wishlist-card-body" style={styles.cardBody}>
        <h6 style={styles.cardName}>{product.name}</h6>
        <p style={styles.cardDesc}>{product.description}</p>
        <div className="wishlist-card-actions" style={styles.cardActions}>
          <button
            className="responsive-button"
            style={{ ...styles.addToCartBtn, opacity: inCart ? 0.6 : 1 }}
            onClick={() => onAddToCart(product)}
            disabled={inCart}
            onMouseEnter={(e) => !inCart && (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => !inCart && (e.currentTarget.style.opacity = '1')}
          >
            {inCart ? '✓ In Cart' : '+ Add to Cart'}
          </button>
          <button
            className="responsive-button"
            style={styles.removeBtn}
            onClick={() => onRemove(product._id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fff5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function Wishlist() {
  const { isLoggedIn, user } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wambux_cart')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return; }

    // Load wishlist IDs for this user
    const key = `wambux_wishlist_${user.username}`;
    const savedIds = JSON.parse(localStorage.getItem(key) || '[]');

    if (savedIds.length === 0) { setLoading(false); return; }

    // Fetch each product by ID from the backend
    Promise.all(
      savedIds.map((id) =>
        fetch(`${API_BASE}/products/${id}/`)
          .then((r) => r.ok ? r.json() : null)
          .catch(() => null)
      )
    ).then((products) => {
      setWishlistProducts(products.filter(Boolean));
      setLoading(false);
    });
  }, [isLoggedIn, user]);

  const handleRemove = (productId) => {
    const key = `wambux_wishlist_${user.username}`;
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = saved.filter((id) => id !== productId);
    localStorage.setItem(key, JSON.stringify(updated));
    setWishlistProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const handleAddToCart = (product) => {
    const updated = [...cart, product];
    setCart(updated);
    localStorage.setItem('wambux_cart', JSON.stringify(updated));
  };

  if (!isLoggedIn) {
    return (
      <>
        <div className="section cc-home-wrap">
          <div className="intro-header cc-subpage">
            <div className="intro-content">
              <div className="heading-jumbo">My Wishlist</div>
            </div>
          </div>
        </div>
        <div className="wishlist-section" style={{ padding: '40px 24px 80px' }}>
          <div style={styles.loginPrompt}>
            <h2 style={styles.loginTitle}>Sign in required</h2>
            <p style={styles.loginText}>
              Create an account or sign in to save products to your wishlist and access them anytime.
            </p>
            <Link to="/auth" state={{ from: '/wishlist' }} className="responsive-link-button" style={styles.loginBtn}>
              Sign In / Sign Up
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* Hero */}
      <div className="section cc-home-wrap">
        <div className="intro-header cc-subpage">
          <div className="intro-content">
            <div className="heading-jumbo">My Wishlist</div>
          </div>
        </div>
      </div>

      <div className="wishlist-section" style={{ padding: '60px 30px 80px' }}>
        <div className="container">

          {loading ? (
            <div style={{ color: '#aaa', fontSize: '14px', padding: '40px 0' }}>
              Loading your wishlist...
            </div>
          ) : wishlistProducts.length === 0 ? (
            <div className="wishlist-empty" style={styles.emptyWrap}>
              <div style={styles.emptyIcon}>♡</div>
              <h3 style={styles.emptyTitle}>Your wishlist is empty</h3>
              <p style={styles.emptyText}>
                Browse our products and hit the heart icon to save items you love.
              </p>
              <Link to="/products" className="responsive-link-button" style={styles.browseBtn}>Browse Products</Link>
            </div>
          ) : (
            <>
              {/* Summary bar */}
              <div className="wishlist-summary" style={styles.summaryBar}>
                <span style={styles.summaryText}>
                  {wishlistProducts.length} item{wishlistProducts.length > 1 ? 's' : ''} saved
                </span>
                <Link to="/checkout" className="responsive-link-button" style={styles.checkoutBtn}>
                  Checkout ({cart.length})
                </Link>
              </div>

              {/* Grid */}
              <div className="row g-4">
                {wishlistProducts.map((product) => (
                  <div className="col-12 col-sm-6 col-lg-4" key={product._id}>
                    <WishlistCard
                      product={product}
                      onRemove={handleRemove}
                      onAddToCart={handleAddToCart}
                      inCart={cart.some((c) => c._id === product._id)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Wishlist;
