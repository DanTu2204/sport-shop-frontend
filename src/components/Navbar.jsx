import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

import { useAppContext } from '../context/AppContext';

function Navbar() {
  const [categories, setCategories] = useState([]);
  const { user } = useAppContext();

  useEffect(() => {
    // In a real app, you'd fetch this from your backend
    // For now, we'll mock or leave it empty, or fetch if API is ready
    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get('/api/categories');
        if (response.data && response.data.categories) {
          setCategories(response.data.categories);
        } else if (response.data && response.data.data && response.data.data.categories) {
           setCategories(response.data.data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories(); 
  }, []);

  return (
    <div className="container-fluid bg-dark mb-30">
        <div className="row px-xl-5">
            <div className="col-lg-3 d-none d-lg-block">
                <a className="btn d-flex align-items-center justify-content-between bg-primary w-100" data-toggle="collapse"
                    href="#navbar-vertical" style={{ height: '65px', padding: '0 30px' }}>
                    <h6 className="text-dark m-0"><i className="fa fa-bars mr-2"></i>Danh mục</h6>
                    <i className="fa fa-angle-down text-dark"></i>
                </a>
                <nav className="collapse position-absolute navbar navbar-vertical navbar-light align-items-start p-0 bg-light"
                    id="navbar-vertical" style={{ width: 'calc(100% - 30px)', zIndex: 999 }}>
                    <div className="navbar-nav w-100">
                        {categories.map((cat, index) => (
                          <Link key={index} to={`/shop?category=${cat.name}`} className="nav-item nav-link">{cat.name}</Link>
                        ))}
                    </div>
                </nav>
            </div>
            <div className="col-lg-9">
                <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 py-lg-0 px-0">
                    <Link to="/" className="text-decoration-none d-block d-lg-none">
                        <span className="h1 text-uppercase text-dark bg-light px-2">Sport</span>
                        <span className="h1 text-uppercase text-light bg-primary px-2 ml-n1">Shop</span>
                    </Link>
                    <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                        <div className="navbar-nav mr-auto py-0">
                            <Link to="/" className="nav-item nav-link active">Trang chủ</Link>
                            <Link to="/shop" className="nav-item nav-link">Cửa hàng</Link>
                            <div className="nav-item dropdown">
                                <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">Trang <i className="fa fa-angle-down mt-1"></i></a>
                                <div className="dropdown-menu bg-primary rounded-0 border-0 m-0">
                                    <Link to="/cart" className="dropdown-item">Giỏ hàng</Link>
                                    <Link to="/checkout" className="dropdown-item">Thanh toán</Link>
                                </div>
                            </div>
                            <Link to="/contact" className="nav-item nav-link">Liên hệ</Link>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    </div>
  );
}

export default Navbar;
