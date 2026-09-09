import { useState } from "react";
import searchIcon from "../../assets/images/search-logo.png";
import cartIcon from "../../assets/images/cart-logo.png";
import profileIcon from "../../assets/images/profile-logo.png";
import "../../styles/components/_navbar.scss";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar__signup">
        <p>
          Sign up and get 20% off to your first order.
          <strong> Sign Up Now</strong>
        </p>
      </div>

      <div className="navbar__container">
        <h2 className="navbar__logo">SHOP.CO</h2>

        <nav className={`navbar__nav ${menuOpen ? "navbar__nav--open" : ""}`}>
          <ul className="navbar__list">
            <li className="navbar__item">Shop</li>
            <li className="navbar__item">On Sale</li>
            <li className="navbar__item">New Arrivals</li>
            <li className="navbar__item">Brands</li>
          </ul>
        </nav>

        <div className="navbar__search">
          <img
            src={searchIcon}
            alt="Search"
            className="navbar__search-icon"
          />

          <input
            type="text"
            placeholder="Search for products..."
            className="navbar__input"
          />
        </div>

        <div className="navbar__actions">
          <a href="/cart">
            <img src={cartIcon} alt="Cart" className="navbar__icon" />
          </a>

          <a href="/profile">
            <img src={profileIcon} alt="Profile" className="navbar__icon" />
          </a>

          <button
            className="navbar__menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;