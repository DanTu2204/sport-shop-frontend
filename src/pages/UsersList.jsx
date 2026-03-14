import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch from the new /users endpoint
                const res = await api.get('/users');
                setUsers(res.data);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError('Không thể tải danh sách người dùng từ backend.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Danh sách Users</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                <div className="text-center"><div className="spinner-border text-primary" role="status"></div></div>
            ) : (
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-0">
                                <table className="table table-striped table-hover mb-0">
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col" className="text-center">ID</th>
                                            <th scope="col">Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length > 0 ? (
                                            users.map(u => (
                                                <tr key={u.id}>
                                                    <td className="text-center font-weight-bold">{u.id}</td>
                                                    <td>{u.name}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2" className="text-center text-muted py-4">Không có dữ liệu users.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersList;
