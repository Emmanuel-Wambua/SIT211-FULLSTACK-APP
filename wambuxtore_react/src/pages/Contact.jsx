import React, { useState } from 'react';
import Footer from '../components/Footer';
import { API_BASE } from '../config/api';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.message) {
      setError('Please fill in your email and message before submitting.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Could not reach the server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <div className="section">
        <div className="intro-header cc-subpage">
          <div className="intro-content">
            <div className="heading-jumbo">Contact Us</div>
          </div>
        </div>
      </div>

      {/* Contact Form + Details */}
      <div className="section">
        <div className="container">
          <div className="row g-5 align-items-start">

            {/* Contact Form */}
            <div className="col-12 col-lg-8">
              <div className="contact-form-wrap">
                <div className="contact-form-heading-wrap">
                  <h2 className="contact-heading">Contact us</h2>
                  <div className="paragraph-light">
                    Always open and ready to hear and handle any problems you encounter from us. We
                    will try to respond as fast as possible.
                  </div>
                </div>

                {!submitted ? (
                  <div className="contact-form w-form">
                    <form onSubmit={handleSubmit} className="get-in-touch-form">

                      <label htmlFor="name">Name</label>
                      <input
                        className="text-field cc-contact-field w-input"
                        maxLength="256"
                        name="name"
                        placeholder="Enter your name"
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                      />

                      <label htmlFor="email">Email Address</label>
                      <input
                        className="text-field cc-contact-field w-input"
                        maxLength="256"
                        name="email"
                        placeholder="Enter your email"
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />

                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Hi there, I'm reaching out because I think we can collaborate…"
                        maxLength="5000"
                        className="text-field cc-textarea cc-contact-field w-input"
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>

                      <button
                        type="submit"
                        className="primary-button w-button"
                        disabled={loading}
                        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                      >
                        {loading ? 'Sending...' : 'Submit'}
                      </button>
                    </form>

                    {error && (
                      <div className="status-message cc-error-message" style={{ display: 'block', marginTop: '16px' }}>
                        <div>{error}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="status-message cc-success-message" style={{ display: 'block' }}>
                    <div>Thank you! Your message has been received. We'll get back to you shortly.</div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Details */}
            <div className="col-12 col-lg-4">
              <div className="details-wrap">
                <div className="label">Our offices</div>
                <div className="paragraph-light">
                  Send your complaints to the contact information below
                </div>
              </div>

              <div className="details-wrap">
                <div className="label">OUR OFFICE</div>
                <div className="paragraph-light">
                  Thika Road,
                  <br />
                  Kenyatta University,
                  <br />
                  Opposite Qwetu
                </div>
              </div>

              <div className="details-wrap">
                <div className="label">WORKING HOURS</div>
                <div className="paragraph-light">9AM - 3PM, Mon to Fri</div>
              </div>

              <div className="details-wrap">
                <div className="label">CONTACT</div>
                <a href="mailto:mantelmanu31@gmail.com" className="contact-email-link">
                  mantelmanu31@gmail.com
                </a>
                <div className="paragraph-light">+254 793 630 295</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Contact;
