import React from 'react';
import { Link } from 'react-router-dom';

function CtaBanner() {
  return (
    <div className="section cc-cta">
      <div className="container">
        <div className="cta-wrap">
          <div>
            <div className="cta-text">
              <div className="heading-jumbo-small">Reach Out Today</div>
              <div className="paragraph-bigger cc-bigger-light">
                Have any further Questions? Contact us now
              </div>
            </div>
            <Link to="/contact" className="primary-button cc-jumbo-button w-inline-block">
              <div>Start Now</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CtaBanner;
