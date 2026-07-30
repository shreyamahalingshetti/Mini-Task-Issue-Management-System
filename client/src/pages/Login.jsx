import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setGeneralError('');
  };

  const validate = () => {
    const newErrors = {};
    const { email, password } = fields;

    if (!email.trim() || !EMAIL_REGEX.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    const result = await login(fields.email, fields.password);
    setSubmitting(false);

    if (!result.success) {
      setGeneralError(result.message || 'Invalid credentials');
      return;
    }

    navigate('/board');
  };

  return (
    <AuthLayout>
      <div className="auth-form-container">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Enter your credentials to access your account.</p>

        {generalError && <div className="alert-error">{generalError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="jane@example.com"
              value={fields.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={fields.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
              autoComplete="current-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn-primary auth-submit-btn" disabled={submitting}>
            {submitting && <span className="spinner" />}
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default Login;
