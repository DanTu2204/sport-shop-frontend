import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import './AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = async () => {
        try {
            await api.post('/logout');
            localStorage.removeItem('user');
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    if (!user || user.role !== 'admin') {
        return (
            <div className="admin-unauthorized">
                <h2>Access Denied</h2>
                <p>You must be an administrator to view this page.</p>
                <Link to="/login" className="btn btn-primary">Return to Login</Link>
            </div>
        );
    }

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <h2>Sport Admin</h2>
                </div>
                <nav className="admin-nav">
                    <Link to="/admin" className={`admin-nav-item ${isActive('/admin')}`}>
                        Dashboard
                    </Link>
                    <Link to="/admin/category" className={`admin-nav-item ${isActive('/admin/category')}`}>
                        Categories
                    </Link>
                    <Link to="/admin/product" className={`admin-nav-item ${isActive('/admin/product')}`}>
                        Products
                    </Link>
                    <Link to="/admin/customers" className={`admin-nav-item ${isActive('/admin/customers')}`}>
                        Customers
                    </Link>
                    <Link to="/admin/contact" className={`admin-nav-item ${isActive('/admin/contact')}`}>
                        Messages
                    </Link>
                </nav>
                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        <div className="admin-avatar">A</div>
                        <div>
                            <div className="admin-name">{user.name || 'Admin'}</div>
                            <div className="admin-role">Administrator</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="admin-logout-btn">
                        Logout
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-topbar">
                    <div className="admin-topbar-title">Control Panel</div>
                </header>
                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
