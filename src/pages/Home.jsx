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
        <>
            {/* Carousel Start */}
            <div className="container-fluid mb-3">
                <div className="row px-xl-5">
                    <div className="col-lg-12">
                        <div id="header-carousel" className="carousel slide carousel-fade mb-30 mb-lg-0" data-ride="carousel">
                            <ol className="carousel-indicators">
                                {data.banners && data.banners.map((b, idx) => (
                                    <li key={idx} data-target="#header-carousel" data-slide-to={idx} className={idx === 0 ? "active" : ""}></li>
                                ))}
                                {(!data.banners || data.banners.length === 0) && (
                                    <li data-target="#header-carousel" data-slide-to="0" className="active"></li>
                                )}
                            </ol>
                            <div className="carousel-inner">
                                {data.banners && data.banners.length > 0 ? (
                                    data.banners.map((banner, idx) => (
                                        <div key={idx} className={`carousel-item position-relative ${idx === 0 ? 'active' : ''}`} style={{ height: '430px' }}>
                                            <img className="position-absolute w-100 h-100" src={banner.image} style={{ objectFit: 'cover' }} alt={banner.title} />
                                            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                                                <div className="p-3" style={{ maxWidth: '700px' }}>
                                                    <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">{banner.title}</h1>
                                                    <p className="mx-md-5 px-5 animate__animated animate__bounceIn">{banner.description}</p>
                                                    {banner.link && (
                                                        <a className="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href={banner.link}>Shop Now</a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="carousel-item position-relative active" style={{ height: '430px' }}>
                                        <img className="position-absolute w-100 h-100" src="img/carousel-1.jpg" style={{ objectFit: 'cover' }} alt="Default banner" />
                                        <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                                            <div className="p-3" style={{ maxWidth: '700px' }}>
                                                <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">Men Fashion</h1>
                                                <p className="mx-md-5 px-5 animate__animated animate__bounceIn">Lorem rebum magna amet lorem magna erat diam stet. Sadips duo stet amet amet ndiam elitr ipsum diam</p>
                                                <Link className="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" to="/shop">Shop Now</Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Carousel End */}

            {/* Featured Start */}
            <div className="container-fluid pt-5">
                <div className="row px-xl-5 pb-3">
                    <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
                        <div className="d-flex align-items-center bg-light mb-4" style={{ padding: '30px' }}>
                            <h1 className="fa fa-check text-primary m-0 mr-3"></h1>
                            <h5 className="font-weight-semi-bold m-0">Quality Product</h5>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
                        <div className="d-flex align-items-center bg-light mb-4" style={{ padding: '30px' }}>
                            <h1 className="fa fa-shipping-fast text-primary m-0 mr-2"></h1>
                            <h5 className="font-weight-semi-bold m-0">Free Shipping</h5>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
                        <div className="d-flex align-items-center bg-light mb-4" style={{ padding: '30px' }}>
                            <h1 className="fas fa-exchange-alt text-primary m-0 mr-3"></h1>
                            <h5 className="font-weight-semi-bold m-0">14-Day Return</h5>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
                        <div className="d-flex align-items-center bg-light mb-4" style={{ padding: '30px' }}>
                            <h1 className="fa fa-phone-volume text-primary m-0 mr-3"></h1>
                            <h5 className="font-weight-semi-bold m-0">24/7 Support</h5>
                        </div>
                    </div>
                </div>
            </div>
            {/* Featured End */}

            {/* Categories Start */}
            <div className="container-fluid pt-5">
                <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Categories</span></h2>
                <div className="row px-xl-5 pb-3">
                    {data.categories && data.categories.length > 0 ? (
                        data.categories.map(cat => (
                            <div key={cat._id || cat.name} className="col-lg-3 col-md-4 col-sm-6 pb-1">
                                <Link className="text-decoration-none" to={`/shop?category=${cat.name}`}>
                                    <div className="cat-item d-flex align-items-center mb-4">
                                        <div className="overflow-hidden" style={{ width: '100px', height: '100px' }}>
                                            <img className="img-fluid" src={cat.image || 'img/cat-1.jpg'} alt={cat.name} />
                                        </div>
                                        <div className="flex-fill pl-3">
                                            <h6>{cat.name}</h6>
                                            <small className="text-body">{cat.productCount} Products</small>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="col-12"><p className="text-center">Chưa có danh mục nào.</p></div>
                    )}
                </div>
            </div>
            {/* Categories End */}

            {/* Products Start */}
            <div className="container-fluid pt-5 pb-3">
                <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Featured Products</span></h2>
                <div className="row px-xl-5">
                    {data.featuredProducts && data.featuredProducts.length > 0 ? (
                        data.featuredProducts.map(product => (
                            <div key={product.id || product._id} className="col-lg-3 col-md-4 col-sm-6 pb-1">
                                <div className="product-item bg-light mb-4">
                                    <div className="product-img position-relative overflow-hidden">
                                        <img className="img-fluid w-100" src={product.image ? (product.image.startsWith('http') ? product.image : `https://sport-shop-backend.onrender.com${product.image}`) : `img/product-1.jpg`} alt={product.name} />
                                        <div className="product-action">
                                            <Link className="btn btn-outline-dark btn-square" to="#"><i className="fa fa-shopping-cart"></i></Link>
                                            <Link className="btn btn-outline-dark btn-square" to="#"><i className="far fa-heart"></i></Link>
                                            <Link className="btn btn-outline-dark btn-square" to={`/detail?id=${product.id || product._id}`}><i className="fa fa-search"></i></Link>
                                        </div>
                                    </div>
                                    <div className="text-center py-4">
                                        <Link className="h6 text-decoration-none text-truncate" to={`/detail?id=${product.id || product._id}`} style={{ display: 'block', padding: '0 10px' }}>{product.name}</Link>
                                        <div className="d-flex align-items-center justify-content-center mt-2">
                                            <h5>{(product.price * 1000).toLocaleString('vi-VN')} đ</h5>
                                            {product.oldPrice && <h6 className="text-muted ml-2"><del>{(product.oldPrice * 1000).toLocaleString('vi-VN')} đ</del></h6>}
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center mb-1">
                                            {[...Array(Math.round(product.stars || 5))].map((e, i) => <small key={i} className="fa fa-star text-primary mr-1"></small>)}
                                            <small>({product.reviews || 0})</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12"><p className="text-center">Chưa có sản phẩm nào.</p></div>
                    )}
                </div>
            </div>
            {/* Products End */}

            {/* Offer Start */}
            <div className="container-fluid pt-5 pb-3">
                <div className="row px-xl-5">
                    <div className="col-md-6">
                        <div className="product-offer mb-30" style={{ height: '300px' }}>
                            <img className="img-fluid" src="img/offer-1.jpg" alt="" />
                            <div className="offer-text">
                                <h6 className="text-white text-uppercase">Save 20%</h6>
                                <h3 className="text-white mb-3">Special Offer</h3>
                                <Link to="/shop" className="btn btn-primary">Shop Now</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="product-offer mb-30" style={{ height: '300px' }}>
                            <img className="img-fluid" src="img/offer-2.jpg" alt="" />
                            <div className="offer-text">
                                <h6 className="text-white text-uppercase">Save 20%</h6>
                                <h3 className="text-white mb-3">Special Offer</h3>
                                <Link to="/shop" className="btn btn-primary">Shop Now</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Offer End */}

            {/* Recent Products Start */}
            <div className="container-fluid pt-5 pb-3">
                <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Recent Products</span></h2>
                <div className="row px-xl-5">
                    {data.recentProducts && data.recentProducts.length > 0 ? (
                        data.recentProducts.map(product => (
                            <div key={product.id || product._id} className="col-lg-3 col-md-4 col-sm-6 pb-1">
                                <div className="product-item bg-light mb-4">
                                    <div className="product-img position-relative overflow-hidden">
                                        <img className="img-fluid w-100" src={product.image ? (product.image.startsWith('http') ? product.image : `https://sport-shop-backend.onrender.com${product.image}`) : `img/product-1.jpg`} alt={product.name} />
                                        <div className="product-action">
                                            <Link className="btn btn-outline-dark btn-square" to="#"><i className="fa fa-shopping-cart"></i></Link>
                                            <Link className="btn btn-outline-dark btn-square" to="#"><i className="far fa-heart"></i></Link>
                                            <Link className="btn btn-outline-dark btn-square" to={`/detail?id=${product.id || product._id}`}><i className="fa fa-search"></i></Link>
                                        </div>
                                    </div>
                                    <div className="text-center py-4">
                                        <Link className="h6 text-decoration-none text-truncate" to={`/detail?id=${product.id || product._id}`} style={{ display: 'block', padding: '0 10px' }}>{product.name}</Link>
                                        <div className="d-flex align-items-center justify-content-center mt-2">
                                            <h5>{(product.price * 1000).toLocaleString('vi-VN')} đ</h5>
                                            {product.oldPrice && <h6 className="text-muted ml-2"><del>{(product.oldPrice * 1000).toLocaleString('vi-VN')} đ</del></h6>}
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center mb-1">
                                            {[...Array(Math.round(product.stars || 5))].map((e, i) => <small key={i} className="fa fa-star text-primary mr-1"></small>)}
                                            <small>({product.reviews || 0})</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12"><p className="text-center">Chưa có sản phẩm nào.</p></div>
                    )}
                </div>
            </div>
            {/* Recent Products End */}

            {/* Vendor Start */}
            <div className="container-fluid py-5">
                <div className="row px-xl-5">
                    <div className="col">
                        <div className="owl-carousel vendor-carousel d-flex align-items-center justify-content-around">
                            <div className="bg-light p-4"><img src="img/vendor-1.jpg" alt="" style={{ width: 'auto' }} /></div>
                            <div className="bg-light p-4"><img src="img/vendor-2.jpg" alt="" style={{ width: 'auto' }} /></div>
                            <div className="bg-light p-4"><img src="img/vendor-3.jpg" alt="" style={{ width: 'auto' }} /></div>
                            <div className="bg-light p-4"><img src="img/vendor-4.jpg" alt="" style={{ width: 'auto' }} /></div>
                            <div className="bg-light p-4"><img src="img/vendor-5.jpg" alt="" style={{ width: 'auto' }} /></div>
                            <div className="bg-light p-4"><img src="img/vendor-6.jpg" alt="" style={{ width: 'auto' }} /></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Vendor End */}
        </>
    );
};

export default Home;
