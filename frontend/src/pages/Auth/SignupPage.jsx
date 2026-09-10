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
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errors = {};
    if (!formData.name?.trim()) errors.name = 'Please fill this field';
    if (!formData.email?.trim()) errors.email = 'Please fill this field';
    if (!formData.password?.trim()) errors.password = 'Please fill this field';
    if (!String(formData.phone)?.trim()) errors.phone = 'Please fill this field';
    if (!formData.address?.trim()) errors.address = 'Please fill this field';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fill in all fields.');
      return;
    }

    setFieldErrors({});
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

        <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
          <div className="auth-page__field">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              className={fieldErrors.name ? 'auth-page__input--error' : ''}
            />
            {fieldErrors.name && (
              <span className="auth-page__field-error">
                {fieldErrors.name}
              </span>
            )}
          </div>

          <div className="auth-page__field">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="yourname@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              className={fieldErrors.email ? 'auth-page__input--error' : ''}
            />
            {fieldErrors.email && (
              <span className="auth-page__field-error">
                {fieldErrors.email}
              </span>
            )}
          </div>

          <div className="auth-page__field">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              className={fieldErrors.password ? 'auth-page__input--error' : ''}
            />
            {fieldErrors.password && (
              <span className="auth-page__field-error">
                {fieldErrors.password}
              </span>
            )}
          </div>

          <div className="auth-page__field">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
              onBlur={() => handleBlur('phone')}
              className={fieldErrors.phone ? 'auth-page__input--error' : ''}
            />
            {fieldErrors.phone && (
              <span className="auth-page__field-error">
                {fieldErrors.phone}
              </span>
            )}
          </div>

          <div className="auth-page__field">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              placeholder="Your full delivery address"
              value={formData.address}
              onChange={handleChange}
              onBlur={() => handleBlur('address')}
              className={fieldErrors.address ? 'auth-page__input--error' : ''}
            />
            {fieldErrors.address && (
              <span className="auth-page__field-error">
                {fieldErrors.address}
              </span>
            )}
          </div>

          {error && (
            <p className="auth-page__form-error">
              {error}
            </p>
          )}

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

