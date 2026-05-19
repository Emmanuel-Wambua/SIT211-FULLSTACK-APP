import React from 'react';

function Footer() {
  return (
    <div className="section">
      <div className="container">
        <div className="footer-wrap">
          <a
            href="https://webflow.com/"
            target="_blank"
            rel="noreferrer"
            className="webflow-link w-inline-block"
          >
            <img
              src="/images/webflow-w-small-402x.png"
              width="15"
              alt="Webflow"
              className="webflow-logo-tiny"
            />
            <div className="paragraph-tiny">Powered by Webflow</div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
