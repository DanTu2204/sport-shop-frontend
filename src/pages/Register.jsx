import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

function Register() {
  const [formData, setFormData] = useState({ fullname: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Mật khẩu và mật khẩu xác nhận không khớp.');
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.post('/api/users/register', formData);
      if (response.data.success || response.status === 200) {
        alert(response.data.message || 'Đăng ký thành công! Hãy đăng nhập.');
        navigate('/login');
      } else {
        setError(response.data.message || 'Lỗi đăng ký');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi hệ thống. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-lg-5">
              <h2 className="text-center mb-4">Đăng ký tài khoản</h2>
              
              {error && (
                <div className="alert alert-danger">
                  <ul className="mb-0 pl-3">
                    <li>{error}</li>
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group col-12">
                    <label htmlFor="fullname">Họ và tên</label>
                    <input type="text" name="fullname" id="fullname" className="form-control" placeholder="Nguyễn Văn A" required value={formData.fullname} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" name="email" id="email" className="form-control" placeholder="example@email.com" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Điện thoại (Không bắt buộc)</label>
                  <input type="tel" name="phone" id="phone" className="form-control" placeholder="09xxxxxxxx" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="inputPassword">Mật khẩu</label>
                    <input type="password" name="password" id="inputPassword" className="form-control" placeholder="Tối thiểu 6 ký tự" required minLength="6" value={formData.password} onChange={handleChange} />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="inputConfirmPassword">Nhập lại mật khẩu</label>
                    <input type="password" name="confirmPassword" id="inputConfirmPassword" className="form-control" placeholder="Nhập lại mật khẩu" required minLength="6" value={formData.confirmPassword} onChange={handleChange} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block py-2" disabled={loading}>
                   {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
                </button>
              </form>

              <p className="text-center mt-3 mb-0">
                Đã có tài khoản? <Link to="/login" className="font-weight-bold">Đăng nhập</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
