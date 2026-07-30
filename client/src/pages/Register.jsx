import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    const { name, email, password, confirmPassword } = fields;

    if (!name.trim() || name.trim().length < 2)
      newErrors.name = 'Name must be at least 2 characters.';

    if (!email.trim() || !EMAIL_REGEX.test(email))
      newErrors.email = 'Please enter a valid email address.';

    if (!password || password.length < 6)
      newErrors.password = 'Password must be at least 6 characters.';

    if (confirmPassword !== password)
      newErrors.confirmPassword = 'Passwords do not match.';

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
    const result = await register(fields.name, fields.email, fields.password);
    setSubmitting(false);

    if (!result.success) {
      setGeneralError(result.message || 'Registration failed. Please try again.');
      return;
    }

    navigate('/board');
  };

  return (
    <AuthLayout>
      <div className="auth-form-container">
        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Start managing your tasks today.</p>

        {generalError && <div className="alert-error">{generalError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Jane Smith"
              value={fields.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
              autoComplete="name"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

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
              placeholder="At least 6 characters"
              value={fields.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
              autoComplete="new-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              value={fields.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'input-error' : ''}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="btn-primary auth-submit-btn" disabled={submitting}>
            {submitting && <span className="spinner" />}
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default Register;
