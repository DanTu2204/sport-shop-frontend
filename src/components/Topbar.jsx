import React from 'react';
import { Link } from 'react-router-dom';

function Topbar() {
  return (
    <div className="container-fluid">
      <div className="row bg-secondary py-1 px-xl-5">
        <div className="col-lg-6 d-none d-lg-block">
          <div className="d-inline-flex align-items-center h-100">
            <Link className="text-body mr-3" to="/about">Về chúng tôi</Link>
            <Link className="text-body mr-3" to="/contact">Liên hệ</Link>
            <Link className="text-body mr-3" to="/help">Trợ giúp</Link>
            <Link className="text-body mr-3" to="/faq">Câu hỏi thường gặp</Link>
          </div>
        </div>
        <div className="col-lg-6 text-center text-lg-right">
          <div className="d-inline-flex align-items-center">
            <div className="btn-group">
              <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">
                Tài khoản
              </button>
              <div className="dropdown-menu dropdown-menu-right">
                <Link className="dropdown-item" to="/login">Đăng nhập</Link>
                <Link className="dropdown-item" to="/register">Đăng ký</Link>
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
              <span className="badge text-dark border border-dark rounded-circle" style={{ paddingBottom: '2px' }}>0</span>
            </Link>
            <Link to="/cart" className="btn px-0 ml-2">
              <i className="fas fa-shopping-cart text-dark"></i>
              <span className="badge text-dark border border-dark rounded-circle cart-count" style={{ paddingBottom: '2px' }}>0</span>
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
        <div className="col-lg-4 col-6 text-left">
          <form method="get" action="/shop">
            <div className="input-group">
              <input type="text" name="q" className="form-control" placeholder="Tìm kiếm sản phẩm" />
              <div className="input-group-append">
                <button type="submit" className="input-group-text bg-transparent text-primary border-0">
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="col-lg-4 col-6 text-right">
          <p className="m-0">Hỗ trợ Khách hàng</p>
          <h5 className="m-0">0909 123 456</h5>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
