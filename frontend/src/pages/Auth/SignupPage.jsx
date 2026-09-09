import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/pages/_auth.scss';

function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.address) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: Number(formData.phone.trim()),
        address: formData.address.trim(),
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__card">
        <div className="auth-page__header">
          <h1>SIGN UP</h1>
          <p>Create your SHOP.CO account</p>
        </div>

        {error && <div className="auth-page__error">{error}</div>}

        <form className="auth-page__form" onSubmit={handleSubmit}>
          <div className="auth-page__field">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="auth-page__field">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="yourname@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="auth-page__field">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="auth-page__field">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="auth-page__field">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              required
              placeholder="Your full delivery address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="auth-page__submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-page__footer">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;

