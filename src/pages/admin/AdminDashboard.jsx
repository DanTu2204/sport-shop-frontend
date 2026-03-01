import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/admin');
                if (res.data.success) {
                    setData(res.data);
                } else {
                    setError(res.data.message);
                }
            } catch (err) {
                setError('Lỗi tải dữ liệu dashboard: ' + err.message);
                if (err.response?.status === 403 || err.response?.status === 401) {
                    // Let the layout handle unauthorized access if possible, or force redirect
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) return <div className="admin-loading">Loading dashboard...</div>;
    if (error) return <div className="admin-error">{error}</div>;
    if (!data) return null;

    const { stats } = data;

    return (
        <div className="admin-dashboard">
            <h2 className="admin-page-title">Overview</h2>

            <div className="stats-grid">
                <div className="stat-card glass-panel">
                    <div className="stat-icon bg-blue">📦</div>
                    <div className="stat-info">
                        <h3>Products</h3>
                        <div className="stat-value">{stats.products}</div>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon bg-green">🏷️</div>
                    <div className="stat-info">
                        <h3>Categories</h3>
                        <div className="stat-value">{stats.categories}</div>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon bg-purple">👥</div>
                    <div className="stat-info">
                        <h3>Customers</h3>
                        <div className="stat-value">{stats.customers}</div>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon bg-orange">🛒</div>
                    <div className="stat-info">
                        <h3>Orders</h3>
                        <div className="stat-value">{stats.orders}</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-widgets">
                <div className="widget glass-panel">
                    <h3 className="widget-title">Recent Activity</h3>
                    <p className="text-secondary p-4 text-center">No recent activity detected.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
