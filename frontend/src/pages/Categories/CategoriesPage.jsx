import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/common/Spinner/Spinner';
import '../../styles/pages/_categories.scss';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const data = await api.categories.getAll();
        if (isMounted) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load categories');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <Spinner message="Loading categories..." fullScreen />;
  }

  return (
    <div className="categories-page">
      <div className="categories-page__header">
        <h1 className="categories-page__title">EXPLORE CATEGORIES</h1>
        {isAdmin && (
          <Link to="/admin/categories" className="categories-page__admin-btn">
            Manage Categories (Admin)
          </Link>
        )}
      </div>

      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div className="categories-page__grid">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}&categoryName=${encodeURIComponent(cat.name)}`}
              className="categories-page__card"
            >
              <h3>{cat.name}</h3>
              <span>View Products →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;

