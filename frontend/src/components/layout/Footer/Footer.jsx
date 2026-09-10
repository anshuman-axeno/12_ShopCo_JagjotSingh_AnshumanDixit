import { useState } from 'react';
import { Link } from 'react-router-dom';
import twitterIcon from '../../../assets/images/twitter.png';
import facebookIcon from '../../../assets/images/facebook2.png';
import instaIcon from '../../../assets/images/insta3.png';
import githubIcon from '../../../assets/images/4.png';
import paymentIcon from '../../../assets/images/payment.png';
import '../../../styles/components/_footer.scss';

function Footer() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer__newsletter">
        <h2 className="footer__newsletter-heading">
          STAY UP TO DATE ABOUT<br />OUR LATEST OFFERS
        </h2>
        <form className="footer__newsletter-form" onSubmit={handleSubscribe} noValidate>
          <div className={`footer__newsletter-input-box ${error ? 'footer__newsletter-input-box--error' : ''}`}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              onBlur={() => {
                if (!email.trim()) setError('Please fill in all fields.');
              }}
            />
          </div>
          <button type="submit" className="footer__newsletter-btn">
            {subscribed ? 'Subscribed!' : 'Subscribe to Newsletter'}
          </button>
        </form>
        {error && (
          <p className="footer__newsletter-error">
            {error}
          </p>
        )}
      </div>

      <div className="footer__main">
        <div className="footer__about">
          <h2 className="footer__logo">SHOP.CO</h2>
          <p>
            We have clothes that suit your style and which you're proud to wear. From women to men.
          </p>
          <div className="footer__socials">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <img src={twitterIcon} alt="Twitter" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <img src={facebookIcon} alt="Facebook" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <img src={instaIcon} alt="Instagram" />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
              <img src={githubIcon} alt="GitHub" />
            </a>
          </div>
        </div>

        <nav className="footer__links">
          <div className="footer__col">
            <h3>COMPANY</h3>
            <ul>
              <li><Link to="/products">About</Link></li>
              <li><Link to="/products">Features</Link></li>
              <li><Link to="/products">Works</Link></li>
              <li><Link to="/products">Career</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h3>HELP</h3>
            <ul>
              <li><Link to="/products">Customer Support</Link></li>
              <li><Link to="/products">Delivery Details</Link></li>
              <li><Link to="/products">Terms & Conditions</Link></li>
              <li><Link to="/products">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h3>FAQ</h3>
            <ul>
              <li><Link to="/profile">Account</Link></li>
              <li><Link to="/profile">Manage Deliveries</Link></li>
              <li><Link to="/profile">Orders</Link></li>
              <li><Link to="/cart">Payments</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h3>RESOURCES</h3>
            <ul>
              <li><Link to="/products">Free eBooks</Link></li>
              <li><Link to="/products">Development Tutorial</Link></li>
              <li><Link to="/products">How to - Blog</Link></li>
              <li><Link to="/products">YouTube Playlist</Link></li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="footer__bottom">
        <p>Shop.co © 2000-2026, All Rights Reserved</p>
        <img src={paymentIcon} alt="Payment methods" className="footer__payment" />
      </div>
    </footer>
  );
}

export default Footer;

