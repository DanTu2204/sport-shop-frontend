import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';


const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/register', formData);
            if (res.data.success) {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
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

                            <form onSubmit={handleRegister}>
                                <div className="form-row">
                                    <div className="form-group col-12">
                                        <label htmlFor="fullname">Họ và tên</label>
                                        <input
                                            value={formData.name}
                                            onChange={handleChange}
                                            type="text"
                                            name="name"
                                            id="fullname"
                                            className="form-control"
                                            placeholder="Nguyễn Văn A"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        value={formData.email}
                                        onChange={handleChange}
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="form-control"
                                        placeholder="example@email.com"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Điện thoại (Không bắt buộc)</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        onChange={handleChange}
                                        id="phone"
                                        className="form-control"
                                        placeholder="09xxxxxxxx"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="inputPassword">Mật khẩu</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            name="password"
                                            id="inputPassword"
                                            className="form-control"
                                            placeholder="Tối thiểu 6 ký tự"
                                            required
                                            minLength="6"
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label htmlFor="inputConfirmPassword">Nhập lại mật khẩu</label>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            name="confirmPassword"
                                            id="inputConfirmPassword"
                                            className="form-control"
                                            placeholder="Nhập lại mật khẩu"
                                            required
                                            minLength="6"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block py-2" disabled={loading}>
                                    {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
                                </button>
                            </form>

                            <p className="text-center mt-3 mb-0">
                                Đã có tài khoản?{' '}
                                <Link to="/login" className="font-weight-bold">Đăng nhập</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
