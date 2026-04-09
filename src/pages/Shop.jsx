import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axiosClient, { getImageUrl } from '../api/axiosClient';
import { useAppContext } from '../context/AppContext';

function Shop() {
  const { addToCart, addToWishlist } = useAppContext();
  const [data, setData] = useState({
    products: [],
    categories: [],
    loading: true,
    error: null,
  });
  const location = useLocation();

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const response = await axiosClient.get(`/api/shop?${queryParams.toString()}`);
        if (response.data && response.data.data) {
          setData({
            ...response.data.data,
            loading: false,
          });
        } else if (response.data) {
          setData({
            ...response.data,
            loading: false,
          });
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
        setData(prev => ({ ...prev, loading: false, error: error.message }));
      }
    };

    fetchShopData();
  }, [location.search]);

  if (data.loading) {
    return <div className="container text-center py-5">Đang tải cửa hàng...</div>;
  }

  const formatCurrency = (value) => {
     return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }

  return (
    <div className="container-fluid">
      <div className="row px-xl-5">
        {/* Lọc bên trái */}
        <div className="col-lg-3 col-md-4">
          <h5 className="section-title position-relative text-uppercase mb-3">
              <span className="bg-secondary pr-3">Lọc theo Danh mục</span>
          </h5>
          <div className="bg-light p-4 mb-30">
            {data.categories?.map((cat, index) => (
               <div key={index} className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                  <Link to={`/shop?category=${cat.name}`} className="text-dark">{cat.name}</Link>
               </div>
            ))}
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="col-lg-9 col-md-8">
          <div className="row pb-3">
            <div className="col-12 pb-1">
              <div className="d-flex align-items-center justify-content-between mb-4">
                  {/* Sorting placeholders */}
                  <div>
                      <h4>Sản phẩm</h4>
                  </div>
              </div>
            </div>

            {data.products?.length > 0 ? (
              data.products.map((product, index) => (
                <div key={index} className="col-lg-4 col-md-6 col-sm-6 pb-1">
                  <div className="product-item bg-light mb-4">
                    <div className="product-img position-relative overflow-hidden">
                        <img className="img-fluid w-100" src={getImageUrl(product.image)} alt={product.name} />
                        <div className="product-action">
                            {product.quantity > 0 ? (
                                <button className="btn btn-outline-dark btn-square" title="Thêm vào giỏ" onClick={() => addToCart(product)}><i className="fa fa-shopping-cart"></i></button>
                            ) : (
                                <button className="btn btn-outline-dark btn-square disabled" title="Hết hàng" disabled><i className="fa fa-hourglass-half"></i></button>
                            )}
                            <button className="btn btn-outline-dark btn-square" title="Yêu thích" onClick={() => addToWishlist(product.id)}><i className="far fa-heart"></i></button>
                            <Link className="btn btn-outline-dark btn-square" to={`/detail?id=${product.id}`} title="Xem chi tiết" style={{ zIndex: 100, position: 'relative' }}><i className="fa fa-search"></i></Link>
                        </div>
                    </div>
                    <div className="text-center py-4">
                        <Link className="h6 text-decoration-none text-truncate" to={`/detail?id=${product.id}`}>{product.name}</Link>
                        <div className="d-flex align-items-center justify-content-center mt-2">
                            <h5>{formatCurrency(product.price)}</h5>
                            {product.oldPrice && <h6 className="text-muted ml-2"><del>{formatCurrency(product.oldPrice)}</del></h6>}
                        </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                  <p className="text-muted">Không tìm thấy sản phẩm nào.</p>
                  <Link to="/shop" className="btn btn-primary">Xem tất cả sản phẩm</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;
