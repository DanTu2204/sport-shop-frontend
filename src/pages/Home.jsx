import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient, { getImageUrl } from '../api/axiosClient';

function Home() {
  const [data, setData] = useState({
    banners: [],
    categories: [],
    featuredProducts: [],
    recentProducts: [],
    loading: true
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axiosClient.get('/api/'); 
        if (response.data && response.data.data) {
          // The backend hijack wraps the actual page data inside 'data' property
          setData({
            ...response.data.data,
            loading: false
          });
        } else if (response.data) {
           // Fallback in case backend is changed to return direct JSON
           setData({
            ...response.data,
            loading: false
          });
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchHomeData();
  }, []);

  if (data.loading) {
    return <div className="container text-center py-5">Đang tải...</div>;
  }

  const formatCurrency = (value) => {
     return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }

  return (
    <>
      {/* Carousel */}
      <div className="container-fluid mb-3">
        <div className="row px-xl-5">
          <div className="col-lg-12">
            <div id="header-carousel" className="carousel slide carousel-fade mb-30 mb-lg-0" data-ride="carousel">
              <ol className="carousel-indicators">
                {data.banners?.map((_, index) => (
                  <li key={index} data-target="#header-carousel" data-slide-to={index} className={index === 0 ? "active" : ""}></li>
                ))}
              </ol>
              <div className="carousel-inner">
                {data.banners?.length > 0 ? data.banners.map((banner, index) => (
                  <div key={index} className={`carousel-item position-relative ${index === 0 ? "active" : ""}`} style={{ height: '430px' }}>
                    <img className="position-absolute w-100 h-100" src={getImageUrl(banner.image)} onError={(e) => { e.target.src = '/img/carousel-1.jpg'; }} style={{ objectFit: 'cover' }} alt={banner.title} />
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
                )) : (
                  <div className="carousel-item position-relative active" style={{ height: '430px' }}>
                    <img className="position-absolute w-100 h-100" src="/img/carousel-1.jpg" style={{ objectFit: 'cover' }} alt="Banner" />
                    <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                      <div className="p-3" style={{ maxWidth: '700px' }}>
                        <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">Men Fashion</h1>
                        <p className="mx-md-5 px-5 animate__animated animate__bounceIn">SportShop Collection</p>
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

      {/* Featured Start */}
      <div className="container-fluid pt-5">
        <div className="row px-xl-5 pb-3">
            <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
                <div className="d-flex align-items-center bg-light mb-4" style={{ padding: '30px' }}>
                    <h1 className="fa fa-check text-primary m-0 mr-3"></h1>
                    <h5 className="font-weight-semi-bold m-0">Sản phẩm chất lượng</h5>
                </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
                <div className="d-flex align-items-center bg-light mb-4" style={{ padding: '30px' }}>
                    <h1 className="fa fa-shipping-fast text-primary m-0 mr-2"></h1>
                    <h5 className="font-weight-semi-bold m-0">Miễn phí giao hàng</h5>
                </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
                <div className="d-flex align-items-center bg-light mb-4" style={{ padding: '30px' }}>
                    <h1 className="fas fa-exchange-alt text-primary m-0 mr-3"></h1>
                    <h5 className="font-weight-semi-bold m-0">Đổi trả 14 ngày</h5>
                </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
                <div className="d-flex align-items-center bg-light mb-4" style={{ padding: '30px' }}>
                    <h1 className="fa fa-phone-volume text-primary m-0 mr-3"></h1>
                    <h5 className="font-weight-semi-bold m-0">Hỗ trợ 24/7</h5>
                </div>
            </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container-fluid pt-5">
          <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Danh mục</span></h2>
          <div className="row px-xl-5 pb-3">
              {data.categories?.map((cat, index) => (
                <div key={index} className="col-lg-3 col-md-4 col-sm-6 pb-1">
                    <Link className="text-decoration-none" to={`/shop?category=${cat.name}`}>
                        <div className="cat-item d-flex align-items-center mb-4">
                            <div className="overflow-hidden" style={{ width: '100px', height: '100px' }}>
                                <img className="img-fluid" src={getImageUrl(cat.image) || '/img/cat-1.jpg'} onError={(e) => { e.target.src = '/img/cat-1.jpg'; }} alt={cat.name} />
                            </div>
                            <div className="flex-fill pl-3">
                                <h6>{cat.name}</h6>
                                <small className="text-body">{cat.productCount} Products</small>
                            </div>
                        </div>
                    </Link>
                </div>
              ))}
          </div>
      </div>

      {/* Featured Products */}
      <div className="container-fluid pt-5 pb-3">
          <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Sản phẩm nổi bật</span></h2>
          <div className="row px-xl-5">
              {data.featuredProducts?.map((product, index) => (
                  <div key={index} className="col-lg-3 col-md-4 col-sm-6 pb-1">
                      <div className="product-item bg-light mb-4">
                          <div className="product-img position-relative overflow-hidden">
                              <img className="img-fluid w-100" src={getImageUrl(product.image)} alt={product.name} />
                              <div className="product-action">
                                  <button className="btn btn-outline-dark btn-square"><i className="fa fa-shopping-cart"></i></button>
                                  <Link className="btn btn-outline-dark btn-square" to={`/wishlist?add=${product.id}`}><i className="far fa-heart"></i></Link>
                                  <Link className="btn btn-outline-dark btn-square" to={`/detail?id=${product.id}`} style={{ zIndex: 100, position: 'relative' }}><i className="fa fa-search"></i></Link>
                              </div>
                          </div>
                          <div className="text-center py-4">
                              <Link className="h6 text-decoration-none text-truncate" to={`/detail?id=${product.id}`} style={{ display: 'block', padding: '0 10px' }}>{product.name}</Link>
                              <div className="d-flex align-items-center justify-content-center mt-2">
                                  <h5>{formatCurrency(product.price)}</h5>
                                  {product.oldPrice && <h6 className="text-muted ml-2"><del>{formatCurrency(product.oldPrice)}</del></h6>}
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>

    </>
  );
}

export default Home;
