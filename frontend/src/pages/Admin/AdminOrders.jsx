import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import Spinner from '../../components/common/Spinner/Spinner';

const STATUS_OPTIONS = [
  'Order received',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.orders.getAllOrders();
      setOrders(res.orders || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch customer orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await api.orders.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: res.order?.orderStatus || newStatus } : o))
      );
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Spinner message="Loading customer orders..." />;

  return (
    <div>
      <div className="admin-layout__top-actions">
        <h2>Customer Orders ({orders.length})</h2>
      </div>

      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

      {orders.length === 0 ? (
        <p>No orders found in the database.</p>
      ) : (
        <div className="admin-layout__table-wrapper">
          <table className="admin-layout__table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Update Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => {
                const dateStr = new Date(ord.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <tr key={ord._id}>
                    <td>
                      <strong>#{ord._id.slice(-6).toUpperCase()}</strong>
                    </td>
                    <td>
                      <div>
                        <strong>{ord.user?.name || ord.shippingInfo?.name || 'Customer'}</strong>
                        <div style={{ color: '#737373', fontSize: '0.75rem' }}>
                          {ord.user?.email || ord.shippingInfo?.phone}
                        </div>
                      </div>
                    </td>
                    <td>{dateStr}</td>
                    <td>
                      {ord.products?.length || 0} product(s)
                    </td>
                    <td>
                      <strong>${ord.total}</strong>
                    </td>
                    <td>
                      <select
                        value={ord.orderStatus}
                        disabled={updatingId === ord._id}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        style={{
                          border: '1px solid #d1d5db',
                          borderRadius: '1rem',
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.8125rem',
                          backgroundColor: '#fff',
                        }}
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <Link
                        to={`/orders/${ord._id}`}
                        style={{
                          fontSize: '0.8125rem',
                          color: '#000',
                          fontWeight: 600,
                          textDecoration: 'underline',
                        }}
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;

