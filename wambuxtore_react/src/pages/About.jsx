import React from 'react';
import CtaBanner from '../components/CtaBanner';
import Footer from '../components/Footer';

const principles = [
  {
    icon: '/images/icon-201.svg',
    title: 'Customer first, always',
    description:
      'Every decision we make starts with one question: does this make things better for the customer? If the answer is no, we go back to the drawing board.',
  },
  {
    icon: '/images/icon-201-1.svg',
    title: 'Quality without compromise',
    description:
      'We stock only products we would confidently recommend to a friend. Every item is vetted for performance, reliability, and value before it earns a place in our catalogue.',
  },
  {
    icon: '/images/icon-203.svg',
    title: 'Speed and reliability',
    description:
      'Fast delivery and prompt specialist dispatch are not optional extras — they are the baseline. We treat your time with the same urgency you do.',
  },
  {
    icon: '/images/icon-201.svg',
    title: 'Responsible business',
    description:
      'We are committed to responsible sourcing, minimal packaging waste, and building a business that is good for our customers, our community, and the environment.',
  },
  {
    icon: '/images/icon-203.svg',
    title: 'Transparency you can trust',
    description:
      'No hidden fees, no vague warranties, no runaround. We tell you exactly what you are getting, what it covers, and what to expect — before and after purchase.',
  },
  {
    icon: '/images/icon-202.svg',
    title: 'Expertise at every step',
    description:
      'Our team is made up of genuine tech enthusiasts and certified specialists. When you ask a question, you get a real answer from someone who actually knows.',
  },
];

const styles = {
  principlesSection: {
    padding: '80px 0',
    background: '#fafafa',
  },
  card: {
    background: '#fff',
    border: '1px solid #ebebeb',
    borderRadius: '14px',
    padding: '32px 28px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  },
  iconWrap: {
    width: '52px',
    height: '52px',
    background: '#1a1b1f',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: {
    width: '26px',
    height: '26px',
    filter: 'invert(1)',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a1b1f',
    margin: 0,
    fontFamily: 'Montserrat, sans-serif',
    lineHeight: '1.4',
  },
  cardDesc: {
    fontSize: '13px',
    color: '#777',
    lineHeight: '1.7',
    margin: 0,
    flex: 1,
  },
  storySection: {
    padding: '64px 0 48px',
  },
  storyText: {
    fontSize: '15px',
    color: '#555',
    lineHeight: '1.9',
    maxWidth: '780px',
  },
  tagline: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1b1f',
    lineHeight: '1.3',
    fontFamily: 'Oswald, sans-serif',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
};

function PrincipleCard({ icon, title, description }) {
  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.10)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)';
      }}
    >
      <div style={styles.iconWrap}>
        <img src={icon} alt="" style={styles.icon} />
      </div>
      <h5 style={styles.cardTitle}>{title}</h5>
      <p style={styles.cardDesc}>{description}</p>
    </div>
  );
}

function About() {
  return (
    <>
      {/* Hero */}
      <div className="section cc-home-wrap">
        <div className="intro-header cc-subpage">
          <div className="intro-content">
            <div className="heading-jumbo">About Us</div>
          </div>
        </div>
      </div>

      {/* Story */}
      <div style={styles.storySection}>
        <div className="container">
          <div className="motto-wrap">
            <div style={styles.tagline}>
              Tech that works for you,
              <br />
              people who actually care.
            </div>
          </div>
          <div className="divider"></div>
          <div className="about-story-wrap">
            <p style={styles.storyText}>
              WambuXtore was born out of a simple frustration — great electronics should not be hard
              to find, and getting help with them should not be even harder. We set out to build a
              store that combines a wide, carefully curated catalogue of consumer and professional
              electronics with real, human technical support. Whether you are shopping for your first
              laptop, upgrading your home network, or need a specialist on-site by tomorrow,
              WambuXtore is the single destination for everything tech. We are not just a shop — we
              are the team you call when things need to work.
            </p>
          </div>
          <div className="divider"></div>
        </div>
      </div>

      {/* Key Principles */}
      <div style={styles.principlesSection}>
        <div className="container">
          <div className="section-heading-wrap" style={{ marginBottom: '48px' }}>
            <div className="label cc-light">What we stand for</div>
            <h2>Our Key Principles</h2>
          </div>

          <div className="row g-4 mb-5">
            {principles.map((p, i) => (
              <div className="col-12 col-sm-6 col-lg-4" key={i}>
                <PrincipleCard {...p} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <CtaBanner />

      {/* Footer */}
      <Footer />
    </>
  );
}

export default About;