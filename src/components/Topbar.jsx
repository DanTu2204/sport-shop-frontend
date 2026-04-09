import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function Topbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user, cartCount, wishlistCount, logout } = useAppContext();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = async () => {
     await logout();
     navigate('/login');
  }

  return (
    <div className="container-fluid">
      <div className="row bg-secondary py-1 px-xl-5">
        <div className="col-lg-6 d-none d-lg-block">
          <div className="d-inline-flex align-items-center h-100">
            <Link className="text-body mr-3" to="/about">Về chúng tôi</Link>
            <Link className="text-body mr-3" to="/help">Trợ giúp</Link>
            <Link className="text-body mr-3" to="/faq">Câu hỏi thường gặp</Link>
          </div>
        </div>
        <div className="col-lg-6 text-center text-lg-right">
          <div className="d-inline-flex align-items-center">
            <div className="btn-group">
              <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">
                {user ? `Xin chào, ${user.name}` : 'Tài khoản'}
              </button>
              <div className="dropdown-menu dropdown-menu-right">
                {user ? (
                  <>
                    <Link className="dropdown-item" to="/profile">Hồ sơ cá nhân</Link>
                    <Link className="dropdown-item" to="/orders">Đơn hàng của tôi</Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>Đăng xuất</button>
                  </>
                ) : (
                  <>
                    <Link className="dropdown-item" to="/login">Đăng nhập</Link>
                    <Link className="dropdown-item" to="/register">Đăng ký</Link>
                  </>
                )}
              </div>
            </div>
            <div className="btn-group mx-2">
              <span className="btn btn-sm btn-light disabled">VND</span>
            </div>
            <div className="btn-group">
              <span className="btn btn-sm btn-light disabled">Ngôn ngữ: VI</span>
            </div>
          </div>
          <div className="d-inline-flex align-items-center d-block d-lg-none">
            <Link to="/wishlist" className="btn px-0 ml-2">
              <i className="fas fa-heart text-dark"></i>
              <span className="badge text-dark border border-dark rounded-circle" style={{ paddingBottom: '2px' }}>{wishlistCount}</span>
            </Link>
            <Link to="/cart" className="btn px-0 ml-2">
              <i className="fas fa-shopping-cart text-dark"></i>
              <span className="badge text-dark border border-dark rounded-circle cart-count" style={{ paddingBottom: '2px' }}>{cartCount}</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="row align-items-center bg-light py-3 px-xl-5 d-none d-lg-flex">
        <div className="col-lg-4">
          <Link to="/" className="text-decoration-none">
            <span className="h1 text-uppercase text-primary bg-dark px-2">Sport</span>
            <span className="h1 text-uppercase text-dark bg-primary px-2 ml-n1">Shop</span>
          </Link>
        </div>
        <div className="col-lg-4 col-6 text-center">
          <form onSubmit={handleSearch}>
            <div className="input-group">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Tìm kiếm sản phẩm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="input-group-append">
                <button type="submit" className="input-group-text bg-transparent text-primary border-0">
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="col-lg-4 col-6 text-right">
          <p className="m-0 text-muted" style={{ fontSize: '14px' }}>Hỗ trợ Khách hàng</p>
          <h5 className="m-0" style={{ fontWeight: '700' }}>0909 123 456</h5>
        </div>
      </div>
    </div>
  );
}


export default Topbar;
