import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../../components/products/ProductCard/ProductCard';
import Spinner from '../../components/common/Spinner/Spinner';
import { api } from '../../services/api';
import '../../styles/pages/_products.scss';

function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentCategoryName = searchParams.get('categoryName') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentAvailability = searchParams.get('availability') || 'all';
  const currentMinPrice = searchParams.get('minimumPrice') || '';
  const currentMaxPrice = searchParams.get('maximumPrice') || '';

  // Local state for filters
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);
  const [categories, setCategories] = useState([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Products response state
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories for sidebar
  useEffect(() => {
    let isMounted = true;
    api.categories
      .getAll()
      .then((data) => {
        if (isMounted) setCategories(data.categories || []);
      })
      .catch((err) => console.error('Failed to load categories:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Debounced search input sync
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== currentSearch) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          if (searchInput.trim()) {
            next.set('search', searchInput.trim());
          } else {
            next.delete('search');
          }
          next.set('page', '1'); // Reset pagination on search change
          return next;
        });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput, currentSearch, setSearchParams]);

  // Sync search input when URL changes externally
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Fetch products from backend
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    const query = {
      search: currentSearch,
      category: currentCategory,
      sort: currentSort,
      page: currentPage,
      limit: 9,
      availability: currentAvailability,
      minimumPrice: currentMinPrice,
      maximumPrice: currentMaxPrice,
    };

    api.products
      .getProducts(query)
      .then((res) => {
        if (isMounted) {
          setProducts(res.products || []);
          setTotalPages(res.totalPages || 1);
          setTotalProducts(res.totalProducts || 0);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to fetch products');
          setProducts([]);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    currentSearch,
    currentCategory,
    currentSort,
    currentPage,
    currentAvailability,
    currentMinPrice,
    currentMaxPrice,
  ]);

  // Filter handlers
  const handleCategorySelect = useCallback(
    (categoryId, catName) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (currentCategory === categoryId) {
          next.delete('category');
          next.delete('categoryName');
        } else {
          next.set('category', categoryId);
          if (catName) next.set('categoryName', catName);
        }
        next.set('page', '1');
        return next;
      });
    },
    [currentCategory, setSearchParams]
  );

  const handleSortChange = useCallback(
    (e) => {
      const val = e.target.value;
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('sort', val);
        next.set('page', '1');
        return next;
      });
    },
    [setSearchParams]
  );

  const handleAvailabilityChange = useCallback(
    (val) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (val === 'all') {
          next.delete('availability');
        } else {
          next.set('availability', val);
        }
        next.set('page', '1');
        return next;
      });
    },
    [setSearchParams]
  );

  const handlePriceApply = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (minPriceInput) next.set('minimumPrice', minPriceInput);
      else next.delete('minimumPrice');

      if (maxPriceInput) next.set('maximumPrice', maxPriceInput);
      else next.delete('maximumPrice');

      next.set('page', '1');
      return next;
    });
  }, [minPriceInput, maxPriceInput, setSearchParams]);

  const handleResetFilters = useCallback(() => {
    setSearchInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams(new URLSearchParams({ sort: 'newest', page: '1' }));
  }, [setSearchParams]);

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.set('page', String(newPage));
          return next;
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [totalPages, setSearchParams]
  );

  // Active FIlters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (currentCategory) count++;
    if (currentAvailability !== 'all') count++;
    if (currentMinPrice || currentMaxPrice) count++;
    if (currentSearch) count++;
    return count;
  }, [currentCategory, currentAvailability, currentMinPrice, currentMaxPrice, currentSearch]);

  return (
    <div className="products-page">
      <div className="products-page__breadcrumb">
        <Link to="/">Home</Link> &gt; <span>Shop</span>
        {currentCategoryName && <span> &gt; {currentCategoryName}</span>}
      </div>

      <div className="products-page__layout">
        {/* Sidebar Filters */}
        <aside
          className={`products-page__sidebar ${
            mobileFilterOpen ? 'products-page__sidebar--open' : ''
          }`}
        >
          <div className="products-page__sidebar-header">
            <h3>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</h3>
            <button onClick={handleResetFilters}>Reset All</button>
          </div>

          <div className="products-page__sidebar-group">
            <h4>Categories</h4>
            <div className="products-page__sidebar-categories">
              <button
                className={!currentCategory ? 'active' : ''}
                onClick={() => handleCategorySelect('', '')}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className={currentCategory === cat._id ? 'active' : ''}
                  onClick={() => handleCategorySelect(cat._id, cat.name)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="products-page__sidebar-group">
            <h4>Price Range ($)</h4>
            <div className="products-page__sidebar-price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                min="0"
              />
              <span>—</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                min="0"
              />
            </div>
            <button
              onClick={handlePriceApply}
              className="products-page__filter-apply-btn"
            >
              Apply Price
            </button>
          </div>

          <div className="products-page__sidebar-group">
            <h4>Availability</h4>
            <div className="products-page__sidebar-availability">
              <label>
                <input
                  type="radio"
                  name="availability"
                  checked={currentAvailability === 'all'}
                  onChange={() => handleAvailabilityChange('all')}
                />
                All Items
              </label>
              <label>
                <input
                  type="radio"
                  name="availability"
                  checked={currentAvailability === 'inStock'}
                  onChange={() => handleAvailabilityChange('inStock')}
                />
                In Stock Only
              </label>
              <label>
                <input
                  type="radio"
                  name="availability"
                  checked={currentAvailability === 'outOfStock'}
                  onChange={() => handleAvailabilityChange('outOfStock')}
                />
                Out of Stock Only
              </label>
            </div>
          </div>
        </aside>

        {/* Main Products Content */}
        <main className="products-page__main">
          <div className="products-page__topbar">
            <div className="products-page__topbar-left">
              <h1>{currentCategoryName || 'All Products'}</h1>
              <span>
                {totalProducts > 0
                  ? `Showing ${(currentPage - 1) * 9 + 1}-${Math.min(
                      currentPage * 9,
                      totalProducts
                    )} of ${totalProducts} Products`
                  : '0 Products'}
              </span>
            </div>

            <div className="products-page__topbar-right">
              <button
                className="products-page__mobile-filter-btn"
                onClick={() => setMobileFilterOpen((prev) => !prev)}
              >
                {mobileFilterOpen ? 'Hide Filters' : 'Filters'}
              </button>

              <div className="products-page__sort">
                <span>Sort by:</span>
                <select value={currentSort} onChange={handleSortChange}>
                  <option value="newest">Newest</option>
                  <option value="priceAscending">Price: Low to High</option>
                  <option value="priceDescending">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          <div className="products-page__search-bar">
            <input
              type="text"
              placeholder="Search products by name in this catalog..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {error && <p className="products-page__error">{error}</p>}

          {loading ? (
            <Spinner message="Fetching products..." />
          ) : products.length === 0 ? (
            <div className="products-page__empty">
              <h3>No products found</h3>
              <p>Try adjusting your search keywords or resetting filters.</p>
              <button onClick={handleResetFilters}>Reset Filters</button>
            </div>
          ) : (
            <>
              <div className="products-page__grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="products-page__pagination" aria-label="Pagination">
                  <button
                    className="products-page__pagination-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </button>

                  <div className="products-page__pagination-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={`products-page__pagination-page ${
                          p === currentPage ? 'products-page__pagination-page--active' : ''
                        }`}
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    className="products-page__pagination-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>
                </nav>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default ProductListingPage;

