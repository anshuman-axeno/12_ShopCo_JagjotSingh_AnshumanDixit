import { useState, useEffect } from 'react';
import Hero from '../../components/home/Hero/Hero';
import ProductShowcase from '../../components/home/ProductShowcase/ProductShowcase';
import BrowseStyle from '../../components/home/BrowseStyle/BrowseStyle';
import CustomerReviews from '../../components/home/CustomerReviews/CustomerReviews';
import Spinner from '../../components/common/Spinner/Spinner';
import { api } from '../../services/api';
import '../../styles/pages/_home.scss';

function HomePage() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchHomeProducts = async () => {
      try {
        const [arrivalsRes, sellingRes] = await Promise.all([
          api.products.getProducts({ sort: 'newest', limit: 4 }),
          api.products.getProducts({ limit: 4 }),
        ]);

        if (isMounted) {
          setNewArrivals(arrivalsRes.products || []);
          setTopSelling(sellingRes.products || []);
        }
      } catch (err) {
        console.error('Failed to load homepage products:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHomeProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="home-page">
      <Hero />
      {loading ? (
        <Spinner message="Loading collection..." />
      ) : (
        <>
          <ProductShowcase
            title="NEW ARRIVALS"
            products={newArrivals}
            linkTo="/products?sort=newest"
          />
          <ProductShowcase
            title="TOP SELLING"
            products={topSelling}
            linkTo="/products"
          />
        </>
      )}
      <BrowseStyle />
      <CustomerReviews />
    </div>
  );
}

export default HomePage;

