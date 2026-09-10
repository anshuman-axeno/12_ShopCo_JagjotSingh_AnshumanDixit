import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import searchIcon from '../../../assets/images/search-logo.png';
import cartIcon from '../../../assets/images/cart-logo.png';
import profileIcon from '../../../assets/images/profile-logo.png';
import '../../../styles/components/_navbar.scss';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBanner, setShowBanner] = useState(true);

  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  //search input = URL search param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    setSearchTerm(q);
  }, [location.search]);

  // Handle Search Submission / Debounce
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'submit') {
      e.preventDefault();
      if (searchTerm.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      } else {
        navigate('/products');
      }
    }
  };

  return (
    <header className="navbar">
      {showBanner && (
        <div className="navbar__signup">
          <p>
            Sign up and get 20% off to your first order.
            <Link to="/signup"> Sign Up Now</Link>
          </p>
          <button
            className="navbar__signup-close"
            onClick={() => setShowBanner(false)}
            aria-label="Close banner"
          >
            ✕
          </button>
        </div>
      )}

      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          SHOP.CO
        </Link>

        <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
          <ul className="navbar__list">
            <li className="navbar__item">
              <Link to="/products">Shop</Link>
            </li>
            <li className="navbar__item">
              <Link to="/categories">Categories</Link>
            </li>
            <li className="navbar__item">
              <Link to="/products?availability=inStock">On Sale</Link>
            </li>
            <li className="navbar__item">
              <Link to="/products?sort=newest">New Arrivals</Link>
            </li>
            <li className="navbar__item">
              <Link to="/products">Brands</Link>
            </li>
          </ul>
        </nav>

        <div className="navbar__search">
          <img src={searchIcon} alt="" className="navbar__search-icon" aria-hidden="true" />
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search for products..."
              className="navbar__input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
          </form>
        </div>

        <div className="navbar__actions">
          <Link to="/cart" className="navbar__icon-link" aria-label="View Cart">
            <img src={cartIcon} alt="Cart" className="navbar__icon" />
            {totalItems > 0 && <span className="navbar__badge">{totalItems}</span>}
          </Link>

          <div className="navbar__profile-menu" ref={profileRef}>
            <button
              className="navbar__icon-link"
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-label="Account menu"
            >
              <img src={profileIcon} alt="Profile" className="navbar__icon" />
            </button>

            {profileOpen && (
              <div className="navbar__dropdown">
                {isAuthenticated ? (
                  <>
                    <div className="navbar__dropdown-header">
                      <p>{user?.name || 'My Account'}</p>
                      <span>Role: {user?.role || 'Customer'}</span>
                    </div>
                    <Link to="/profile" className="navbar__dropdown-item">
                      My Profile & Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="navbar__dropdown-item navbar__dropdown-item--admin">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="navbar__dropdown-item navbar__dropdown-item--danger"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="navbar__dropdown-item">
                      Log In
                    </Link>
                    <Link to="/signup" className="navbar__dropdown-item">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            className="navbar__menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
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

