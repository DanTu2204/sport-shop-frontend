import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

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
                navigate(res.data.redirect === '/admin' ? '/admin' : '/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi đăng nhập');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel">
                <h2 className="auth-title">Welcome Back</h2>
                {error && <div className="auth-error animate-shake">{error}</div>}
                <form onSubmit={handleLogin} className="auth-form">
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="premium-input"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="premium-input"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary auth-btn"
                        disabled={loading}
                    >
                        {loading ? <span className="spinner"></span> : 'Sign In'}
                    </button>
                </form>
                <div className="auth-footer">
                    New here? <Link to="/register" className="auth-link">Create an account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
