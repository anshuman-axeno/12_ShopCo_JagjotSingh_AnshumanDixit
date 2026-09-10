import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import Spinner from '../../components/common/Spinner/Spinner';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    api.admin
      .getDashboard()
      .then((res) => {
        if (isMounted) setStats(res.stats);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Failed to load dashboard metrics');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <Spinner message="Loading dashboard statistics..." />;
  if (error) return <p className="admin-layout__error">{error}</p>;

  const hasLowStockAlert = (stats?.lowStock || 0) > 0 || (stats?.outOfStock || 0) > 0;

  return (
    <div>
      {hasLowStockAlert && (
        <div className="admin-layout__alert-banner">
          <h4>Inventory Attention Required</h4>
          <p>
            You currently have <strong>{stats?.outOfStock || 0}</strong> out-of-stock products
            and <strong>{stats?.lowStock || 0}</strong> products at low stock (quantity ≤ 10).{' '}
            <Link to="/admin/products">
              Manage Inventory →
            </Link>
          </p>
        </div>
      )}

      <div className="admin-layout__stats-grid">
        <div className="admin-layout__stat-card">
          <h3>Total Products</h3>
          <p>{stats?.totalProducts ?? 0}</p>
        </div>

        <div className="admin-layout__stat-card">
          <h3>Total Categories</h3>
          <p>{stats?.totalCategories ?? 0}</p>
        </div>

        <div className="admin-layout__stat-card">
          <h3>Registered Users</h3>
          <p>{stats?.totalUsers ?? 0}</p>
        </div>

        <div className="admin-layout__stat-card">
          <h3>Total Orders</h3>
          <p>{stats?.totalOrders ?? 0}</p>
        </div>

        <div
          className={`admin-layout__stat-card ${
            (stats?.lowStock || 0) > 0 ? 'admin-layout__stat-card--warning' : ''
          }`}
        >
          <h3>Low Stock Products (≤ 10)</h3>
          <p>{stats?.lowStock ?? 0}</p>
        </div>

        <div
          className={`admin-layout__stat-card ${
            (stats?.outOfStock || 0) > 0 ? 'admin-layout__stat-card--danger' : ''
          }`}
        >
          <h3>Out of Stock (0)</h3>
          <p>{stats?.outOfStock ?? 0}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

