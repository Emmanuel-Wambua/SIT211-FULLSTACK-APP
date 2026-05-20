import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { API } from '../api';

const PLACEHOLDER = 'https://cdn.prod.website-files.com/plugins/Basic/assets/placeholder.60f9b1840c.svg';

const styles = {
  section: {
    padding: '60px 30px 80px',
  },
  twoCol: {
    display: 'flex',
    gap: '40px',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  leftCol: {
    flex: '1 1 360px',
    minWidth: 0,
  },
  rightCol: {
    flex: '0 0 320px',
    minWidth: '280px',
  },
  sectionTitle: {
    fontFamily: 'Oswald, sans-serif',
    fontSize: '18px',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color: '#1a1b1f',
    marginBottom: '24px',
    paddingBottom: '12px',
    borderBottom: '2px solid #1a1b1f',
  },
  fieldGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#1a1b1f',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid #e8e8e8',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1a1b1f',
    fontFamily: 'Montserrat, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    background: '#fafafa',
  },
  orderCard: {
    background: '#fff',
    border: '1px solid #ebebeb',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    position: 'sticky',
    top: '24px',
  },
  orderHeader: {
    background: '#1a1b1f',
    padding: '20px 24px',
    color: '#fff',
    fontFamily: 'Oswald, sans-serif',
    fontSize: '16px',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  orderBody: {
    padding: '20px 24px',
  },
  orderItem: {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
    paddingBottom: '16px',
    marginBottom: '16px',
    borderBottom: '1px solid #f5f5f5',
  },
  orderItemImg: {
    width: '56px',
    height: '56px',
    objectFit: 'contain',
    background: '#f5f5f5',
    borderRadius: '8px',
    padding: '4px',
    flexShrink: 0,
  },
  orderItemName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1a1b1f',
    fontFamily: 'Montserrat, sans-serif',
    lineHeight: '1.4',
    margin: 0,
  },
  orderItemDesc: {
    fontSize: '11px',
    color: '#aaa',
    margin: '4px 0 0',
    lineHeight: '1.5',
  },
  divider: {
    height: '1px',
    background: '#f0f0f0',
    margin: '16px 0',
  },
  submitBtn: (loading) => ({
    width: '100%',
    padding: '15px',
    background: loading ? '#555' : '#1a1b1f',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    cursor: loading ? 'not-allowed' : 'pointer',
    fontFamily: 'Montserrat, sans-serif',
    marginTop: '4px',
    transition: 'background 0.2s',
  }),
  error: {
    background: '#fff5f5',
    border: '1px solid #ffd0d0',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#e53935',
    fontSize: '13px',
    marginBottom: '20px',
  },
  successWrap: {
    textAlign: 'center',
    padding: '80px 24px',
    maxWidth: '480px',
    margin: '0 auto',
  },
  successIcon: {
    width: '72px',
    height: '72px',
    background: '#1a1b1f',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    fontSize: '32px',
  },
  successTitle: {
    fontFamily: 'Oswald, sans-serif',
    fontSize: '28px',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color: '#1a1b1f',
    margin: '0 0 12px',
  },
  successText: {
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.8',
    marginBottom: '32px',
  },
  continueBtn: {
    display: 'inline-block',
    padding: '13px 32px',
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
  emptyWrap: {
    textAlign: 'center',
    padding: '80px 24px',
  },
  noteBox: {
    background: '#f7f7f5',
    border: '1px solid #ebebeb',
    borderRadius: '10px',
    padding: '14px 18px',
    fontSize: '12px',
    color: '#888',
    lineHeight: '1.7',
    marginTop: '16px',
  },
};

function Checkout() {
  const { user } = useAuth();

  const [cart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wambux_cart')) || []; }
    catch { return []; }
  });

  const [formData, setFormData] = useState({
    fullName: user?.username || '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      setError('Please fill in all required fields.');
      return;
    }
    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Post to the dedicated orders endpoint
      const orderPayload = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes,
        items: cart.map((item) => ({
          id: item._id,
          name: item.name,
        })),
      };

      const res = await fetch(API.orders, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        localStorage.removeItem('wambux_cart');
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to place order. Please try again.');
      }
    } catch {
      setError('Could not reach the server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Empty cart
  if (cart.length === 0 && !success) {
    return (
      <>
        <div className="section cc-home-wrap">
          <div className="intro-header cc-subpage">
            <div className="intro-content">
              <div className="heading-jumbo">Checkout</div>
            </div>
          </div>
        </div>
        <div className="checkout-empty" style={styles.emptyWrap}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
          <h3 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '22px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
            Your cart is empty
          </h3>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
            Add items from your wishlist or browse our products.
          </p>
          <Link to="/products" className="responsive-link-button" style={styles.continueBtn}>Browse Products</Link>
        </div>
        <Footer />
      </>
    );
  }

  // Success
  if (success) {
    return (
      <>
        <div className="section cc-home-wrap">
          <div className="intro-header cc-subpage">
            <div className="intro-content">
              <div className="heading-jumbo">Order Placed</div>
            </div>
          </div>
        </div>
        <div className="checkout-success" style={styles.successWrap}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={styles.successTitle}>Order Confirmed!</h2>
          <p style={styles.successText}>
            Thank you for your order! Our team will contact you shortly at{' '}
            <strong>{formData.email}</strong> to confirm delivery details and arrange payment.
          </p>
          <Link to="/products" className="responsive-link-button" style={styles.continueBtn}>Continue Shopping</Link>
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
            <div className="heading-jumbo">Checkout</div>
          </div>
        </div>
      </div>

      <div className="checkout-section" style={styles.section}>
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="checkout-layout" style={styles.twoCol}>

              {/* Left — Delivery Details */}
              <div style={styles.leftCol}>
                <h3 style={styles.sectionTitle}>Delivery Details</h3>

                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Full Name *</label>
                  <input
                    style={styles.input}
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    onFocus={(e) => (e.target.style.borderColor = '#1a1b1f')}
                    onBlur={(e) => (e.target.style.borderColor = '#e8e8e8')}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Email Address *</label>
                  <input
                    style={styles.input}
                    name="email"
                    type="email"
                    placeholder="Confirmation will be sent here"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={(e) => (e.target.style.borderColor = '#1a1b1f')}
                    onBlur={(e) => (e.target.style.borderColor = '#e8e8e8')}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Phone Number *</label>
                  <input
                    style={styles.input}
                    name="phone"
                    type="tel"
                    placeholder="+254 7XX XXX XXX"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={(e) => (e.target.style.borderColor = '#1a1b1f')}
                    onBlur={(e) => (e.target.style.borderColor = '#e8e8e8')}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Delivery Address *</label>
                  <input
                    style={styles.input}
                    name="address"
                    type="text"
                    placeholder="Street, area, city"
                    value={formData.address}
                    onChange={handleChange}
                    onFocus={(e) => (e.target.style.borderColor = '#1a1b1f')}
                    onBlur={(e) => (e.target.style.borderColor = '#e8e8e8')}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Order Notes (optional)</label>
                  <input
                    style={styles.input}
                    name="notes"
                    type="text"
                    placeholder="Any special instructions?"
                    value={formData.notes}
                    onChange={handleChange}
                    onFocus={(e) => (e.target.style.borderColor = '#1a1b1f')}
                    onBlur={(e) => (e.target.style.borderColor = '#e8e8e8')}
                  />
                </div>
              </div>

              {/* Right — Order Summary */}
              <div className="checkout-summary" style={styles.rightCol}>
                <div className="checkout-summary-card" style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    Order Summary ({cart.length} item{cart.length > 1 ? 's' : ''})
                  </div>
                  <div style={styles.orderBody}>
                    {cart.map((item, i) => (
                      <div style={styles.orderItem} key={i}>
                        <img
                          src={item.image_url || PLACEHOLDER}
                          alt={item.name}
                          style={styles.orderItemImg}
                        />
                        <div>
                          <p style={styles.orderItemName}>{item.name}</p>
                          <p style={styles.orderItemDesc}>
                            {item.description?.substring(0, 60)}...
                          </p>
                        </div>
                      </div>
                    ))}

                    <div style={styles.divider} />

                    <button
                      className="responsive-button"
                      type="submit"
                      style={styles.submitBtn(loading)}
                      disabled={loading}
                    >
                      {loading ? 'Placing Order...' : 'Place Order'}
                    </button>

                    <div style={styles.noteBox}>
                      📧 Our team will reach out to arrange delivery and payment after your order is received.
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Checkout;
