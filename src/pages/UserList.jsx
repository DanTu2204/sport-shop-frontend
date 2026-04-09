import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // We use the direct BASE_API/users route as per assignment requirement
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const response = await axios.get(`${backendUrl}/users`);
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container-fluid pt-5">
      <div className="container">
        <div className="section-title position-relative text-uppercase mx-xl-5 mb-4">
          <span className="bg-secondary pr-3">Danh sách Người dùng (Assignment Test)</span>
        </div>
        
        <div className="row px-xl-5">
          <div className="col-12 table-responsive mb-5">
            <table className="table table-light table-borderless table-hover text-center mb-0">
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>ID (MongoDB)</th>
                  <th>Họ tên</th>
                  <th>Dẫn link Test</th>
                </tr>
              </thead>
              <tbody className="align-middle">
                {loading ? (
                  <tr><td colSpan="4">Đang tải dữ liệu...</td></tr>
                ) : error ? (
                  <tr><td colSpan="4" className="text-danger">Lỗi: {error}</td></tr>
                ) : users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user.id}>
                      <td className="align-middle">{index + 1}</td>
                      <td className="align-middle text-muted" style={{fontSize: '0.8rem'}}>{user.id}</td>
                      <td className="align-middle font-weight-bold">{user.name}</td>
                      <td className="align-middle">
                        <a 
                          href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/users/${user.id}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="btn btn-sm btn-primary"
                        >
                          Xem JSON
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4">Không có người dùng nào.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mb-5 text-center">
            <div className="alert alert-info mx-xl-5">
                <i className="fa fa-info-circle mr-2"></i>
                Đường dẫn Backend Test: 
                <a className="ml-2 font-weight-bold" href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/users`} target="_blank" rel="noreferrer">
                    {import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/users
                </a>
            </div>
        </div>
      </div>
    </div>
  );
}

export default UserList;
