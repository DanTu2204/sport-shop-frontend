import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/product');
            if (res.data.success) {
                setProducts(res.data.products);
                setStats(res.data.stats);
            }
        } catch (err) {
            setError('Lỗi tải dữ liệu sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                const res = await api.get(`/admin/product/delete/${id}`);
                if (res.data.success) {
                    fetchProducts(); // reload list
                }
            } catch (err) {
                alert('Lỗi xóa sản phẩm');
            }
        }
    };

    if (loading) return <div className="admin-loading">Đang tải sản phẩm...</div>;
    if (error) return <div className="admin-error">{error}</div>;

    return (
        <div className="admin-products">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="admin-page-title" style={{ marginBottom: 0 }}>Quản lý Sản phẩm</h2>
                <button className="btn btn-primary">+ Thêm sản phẩm mới</button>
            </div>

            {stats && (
                <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                    <div className="stat-card glass-panel" style={{ padding: '1rem' }}>
                        <div className="stat-info">
                            <h3 style={{ fontSize: '0.85rem' }}>Tổng số</h3>
                            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{stats.totalProducts}</div>
                        </div>
                    </div>
                    <div className="stat-card glass-panel" style={{ padding: '1rem', borderLeft: '4px solid #10b981' }}>
                        <div className="stat-info">
                            <h3 style={{ fontSize: '0.85rem' }}>Còn hàng {'>'} 10</h3>
                            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#10b981' }}>{stats.inStock}</div>
                        </div>
                    </div>
                    <div className="stat-card glass-panel" style={{ padding: '1rem', borderLeft: '4px solid #f59e0b' }}>
                        <div className="stat-info">
                            <h3 style={{ fontSize: '0.85rem' }}>Sắp hết {'<='} 10</h3>
                            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#f59e0b' }}>{stats.lowStock}</div>
                        </div>
                    </div>
                    <div className="stat-card glass-panel" style={{ padding: '1rem', borderLeft: '4px solid #ef4444' }}>
                        <div className="stat-info">
                            <h3 style={{ fontSize: '0.85rem' }}>Hết hàng</h3>
                            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#ef4444' }}>{stats.outOfStock}</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="widget glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
                            <th style={{ padding: '1rem' }}>Hình ảnh</th>
                            <th style={{ padding: '1rem' }}>Tên sản phẩm</th>
                            <th style={{ padding: '1rem' }}>Danh mục</th>
                            <th style={{ padding: '1rem' }}>Giá</th>
                            <th style={{ padding: '1rem' }}>Tồn kho</th>
                            <th style={{ padding: '1rem' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ width: '50px', height: '50px', backgroundColor: '#eee', borderRadius: '8px', overflow: 'hideen' }}>
                                        {product.image && <img src={product.image.startsWith('http') ? product.image : `https://sport-shop-backend.onrender.com${product.image}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{product.name}</td>
                                <td style={{ padding: '1rem' }}>{product.category}</td>
                                <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                                    {(product.price * 1000).toLocaleString('vi-VN')} đ
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        backgroundColor: product.quantity === 0 ? '#fee2e2' : (product.quantity <= 10 ? '#fef3c7' : '#d1fae5'),
                                        color: product.quantity === 0 ? '#ef4444' : (product.quantity <= 10 ? '#d97706' : '#059669'),
                                        fontSize: '0.85rem',
                                        fontWeight: 600
                                    }}>
                                        {product.quantity}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>Sửa</button>
                                        <button onClick={() => handleDelete(product._id)} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem', color: '#ef4444', borderColor: '#fee2e2' }}>Xóa</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Không có sản phẩm nào</div>}
            </div>
        </div>
    );
};

export default AdminProducts;
