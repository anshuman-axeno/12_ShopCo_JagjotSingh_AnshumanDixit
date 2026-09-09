import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';
import ProductShowcase from '../../components/home/ProductShowcase/ProductShowcase';
import CustomerReviews from '../../components/home/CustomerReviews/CustomerReviews';
import Spinner from '../../components/common/Spinner/Spinner';
import starImg from '../../assets/images/Frame 10.png';
import '../../styles/pages/_product-details.scss';

const COLORS = [
  { name: 'Olive Green', hex: '#4f4631' },
  { name: 'Forest Green', hex: '#314f4a' },
  { name: 'Navy Blue', hex: '#31344F' },
];

const SIZES = ['Small', 'Medium', 'Large', 'X-Large'];

function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].name);
  const [selectedSize, setSelectedSize] = useState('Large');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Load product details and recommendations
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');
    setFeedback(null);
    setQuantity(1);

    api.products
      .getProductById(id)
      .then((data) => {
        if (isMounted) {
          setProduct(data.product);
          // Fetch recommendations
          return api.products.getProducts({ limit: 4 });
        }
      })
      .then((res) => {
        if (isMounted && res) {
          // Filter out current product
          const others = (res.products || []).filter((p) => p._id !== id);
          setRelatedProducts(others.slice(0, 4));
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Failed to load product');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <Spinner message="Loading product details..." fullScreen />;
  if (error || !product) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: '#737373', margin: '1rem 0' }}>{error || 'The requested product does not exist.'}</p>
        <Link to="/products" style={{ textDecoration: 'underline', fontWeight: 600 }}>
          ← Back to All Products
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.quantity <= 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 10;
  const imageSrc =
    product.images && product.images.length > 0 ? product.images[0] : '/assets/images/tshirt1.png';

  const hasDiscount = product.price > 150;
  const oldPrice = hasDiscount ? Math.round(product.price * 1.2) : null;
  const discountPercent = hasDiscount ? 20 : null;

  const handleIncrease = () => {
    if (quantity < product.quantity) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const res = addToCart(product, quantity, selectedSize, selectedColor);
    setFeedback(res);

    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  return (
    <div className="product-details">
      <div className="product-details__breadcrumb">
        <Link to="/">Home</Link> &gt; <Link to="/products">Shop</Link> &gt;{' '}
        <span>{product.name}</span>
      </div>

      <div className="product-details__main">
        {/* Gallery */}
        <div className="product-details__gallery">
          <div className="product-details__image-preview">
            <img src={imageSrc} alt={product.name} />
          </div>
        </div>

        {/* Info */}
        <div className="product-details__info">
          <h1 className="product-details__title">{product.name}</h1>

          <div className="product-details__rating">
            <img src={starImg} alt="" className="stars" aria-hidden="true" />
            <span>{product.rating || 4.5}/5</span>
          </div>

          <div className="product-details__price-box">
            <span className="product-details__price">${product.price}</span>
            {oldPrice && <span className="product-details__old-price">${oldPrice}</span>}
            {discountPercent && (
              <span className="product-details__discount">-{discountPercent}%</span>
            )}
          </div>

          <p className="product-details__description">{product.description}</p>

          <div className="product-details__meta">
            <div className="product-details__meta-row">
              <strong>Category:</strong>
              <span>{product.category?.name || 'Apparel'}</span>
            </div>
            <div className="product-details__meta-row">
              <strong>Availability:</strong>
              {isOutOfStock ? (
                <span className="product-details__meta-badge product-details__meta-badge--out-of-stock">
                  OUT OF STOCK
                </span>
              ) : isLowStock ? (
                <span className="product-details__meta-badge product-details__meta-badge--low-stock">
                  Low Stock ({product.quantity} remaining)
                </span>
              ) : (
                <span className="product-details__meta-badge product-details__meta-badge--in-stock">
                  In Stock ({product.quantity} available)
                </span>
              )}
            </div>
            <div className="product-details__meta-row">
              <strong>Status:</strong>
              <span style={{ textTransform: 'capitalize' }}>{product.status || 'Active'}</span>
            </div>
          </div>

          {/* Select Colors */}
          <div className="product-details__section">
            <h4>Select Colors</h4>
            <div className="product-details__colors">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  className={`product-details__color-btn ${
                    selectedColor === c.name ? 'selected' : ''
                  }`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setSelectedColor(c.name)}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          {/* Choose Size */}
          <div className="product-details__section">
            <h4>Choose Size</h4>
            <div className="product-details__sizes">
              {SIZES.map((size) => (
                <button
                  key={size}
                  className={`product-details__size-btn ${
                    selectedSize === size ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="product-details__actions">
            <div className="product-details__qty-box">
              <button
                onClick={handleDecrease}
                disabled={quantity <= 1 || isOutOfStock}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{isOutOfStock ? 0 : quantity}</span>
              <button
                onClick={handleIncrease}
                disabled={quantity >= product.quantity || isOutOfStock}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              className={`product-details__add-btn ${
                isOutOfStock ? 'product-details__add-btn--disabled' : ''
              }`}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? 'OUT OF STOCK' : 'Add to Cart'}
            </button>
          </div>

          {/* Feedback alert */}
          {feedback && (
            <div
              className={`product-details__feedback ${
                feedback.success
                  ? 'product-details__feedback--success'
                  : 'product-details__feedback--error'
              }`}
            >
              {feedback.message}
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <CustomerReviews />

      {/* You Might Also Like */}
      {relatedProducts.length > 0 && (
        <ProductShowcase
          title="YOU MIGHT ALSO LIKE"
          products={relatedProducts}
          linkTo="/products"
        />
      )}
    </div>
  );
}

export default ProductDetailsPage;

