import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import Spinner from '../../components/common/Spinner/Spinner';
import '../../styles/pages/_checkout.scss';

function CheckoutPage() {
  const { cart, subtotal, discountAmount, discountPercent, deliveryFee, total, couponCode, clearCart } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Prefill shipping info from user profile
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone ? String(user.phone) : '',
        address: user.address || '',
      });
    }
  }, [user]);

  // If cart is empty, redirect back to cart
  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Your Cart is Empty</h2>
        <p style={{ color: '#737373', margin: '1rem 0' }}>
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link to="/products" style={{ textDecoration: 'underline', fontWeight: 600 }}>
          Go to Shop
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError('Please fill in all shipping details.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        couponCode: couponCode || undefined,
        shippingInfo: {
          name: formData.name.trim(),
          phone: Number(formData.phone.trim()),
          address: formData.address.trim(),
        },
      };

      const response = await api.orders.checkout(payload);

      if (response && response.order) {
        clearCart();
        navigate(`/orders/${response.order._id}`, {
          state: { orderSuccess: true },
        });
      } else {
        throw new Error(response.message || 'Failed to complete order');
      }
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1 className="checkout-page__heading">CHECKOUT</h1>

      {error && <div className="checkout-page__error-alert">{error}</div>}

      <div className="checkout-page__layout">
        {/* Shipping Form */}
        <div className="checkout-page__form-box">
          <h3>Shipping & Delivery Information</h3>
          <form className="checkout-page__form" onSubmit={handleSubmit}>
            <div className="checkout-page__field">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>

            <div className="checkout-page__field">
              <label htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
              />
            </div>

            <div className="checkout-page__field">
              <label htmlFor="address">Delivery Address *</label>
              <textarea
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address, city, state, zip code"
              />
            </div>

            <button
              type="submit"
              className="checkout-page__place-order-btn"
              disabled={submitting}
            >
              {submitting ? 'Processing Order...' : `Place Order — $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="checkout-page__summary-box">
          <h3>Items in Order ({cart.length})</h3>

          <div className="checkout-page__items-preview">
            {cart.map((item, idx) => (
              <div key={idx} className="checkout-page__preview-item">
                <div>
                  <strong>{item.product.name}</strong>
                  <span>
                    Size: {item.size} | Qty: {item.quantity}
                  </span>
                </div>
                <p>${item.product.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="checkout-page__row">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>

          {discountAmount > 0 && (
            <div className="checkout-page__row" style={{ color: '#ef4444' }}>
              <span>Discount ({couponCode})</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="checkout-page__row">
            <span>Delivery Fee</span>
            <span>${deliveryFee}</span>
          </div>

          <div className="checkout-page__row checkout-page__row--total">
            <span>Total to Pay</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

