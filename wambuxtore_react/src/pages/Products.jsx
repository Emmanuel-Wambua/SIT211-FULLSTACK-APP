import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CtaBanner from '../components/CtaBanner';
import Footer from '../components/Footer';
import { API_BASE } from '../config/api';

const PLACEHOLDER = 'https://cdn.prod.website-files.com/plugins/Basic/assets/placeholder.60f9b1840c.svg';
const CATEGORIES = ['Laptops', 'Phones', 'Televisions'];

const cardStyles = {
  card: {
    borderRadius: '12px',
    overflow: 'hidden',
    background: '#fff',
    border: '1px solid #e8e8e8',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  imageWrap: {
    position: 'relative',
    width: '100%',
    height: '220px',
    overflow: 'hidden',
    background: '#f7f7f7',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.35s ease',
  },
  badge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    background: '#1a1b1f',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: '20px',
  },
  badgeSoon: { background: '#9e9e9e' },
  wishlistBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    transition: 'transform 0.2s ease',
    padding: 0,
  },
  body: {
    padding: '18px 20px 22px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  name: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1b1f',
    margin: 0,
    lineHeight: '1.4',
    fontFamily: 'Montserrat, sans-serif',
  },
  description: {
    fontSize: '13px',
    color: '#777',
    lineHeight: '1.6',
    margin: 0,
    flex: 1,
  },
  divider: { height: '1px', background: '#f0f0f0', margin: '8px 0 0' },
  actions: {
    marginTop: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    flexWrap: 'wrap',
  },
  enquireLink: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#1a1b1f',
    textDecoration: 'none',
    borderBottom: '2px solid #1a1b1f',
    paddingBottom: '2px',
    transition: 'opacity 0.2s',
  },
  cartBtn: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    border: '1.5px solid #1a1b1f',
    background: 'transparent',
    color: '#1a1b1f',
    padding: '5px 12px',
    borderRadius: '6px',
    fontFamily: 'Montserrat, sans-serif',
    transition: 'all 0.2s',
  },
  wishlistText: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    padding: 0,
    transition: 'color 0.2s',
    fontFamily: 'Montserrat, sans-serif',
  },
};

function HeartIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill={filled ? '#e53935' : 'none'}
      stroke={filled ? '#e53935' : '#aaa'}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ProductCard({ product, wishlist, onToggleWishlist, cart, onToggleCart }) {
  const { _id, image_url, name, description, in_stock } = product;
  const isSoon = !in_stock;
  const isWishlisted = wishlist.includes(_id);
  const inCart = cart.some((c) => c._id === _id);

  return (
    <div
      style={cardStyles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.13)';
        const img = e.currentTarget.querySelector('img');
        if (img) img.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
        const img = e.currentTarget.querySelector('img');
        if (img) img.style.transform = 'scale(1)';
      }}
    >
      <div className="product-image-wrap" style={cardStyles.imageWrap}>
        <img src={image_url || PLACEHOLDER} loading="lazy" alt={name} style={cardStyles.image} />
        <span style={{ ...cardStyles.badge, ...(isSoon ? cardStyles.badgeSoon : {}) }}>
          {isSoon ? 'Soon' : 'In Stock'}
        </span>
        {!isSoon && (
          <button
            style={cardStyles.wishlistBtn}
            onClick={(e) => {
              e.stopPropagation();
              const button = e.currentTarget;
              onToggleWishlist(_id);
              button.style.transform = 'scale(1.25)';
              setTimeout(() => {
                button.style.transform = 'scale(1)';
              }, 200);
            }}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <HeartIcon filled={isWishlisted} />
          </button>
        )}
      </div>

      <div className="product-card-body" style={cardStyles.body}>
        <h6 style={cardStyles.name}>{name}</h6>
        <p style={cardStyles.description}>{description}</p>
        <div style={cardStyles.divider} />
        {!isSoon && (
          <div className="product-card-actions" style={cardStyles.actions}>
            <a
              href="mailto:mantelmanu31@gmail.com?subject=Enquiry"
              style={cardStyles.enquireLink}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.6')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Enquire
            </a>
            <button
              className="responsive-button"
              style={{
                ...cardStyles.cartBtn,
                background: inCart ? '#1a1b1f' : 'transparent',
                color: inCart ? '#fff' : '#1a1b1f',
              }}
              onClick={() => onToggleCart(product)}
            >
              {inCart ? '✓ Added' : '+ Cart'}
            </button>
            <button
              style={{ ...cardStyles.wishlistText, color: isWishlisted ? '#e53935' : '#aaa' }}
              onClick={() => onToggleWishlist(_id)}
            >
              {isWishlisted ? '♥ Saved' : '♡ Save'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CategorySection({ category, products, loading, wishlist, onToggleWishlist, cart, onToggleCart }) {
  return (
    <div style={{ marginBottom: '64px' }}>
      <div className="category-heading-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <h3 style={{
          fontFamily: 'Oswald, sans-serif', fontSize: '22px', fontWeight: '500',
          textTransform: 'uppercase', letterSpacing: '2px', color: '#1a1b1f', margin: 0,
        }}>
          {category}
        </h3>
        <div style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
        <span style={{ fontSize: '12px', color: '#aaa', fontWeight: '500', letterSpacing: '0.5px' }}>
          {loading ? '...' : `${products.length} items`}
        </span>
      </div>

      {loading ? (
        <div style={{ color: '#aaa', fontSize: '14px', padding: '20px 0' }}>Loading {category}...</div>
      ) : products.length === 0 ? (
        <div style={{ color: '#aaa', fontSize: '14px', padding: '20px 0' }}>
          No products available yet. Check back soon!
        </div>
      ) : (
        <div className="row g-4">
          {products.map((p) => (
            <div className="col-12 col-sm-6 col-lg-4" key={p._id}>
              <ProductCard
                product={p}
                wishlist={wishlist}
                onToggleWishlist={onToggleWishlist}
                cart={cart}
                onToggleCart={onToggleCart}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Products() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [productCategories, setProductCategories] = useState(
    CATEGORIES.map((cat) => ({ category: cat, products: [], loading: true }))
  );
  const [error, setError] = useState(null);

  // Per-user wishlist stored in localStorage
  const wishlistKey = isLoggedIn ? `wambux_wishlist_${user.username}` : null;
  const [wishlist, setWishlist] = useState(() => {
    if (!wishlistKey) return [];
    try { return JSON.parse(localStorage.getItem(wishlistKey)) || []; }
    catch { return []; }
  });

  useEffect(() => {
    if (!wishlistKey) {
      setWishlist([]);
      return;
    }

    try {
      setWishlist(JSON.parse(localStorage.getItem(wishlistKey)) || []);
    } catch {
      setWishlist([]);
    }
  }, [wishlistKey]);

  // Cart stored in localStorage
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wambux_cart')) || []; }
    catch { return []; }
  });

  const handleToggleWishlist = (productId) => {
    if (!isLoggedIn) {
      navigate('/auth', { state: { from: '/products' } });
      return;
    }
    setWishlist((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem(wishlistKey, JSON.stringify(updated));
      return updated;
    });
  };

  const handleToggleCart = (product) => {
    setCart((prev) => {
      const exists = prev.some((c) => c._id === product._id);
      const updated = exists
        ? prev.filter((c) => c._id !== product._id)
        : [...prev, product];
      localStorage.setItem('wambux_cart', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    Promise.all(
      CATEGORIES.map((cat) =>
        fetch(`${API_BASE}/products/?category=${cat}`)
          .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
          .then((data) => ({ category: cat, products: data, loading: false }))
          .catch(() => ({ category: cat, products: [], loading: false }))
      )
    )
      .then((results) => setProductCategories(results))
      .catch(() => setError('Failed to load products. Please try again later.'));
  }, []);

  return (
    <>
      <div className="section cc-home-wrap">
        <div className="intro-header cc-subpage">
          <div className="intro-content">
            <div className="heading-jumbo">Our Products</div>
          </div>
        </div>
      </div>

      <div className="catalogue-section" style={{ padding: '80px 30px' }}>
        <div className="container">
          {/* Header row */}
          <div className="catalogue-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '56px', flexWrap: 'wrap', gap: '12px' }}>
            <div className="section-heading-wrap" style={{ margin: 0 }}>
              <div className="label cc-light">Browse our catalogue</div>
              <h2 style={{ margin: 0 }}>What's in store</h2>
            </div>

            <div className="catalogue-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {wishlist.length > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: '#fff5f5', border: '1px solid #ffd0d0',
                  borderRadius: '20px', padding: '7px 14px',
                  fontSize: '12px', color: '#e53935', fontWeight: '600',
                }}>
                  <HeartIcon filled={true} />
                  {wishlist.length} saved
                </div>
              )}
              {cart.length > 0 && (
                <button
                  className="responsive-button"
                  onClick={() => navigate('/checkout')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: '#1a1b1f', border: 'none', borderRadius: '20px',
                    padding: '7px 16px', fontSize: '12px', color: '#fff',
                    fontWeight: '600', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  🛒 {cart.length} in cart
                </button>
              )}
            </div>
          </div>

          {error ? (
            <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>
          ) : (
            productCategories.map((cat) => (
              <CategorySection
                key={cat.category}
                {...cat}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                cart={cart}
                onToggleCart={handleToggleCart}
              />
            ))
          )}
        </div>
      </div>

      <CtaBanner />
      <Footer />
    </>
  );
}

export default Products;
