import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/login', { email, password });
            if (res.data.success) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                if (res.data.user.role === 'admin') {
                    window.location.href = 'https://sport-shop-backend.onrender.com/admin';
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi đăng nhập');
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

                            <form onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="form-control"
                                        placeholder="example@email.com"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Mật khẩu</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        name="password"
                                        id="password"
                                        className="form-control"
                                        placeholder="******"
                                        required
                                        minLength="6"
                                    />
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="1" id="rememberMe" />
                                        <label className="form-check-label" htmlFor="rememberMe">
                                            Ghi nhớ đăng nhập
                                        </label>
                                    </div>
                                    <a href="#" className="text-primary">Quên mật khẩu?</a>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block py-2" disabled={loading}>
                                    {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                                </button>
                            </form>

                            <p className="text-center mt-3 mb-0">
                                Chưa có tài khoản?{' '}
                                <Link to="/register" className="font-weight-bold">Đăng ký ngay</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
