import React from 'react';

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      {/* Left Panel */}
      <div className="auth-left-panel">
        <div className="auth-left-content">
          <h1 className="auth-brand-title">
            Mini Task & Issue Management System
          </h1>
          <p className="auth-brand-tagline">
            Organize your work. Track every task. Ship faster.
          </p>
          <p className="auth-brand-summary">
            Focus on what matters, track progress seamlessly, and keep your projects on schedule.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right-panel">
        <div className="auth-form-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
