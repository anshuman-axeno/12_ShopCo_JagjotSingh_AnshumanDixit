import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import Spinner from '../../components/common/Spinner/Spinner';
import '../../styles/pages/_orders.scss';

const STATUS_STEPS = ['Order received', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    api.orders
      .getOrderById(id)
      .then((res) => {
        if (isMounted) setOrder(res.order);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Failed to fetch order details');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <Spinner message="Loading order details..." fullScreen />;
  if (error || !order) {
    return (
      <div className="container order-details-page__empty">
        <h2>Order Not Found</h2>
        <p>{error || 'Cannot retrieve this order.'}</p>
        <Link to="/profile">
          ← Back to Account Orders
        </Link>
      </div>
    );
  }

  const currentStepIdx = STATUS_STEPS.indexOf(order.orderStatus);
  const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="order-details-page">
      <Link to="/profile" className="order-details-page__back">
        ← Back to Order History
      </Link>

      <div className="order-details-page__header">
        <div>
          <h1>ORDER #{order._id.slice(-6).toUpperCase()}</h1>
          <p className="order-details-page__date">
            Placed on {dateFormatted}
          </p>
        </div>
        <span className="order-details-page__badge order-details-page__badge--received">
          {order.orderStatus}
        </span>
      </div>

      {/* Timeline */}
      <div className="order-details-page__timeline">
        {STATUS_STEPS.map((step, idx) => {
          const isDone = idx <= currentStepIdx;
          const isCurrent = idx === currentStepIdx;

          return (
            <div
              key={step}
              className={`order-details-page__timeline-step ${
                isDone ? 'order-details-page__timeline-step--done' : ''
              } ${isCurrent ? 'order-details-page__timeline-step--current' : ''}`}
            >
              <div className="order-details-page__timeline-circle">
                {isDone ? '✓' : idx + 1}
              </div>
              <span>{step}</span>
            </div>
          );
        })}
      </div>

      <div className="order-details-page__grid">
        {/* Products List */}
        <div className="order-details-page__card">
          <h3>Purchased Items ({order.products?.length || 0})</h3>
          <div>
            {order.products?.map((item, i) => (
              <div key={i} className="order-details-page__item-row">
                <div>
                  <strong>{item.product?.name || 'Product Item'}</strong>
                  <span>
                    Price at purchase: ${item.buyPrice} × {item.quantity}
                  </span>
                </div>
                <p>${item.buyPrice * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="order-details-page__totals">
            <div className="order-details-page__summary-row">
              <span>Subtotal</span>
              <span>${order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="order-details-page__summary-row order-details-page__summary-row--discount">
                <span>Discount Applied</span>
                <span>-${order.discount}</span>
              </div>
            )}
            <div className="order-details-page__summary-row order-details-page__summary-row--total">
              <span>Total Paid</span>
              <span>${order.total}</span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="order-details-page__card">
          <h3>Delivery Information</h3>
          <div className="order-details-page__shipping-details">
            <p>
              <strong>Recipient:</strong> {order.shippingInfo?.name}
            </p>
            <p>
              <strong>Contact:</strong> {order.shippingInfo?.phone}
            </p>
            <p>
              <strong>Address:</strong> {order.shippingInfo?.address}
            </p>
            <p>
              <strong>Customer:</strong> {order.user?.email || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;

