import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './Home.css';

const Home = () => {
    const [data, setData] = useState({
        categories: [],
        featuredProducts: [],
        recentProducts: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const res = await api.get('/');
                if (res.data.success) {
                    setData({
                        categories: res.data.categories || [],
                        featuredProducts: res.data.featuredProducts || [],
                        recentProducts: res.data.recentProducts || []
                    });
                } else {
                    setError('Không thể tải dữ liệu trang chủ.');
                }
            } catch (err) {
                setError('Lỗi kết nối server.');
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    if (loading) {
        return (
            <div className="home-container">
                <div className="loading-spinner">Đang tải Trang chủ...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="home-container">
                <div className="auth-error" style={{ marginTop: '2rem' }}>{error}</div>
            </div>
        );
    }

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="logo text-gradient">SportShop</div>
                <nav className="nav-links">
                    <Link to="/" className="nav-link">Trang chủ</Link>
                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="nav-link" style={{ color: 'var(--primary)' }}>Quản trị</Link>
                            )}
                            <span className="nav-link" style={{ opacity: 0.6 }}>Chào, {user.name}</span>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Đăng nhập</Link>
                            <Link to="/register" className="btn btn-primary">Đăng ký</Link>
                        </>
                    )}
                </nav>
            </header>

            <section className="category-section">
                <h2 className="section-title">Danh mục Sản phẩm</h2>
                <div className="category-scroll">
                    {data.categories.length > 0 ? (
                        data.categories.map(cat => (
                            <div key={cat._id || cat.name} className="category-card glass-panel">
                                <h3 className="category-name">{cat.name}</h3>
                                <div className="category-count">{cat.productCount} sản phẩm</div>
                            </div>
                        ))
                    ) : (
                        <div className="no-image">Chưa có danh mục nào.</div>
                    )}
                </div>
            </section>

            <section className="product-section">
                <h2 className="section-title">Sản phẩm Nổi bật</h2>
                <div className="product-grid">
                    {data.featuredProducts.length > 0 ? (
                        data.featuredProducts.map(product => (
                            <div key={product.id || product._id} className="product-card glass-panel">
                                <div className="product-image-container">
                                    {product.image ? (
                                        <img src={`http://localhost:3000${product.image}`} alt={product.name} className="product-image" />
                                    ) : (
                                        <div className="no-image">No Image</div>
                                    )}
                                </div>
                                <div className="product-info">
                                    <h3 className="product-name" title={product.name}>{product.name}</h3>
                                    <div className="product-price">{(product.price * 1000).toLocaleString('vi-VN')} đ</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-image" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>Không có sản phẩm nào.</div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
