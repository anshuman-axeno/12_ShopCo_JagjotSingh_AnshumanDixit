import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import deleteIcon from '../../assets/images/delete.png';
import '../../styles/pages/_cart.scss';

function CartPage() {
  const {
    cart,
    subtotal,
    discountAmount,
    discountPercent,
    deliveryFee,
    total,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    couponCode,
    couponError,
    couponSuccess,
  } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    applyCoupon(promoInput);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page__breadcrumb">
          <Link to="/">Home</Link> &gt; <span>Cart</span>
        </div>
        <div className="cart-page__empty">
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products">Explore Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__breadcrumb">
        <Link to="/">Home</Link> &gt; <span>Cart</span>
      </div>

      <h1 className="cart-page__heading">YOUR CART</h1>

      <div className="cart-page__layout">
        {/* Cart items list */}
        <div className="cart-page__items-box">
          {cart.map((item, index) => {
            const { product, quantity, size, color } = item;
            const imageSrc =
              product.images && product.images.length > 0
                ? product.images[0]
                : '/assets/images/tshirt1.png';

            return (
              <div key={`${product._id}-${size}-${color}-${index}`} className="cart-page__item">
                <div className="cart-page__item-img-wrapper">
                  <img src={imageSrc} alt={product.name} />
                </div>

                <div className="cart-page__item-details">
                  <div className="cart-page__item-header">
                    <h3>{product.name}</h3>
                    <img
                      src={deleteIcon}
                      alt="Delete item"
                      className="cart-page__delete-btn"
                      onClick={() => removeFromCart(index)}
                    />
                  </div>

                  <p className="cart-page__item-meta">
                    Size: <span>{size}</span>
                  </p>
                  <p className="cart-page__item-meta">
                    Color: <span>{color}</span>
                  </p>

                  <div className="cart-page__item-footer">
                    <span className="cart-page__item-price">${product.price}</span>

                    <div className="cart-page__qty-control">
                      <button
                        onClick={() => updateQuantity(index, quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span>{quantity}</span>
                      <button
                        onClick={() => updateQuantity(index, quantity + 1)}
                        disabled={quantity >= product.quantity}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="cart-page__summary">
          <h3>Order Summary</h3>

          <div className="cart-page__row">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>

          {discountAmount > 0 && (
            <div className="cart-page__row cart-page__row--discount">
              <span>Discount (-{discountPercent}%)</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="cart-page__row">
            <span>Delivery Fee</span>
            <span>${deliveryFee}</span>
          </div>

          <div className="cart-page__row cart-page__row--total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <form className="cart-page__promo-box" onSubmit={handleApplyPromo}>
            <input
              type="text"
              placeholder="Add promo code (SAVE10, SAVE20)"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
            />
            <button type="submit">Apply</button>
          </form>

          {couponSuccess && (
            <p className="cart-page__coupon-msg cart-page__coupon-msg--success">
              {couponSuccess}
            </p>
          )}
          {couponError && (
            <p className="cart-page__coupon-msg cart-page__coupon-msg--error">
              {couponError}
            </p>
          )}

          <button className="cart-page__checkout-btn" onClick={handleCheckout}>
            Go to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;

