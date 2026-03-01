import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Header = () => {
    const [categories, setCategories] = useState([]);
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch categories from the backend
        api.get('/').then(res => {
            if (res.data.success && res.data.categories) {
                setCategories(res.data.categories);
            }
        }).catch(err => console.error("Error fetching categories for header:", err));

        // Get user from localStorage or session
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'null') {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = async () => {
        try {
            await api.get('/logout');
            localStorage.removeItem('user');
            setUser(null);
            navigate('/');
        } catch (err) {
            console.error("Logout error", err);
            localStorage.removeItem('user');
            setUser(null);
            navigate('/');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Just redirect to shop with query, assuming Shop page exists eventually
        // navigate(`/shop?q=${searchQuery}`);
    };

    return (
        <header>
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
                                    {user ? `Xin chào, ${user.name}` : 'Tài khoản'}
                                </button>
                                <div className="dropdown-menu dropdown-menu-right">
                                    {user ? (
                                        <>
                                            <span className="dropdown-item-text text-muted small">{user.email}</span>
                                            <a className="dropdown-item text-primary font-weight-bold" href="https://sport-shop-backend.onrender.com/admin">
                                                <i className="fas fa-user-shield mr-2"></i>Quản trị Admin
                                            </a>
                                            <div className="dropdown-divider"></div>
                                            <button className="dropdown-item text-danger" onClick={handleLogout}>Đăng xuất</button>
                                        </>
                                    ) : (
                                        <>
                                            <Link className="dropdown-item" to="/login">Đăng nhập</Link>
                                            <Link className="dropdown-item" to="/register">Đăng ký</Link>
                                            <div className="dropdown-divider"></div>
                                            <a className="dropdown-item text-primary" href="https://sport-shop-backend.onrender.com/admin">
                                                <i class="fas fa-lock-open mr-2"></i>Vào Admin
                                            </a>
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
                        <form onSubmit={handleSearch}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm kiếm sản phẩm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
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
                        <p className="m-0">Hỗ trợ Khách hàng</p>
                        <h5 className="m-0">0909 123 456</h5>
                    </div>
                </div>
            </div>

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
                                {categories.map(cat => (
                                    <Link key={cat._id} to={`/shop?category=${cat.name}`} className="nav-item nav-link">{cat.name}</Link>
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
                                    <Link to="/" className="nav-item nav-link">Trang chủ</Link>
                                    <Link to="/shop" className="nav-item nav-link">Cửa hàng</Link>
                                    <Link to="/detail" className="nav-item nav-link">Chi tiết SP</Link>
                                    <div className="nav-item dropdown">
                                        <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">Trang <i className="fa fa-angle-down mt-1"></i></a>
                                        <div className="dropdown-menu bg-primary rounded-0 border-0 m-0">
                                            <Link to="/cart" className="dropdown-item">Giỏ hàng</Link>
                                            <Link to="/checkout" className="dropdown-item">Thanh toán</Link>
                                        </div>
                                    </div>
                                    <Link to="/contact" className="nav-item nav-link">Liên hệ</Link>
                                </div>
                                <div className="navbar-nav ml-auto py-0 d-none d-lg-block">
                                    <Link to="/orders" className="btn px-0" title="Đơn hàng của tôi">
                                        <i className="fas fa-file-invoice text-primary"></i>
                                    </Link>
                                    <Link to="/wishlist" className="btn px-0 ml-3">
                                        <i className="fas fa-heart text-primary"></i>
                                        <span className="badge text-secondary border border-secondary rounded-circle" style={{ paddingBottom: '2px' }}>0</span>
                                    </Link>
                                    <Link to="/cart" className="btn px-0 ml-3">
                                        <i className="fas fa-shopping-cart text-primary"></i>
                                        <span className="badge text-secondary border border-secondary rounded-circle cart-count" style={{ paddingBottom: '2px' }}>0</span>
                                    </Link>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
