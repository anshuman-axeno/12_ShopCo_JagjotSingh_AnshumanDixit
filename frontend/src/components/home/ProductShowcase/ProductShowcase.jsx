import { Link } from 'react-router-dom';
import ProductCard from '../../products/ProductCard/ProductCard';

function ProductShowcase({ title, products = [], linkTo = '/products' }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="showcase-section">
      <h2 className="showcase-section__heading">{title}</h2>
      <div className="showcase-section__grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <div className="showcase-section__btn-box">
        <Link to={linkTo} className="showcase-section__view-all">
          View All
        </Link>
      </div>
    </section>
  );
}

export default ProductShowcase;

