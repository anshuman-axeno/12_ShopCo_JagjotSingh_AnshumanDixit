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
  const [fieldErrors, setFieldErrors] = useState({});

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
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (feedback) setFeedback(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const errors = {};
    if (!formData.name?.trim()) errors.name = 'Please fill this field';
    if (!String(formData.phone)?.trim()) errors.phone = 'Please fill this field';
    if (!formData.address?.trim()) errors.address = 'Please fill this field';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFeedback({ success: false, message: 'Please fill in all fields.' });
      return;
    }

    setFieldErrors({});
    setSaving(true);

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

          <form onSubmit={handleUpdate} noValidate>
            <div className="profile-page__field">
              <label>Role</label>
              <div>
                <span className="profile-page__role-badge">
                  {user?.role || 'Customer'}
                </span>
                {isAdmin && (
                  <Link to="/admin" className="profile-page__admin-link">
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
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                className={fieldErrors.name ? 'profile-page__field-input--error' : ''}
              />
              {fieldErrors.name && (
                <span className="profile-page__field-error">
                  {fieldErrors.name}
                </span>
              )}
            </div>

            <div className="profile-page__field">
              <label htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                className={fieldErrors.phone ? 'profile-page__field-input--error' : ''}
              />
              {fieldErrors.phone && (
                <span className="profile-page__field-error">
                  {fieldErrors.phone}
                </span>
              )}
            </div>

            <div className="profile-page__field">
              <label htmlFor="address">Delivery Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={() => handleBlur('address')}
                className={fieldErrors.address ? 'profile-page__field-input--error' : ''}
              />
              {fieldErrors.address && (
                <span className="profile-page__field-error">
                  {fieldErrors.address}
                </span>
              )}
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
            <p className="profile-page__empty-orders">
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
                        <span className="profile-page__order-date">{dateStr}</span>
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

