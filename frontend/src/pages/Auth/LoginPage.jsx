import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/pages/_auth.scss';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errors = {};
    if (!email.trim()) errors.email = 'Please fill this field';
    if (!password.trim()) errors.password = 'Please fill this field';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fill in all fields.');
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__card">
        <div className="auth-page__header">
          <h1>LOG IN</h1>
          <p>Welcome back to SHOP.CO</p>
        </div>

        {error && <div className="auth-page__error">{error}</div>}

        <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
          <div className="auth-page__field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="yourname@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                if (error) setError('');
              }}
              className={fieldErrors.email ? 'auth-page__input--error' : ''}
            />
            {fieldErrors.email && (
              <span className="auth-page__field-error">
                {fieldErrors.email}
              </span>
            )}
          </div>

          <div className="auth-page__field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                if (error) setError('');
              }}
              onBlur={() => handleBlur('password')}
              className={fieldErrors.password ? 'auth-page__input--error' : ''}
            />
            {fieldErrors.password && (
              <span className="auth-page__field-error">
                {fieldErrors.password}
              </span>
            )}
          </div>

          {error && (
            <p className="auth-page__form-error">
              {error}
            </p>
          )}

          <button type="submit" className="auth-page__submit-btn" disabled={loading}>
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div className="auth-page__footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

