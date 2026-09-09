import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import Spinner from '../../components/common/Spinner/Spinner';
import '../../styles/pages/_profile.scss';

function ProfilePage() {
  const { user, updateProfile, isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone ? String(user.phone) : '',
        address: user.address || '',
      });
    }
  }, [user]);

  // Fetch user order history
  useEffect(() => {
    let isMounted = true;
    api.orders
      .getMyOrders()
      .then((res) => {
        if (isMounted) setOrders(res.orders || []);
      })
      .catch((err) => {
        console.error('Failed to load orders:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingOrders(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      await updateProfile({
        name: formData.name.trim(),
        phone: Number(formData.phone.trim()),
        address: formData.address.trim(),
      });
      setFeedback({ success: true, message: 'Profile updated successfully!' });
    } catch (err) {
      setFeedback({ success: false, message: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'profile-page__order-card-status--delivered';
      case 'Packed':
      case 'Shipped':
      case 'Out for Delivery':
        return 'profile-page__order-card-status--shipped';
      default:
        return 'profile-page__order-card-status--received';
    }
  };

  return (
    <div className="profile-page">
      <h1 className="profile-page__heading">MY ACCOUNT</h1>

      <div className="profile-page__layout">
        {/* Profile Card */}
        <div className="profile-page__card">
          <h3>Profile Details</h3>

          <form onSubmit={handleUpdate}>
            <div className="profile-page__field">
              <label>Role</label>
              <div>
                <span className="profile-page__role-badge">
                  {user?.role || 'Customer'}
                </span>
                {isAdmin && (
                  <Link
                    to="/admin"
                    style={{
                      marginLeft: '0.75rem',
                      fontSize: '0.8125rem',
                      color: '#000',
                      fontWeight: 700,
                      textDecoration: 'underline',
                    }}
                  >
                    Go to Admin Dashboard →
                  </Link>
                )}
              </div>
            </div>

            <div className="profile-page__field">
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" value={user?.email || ''} disabled />
            </div>

            <div className="profile-page__field">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="profile-page__field">
              <label htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="profile-page__field">
              <label htmlFor="address">Delivery Address *</label>
              <textarea
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="profile-page__save-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>

            {feedback && (
              <div
                className={`profile-page__feedback ${
                  feedback.success
                    ? 'profile-page__feedback--success'
                    : 'profile-page__feedback--error'
                }`}
              >
                {feedback.message}
              </div>
            )}
          </form>
        </div>

        {/* Order History */}
        <div className="profile-page__orders-box">
          <h3>Order History ({orders.length})</h3>

          {loadingOrders ? (
            <Spinner message="Loading orders..." />
          ) : orders.length === 0 ? (
            <p style={{ color: '#737373', padding: '2rem 0', textAlign: 'center' }}>
              You have no past orders yet.
            </p>
          ) : (
            <div className="profile-page__orders-list">
              {orders.map((order) => {
                const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <div key={order._id} className="profile-page__order-card">
                    <div className="profile-page__order-card-header">
                      <div>
                        <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                        <span style={{ marginLeft: '0.75rem' }}>{dateStr}</span>
                      </div>
                      <span
                        className={`profile-page__order-card-status ${getStatusClass(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="profile-page__order-card-items">
                      {order.products?.map((item, i) => (
                        <p key={i}>
                          • {item.product?.name || 'Product'} × {item.quantity} ($
                          {item.buyPrice} each)
                        </p>
                      ))}
                    </div>

                    <div className="profile-page__order-card-footer">
                      <p>Total: ${order.total}</p>
                      <Link to={`/orders/${order._id}`}>View Details →</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

