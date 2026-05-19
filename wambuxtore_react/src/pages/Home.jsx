import React from 'react';
import { Link } from 'react-router-dom';
import CtaBanner from '../components/CtaBanner';
import Footer from '../components/Footer';

function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="section cc-store-home-wrap">
        <div className="intro-header">
          <div className="intro-content cc-homepage">
            <div className="intro-text">
              <div className="heading-jumbo">Welcome to WambuXtore</div>
              <div className="paragraph-bigger cc-bigger-white-light">
                Your One-Stop-Shop for all Electronics needs
              </div>
            </div>
            <Link to="/products" className="secondary-button w-inline-block">
              <div>View Products</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Motto Section */}
      <div className="container">
        <div className="motto-wrap">
          <div className="label cc-light">What we believe in</div>
          <div className="heading-jumbo-small">
            Upgrade your Life with state of the art gadgets
          </div>
        </div>

        <div className="divider"></div>

        {/* About Grid */}
        <div className="home-content-wrap">
          <div className="w-layout-grid about-grid">
            <div id="w-node-home-about-text">
              <div className="home-section-wrap">
                <div className="label cc-light">About</div>
                <h2 className="section-heading">Who we are</h2>
                <p className="paragraph-light">
                  WambuXtore is a solo managed online store where customers can satisfy all their
                  electronic needs and requirements. We offer a wide variety of goods and services
                  related to tech.
                </p>
              </div>
              <Link to="/about" className="primary-button w-inline-block">
                <div>Learn More</div>
              </Link>
            </div>
            <img
              src="/images/placeholder-203.svg"
              id="w-node-home-about-img"
              alt="About WambuXtore"
            />
          </div>
        </div>
      </div>

      {/* Info Cards Section */}
      <div className="section">
        <div className="container"></div>
        <div className="div-block">
          <div className="cardabout">
            <div className="headerdiv">
              <div className="headertext">What we offer</div>
            </div>
            <div className="divider"></div>
            <p className="paragraph">
              Shop a wide range of electronics online — smartphones, laptops, smart home devices,
              audio gear, and more. We also dispatch certified tech specialists to your location for
              installations, repairs, and setups.
            </p>
          </div>

          <div className="cardabout">
            <div className="headerdiv">
              <div className="headertext">Response &amp; delivery times</div>
            </div>
            <div className="divider"></div>
            <p className="paragraph">
              Orders ship within 2–4 business days; express next-day delivery is available for
              orders placed before 2:00 PM. Service requests are acknowledged within 1 hour, with a
              specialist on-site within 24–48 hours.
            </p>
          </div>

          <div className="cardabout">
            <div className="headerdiv">
              <div className="headertext">Warranty &amp; after-sales support</div>
            </div>
            <div className="divider"></div>
            <p className="paragraph">
              All products come with manufacturer warranties. Our optional WambuCare plan extends
              your coverage and gives you priority access to our support team, available seven days a
              week via chat, phone, or email.
            </p>
          </div>
        </div>
        <h3 className="heading">ABOUT US</h3>
      </div>

      {/* CTA Banner */}
      <CtaBanner />

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Home;
