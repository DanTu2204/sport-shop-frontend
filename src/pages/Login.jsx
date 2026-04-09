import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Assuming backend has /api/login endpoints
      const response = await axiosClient.post('/api/auth/login', formData);
      if (response.data.success || response.status === 200) {
        alert(response.data.message || 'Đăng nhập thành công');
        navigate('/');
        // Trigger a custom event so Navbar updates immediately
        window.dispatchEvent(new Event('auth-change'));
      } else {
        setError(response.data.message || 'Lỗi đăng nhập');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối hoặc sai tên đăng nhập/mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-lg-5">
              <h2 className="text-center mb-4">Đăng nhập</h2>
              
              {error && (
                <div className="alert alert-danger">
                  <ul className="mb-0 pl-3">
                    <li>{error}</li>
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" name="email" id="email" className="form-control" placeholder="example@email.com" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Mật khẩu</label>
                  <input type="password" name="password" id="password" className="form-control" placeholder="******" required minLength="6" value={formData.password} onChange={handleChange} />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="rememberMe" />
                    <label className="form-check-label" htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
                  </div>
                  <Link to="#" className="text-primary">Quên mật khẩu?</Link>
                </div>
                <button type="submit" className="btn btn-primary btn-block py-2" disabled={loading}>
                  {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>
              </form>

              <p className="text-center mt-3 mb-0">
                Chưa có tài khoản? <Link to="/register" className="font-weight-bold">Đăng ký ngay</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
