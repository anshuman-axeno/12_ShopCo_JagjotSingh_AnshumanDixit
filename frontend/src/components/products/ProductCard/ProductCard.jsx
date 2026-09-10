import { memo } from 'react';
import { Link } from 'react-router-dom';
import starImg from '../../../assets/images/Frame 10.png';
import '../../../styles/components/_product-card.scss';

function ProductCard({ product }) {
  if (!product) return null;

  const { _id, name, price, rating = 4.5, quantity = 0, images = [] } = product;

  // if no image
  const imageSrc = images && images.length > 0 ? images[0] : '/assets/images/tshirt1.png';

  // Stock status
  const isOutOfStock = quantity === 0;
  const isLowStock = quantity > 0 && quantity <= 10;

  
  const hasDiscount = price > 150;
  const oldPrice = hasDiscount ? Math.round(price * 1.2) : null;
  const discountPercent = hasDiscount ? 20 : null;

  return (
    <article className="product-card">
      <Link to={`/product/${_id}`} className="product-card__image-wrapper">
        <img
          src={imageSrc}
          alt={name}
          className="product-card__img"
          loading="lazy"
        />
        {isOutOfStock ? (
          <span className="product-card__badge product-card__badge--out-of-stock">
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="product-card__badge product-card__badge--low-stock">
            Only {quantity} left
          </span>
        ) : null}
      </Link>

      <h3 className="product-card__name" title={name}>
        <Link to={`/product/${_id}`}>{name}</Link>
      </h3>

      <div className="product-card__rating">
        <img src={starImg} alt="" className="stars" aria-hidden="true" />
        <span>{rating || 4.5}/5</span>
      </div>

      <div className="product-card__price-box">
        <span className="product-card__price">${price}</span>
        {oldPrice && <span className="product-card__old-price">${oldPrice}</span>}
        {discountPercent && (
          <span className="product-card__discount">-{discountPercent}%</span>
        )}
      </div>
    </article>
  );
}

// using react memo to avoid re-renders
export default memo(ProductCard);

