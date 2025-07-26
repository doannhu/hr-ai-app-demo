import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginEmployer } from '../api';

/**
 * EmployerLogin renders a modern, centered login card for employers.
 * Includes error feedback and a show/hide password toggle.
 */
const EmployerLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await loginEmployer({ username, password });
      localStorage.setItem('authToken', response.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Sai tên đăng nhập hoặc mật khẩu, hoặc không thể đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h2>Đăng nhập nhà tuyển dụng</h2>
      <p className="login-desc">Vui lòng đăng nhập để xem thông tin ứng viên và đánh giá AI.</p>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} autoComplete="on">
        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Nhập tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <div className="password-row">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="show-hide"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? 'Ẩn' : 'Hiện'}
            </button>
          </div>
        </div>
        <button className="primary" type="submit" disabled={loading}>
          {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>
      </form>
      <div className="footer">
        <p><a href="/">Quay lại form ứng viên</a></p>
      </div>
    </div>
  );
};

export default EmployerLogin;