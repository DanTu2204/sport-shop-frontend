import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axiosClient, { getImageUrl } from '../api/axiosClient';

function Detail() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const [data, setData] = useState({
    product: null,
    relatedProducts: [],
    reviews: [],
    reviewCount: 0,
    loading: true,
    error: null
  });
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', comment: '', stars: 5 });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axiosClient.get(`/api/detail?id=${productId}`);
        if (response.data && response.data.data) {
          setData({ ...response.data.data, loading: false });
        } else if (response.data) {
          setData({ ...response.data, loading: false });
        }
      } catch (error) {
        setData(prev => ({ ...prev, loading: false, error: error.message }));
      }
    };
    if (productId) fetchDetail();
  }, [productId]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/api/cart/add', {
        id: data.product.id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.image,
        qty: qty
      });
      alert('Đã thêm vào giỏ hàng!');
    } catch (error) {
      alert('Lỗi thêm giỏ hàng.');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post(`/api/products/${productId}/review`, reviewForm);
      alert('Đã gửi đánh giá thành công!');
      window.location.reload(); // Refresh to see review
    } catch (error) {
      alert('Lỗi gửi đánh giá. Vui lòng đăng nhập.');
    }
  };

  if (data.loading) return <div className="container py-5 text-center">Đang tải chi tiết sản phẩm...</div>;
  if (data.error || !data.product) return <div className="container py-5 text-center">Không tìm thấy sản phẩm.</div>;

  const product = data.product;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="container-fluid pb-5">
      <div className="row px-xl-5">
        <div className="col-lg-5 mb-30">
          <div className="bg-light">
            <img className="w-100 h-100" src={getImageUrl(product.image) || '/img/product-1.jpg'} alt={product.name} style={{ objectFit: 'cover' }} />
          </div>
        </div>

        <div className="col-lg-7 h-auto mb-30">
          <div className="h-100 bg-light p-30">
            <h3>{product.name}</h3>
            <div className="d-flex mb-3 align-items-center">
              <div className="text-primary mr-2">
                {[...Array(5)].map((_, i) => (
                  <small key={i} className={`fa fa-star ${i < Math.round(product.stars || 0) ? 'fas' : 'far'}`}></small>
                ))}
              </div>
              <small>({data.reviewCount} Đánh giá)</small>
            </div>

            <h3 className="font-weight-semi-bold mb-4">
              {formatCurrency(product.price)}
              {product.oldPrice && <small className="text-muted ml-2"><del>{formatCurrency(product.oldPrice)}</del></small>}
            </h3>

            <p className="mb-4">{product.description || 'Mô tả sản phẩm đang cập nhật.'}</p>

            <form className="d-flex align-items-center mb-4 pt-2" onSubmit={handleAddToCart}>
              <div className="input-group quantity mr-3" style={{ width: '130px' }}>
                <div className="input-group-btn">
                  <button type="button" className="btn btn-primary btn-minus" onClick={() => setQty(Math.max(1, qty - 1))}>
                    <i className="fa fa-minus"></i>
                  </button>
                </div>
                <input type="text" className="form-control bg-secondary border-0 text-center" value={qty} readOnly />
                <div className="input-group-btn">
                  <button type="button" className="btn btn-primary btn-plus" onClick={() => setQty(qty + 1)}>
                    <i className="fa fa-plus"></i>
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary px-3">
                <i className="fa fa-shopping-cart mr-1"></i> Thêm vào giỏ hàng
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="row px-xl-5">
        <div className="col">
          <div className="bg-light p-30">
            <h4 className="mb-3">Mô tả sản phẩm</h4>
            <p>{product.description}</p>

            <hr className="my-4"/>
            <div className="row">
              <div className="col-md-6">
                <h4 className="mb-4">{data.reviewCount} đánh giá cho "{product.name}"</h4>
                {data.reviews?.length > 0 ? data.reviews.map((rev, index) => (
                   <div key={index} className="media mb-4">
                     <img src="/img/user.jpg" className="img-fluid mr-3 mt-1" style={{width: '45px'}} alt="User" />
                     <div className="media-body">
                       <h6>{rev.user?.name}</h6>
                       <div className="text-primary mb-2">
                         {[...Array(5)].map((_, i) => (<i key={i} className={`fa fa-star ${i < rev.stars ? 'fas' : 'far'}`}></i>))}
                       </div>
                       <p>{rev.comment}</p>
                     </div>
                   </div>
                )) : <p>Chưa có đánh giá nào.</p>}
              </div>
              <div className="col-md-6">
                <h4 className="mb-4">Viết đánh giá của bạn</h4>
                <form onSubmit={submitReview}>
                   <div className="form-group">
                      <label>Nội dung *</label>
                      <textarea rows="5" className="form-control" required value={reviewForm.comment} onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}></textarea>
                   </div>
                   <button type="submit" className="btn btn-primary px-3">Gửi đánh giá</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {data.relatedProducts?.length > 0 && (
        <div className="row px-xl-5 mt-5">
           <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Sản Phẩm Tương Tự</span></h2>
           <div className="row w-100">
              {data.relatedProducts.map((relProd, index) => (
                <div key={index} className="col-lg-3 col-md-4 col-sm-6 pb-1">
                  <div className="product-item bg-light mb-4">
                    <div className="product-img position-relative overflow-hidden">
                      <img className="img-fluid w-100" src={getImageUrl(relProd.image)} alt={relProd.name} />
                      <div className="product-action">
                         <Link className="btn btn-outline-dark btn-square" to={`/detail?id=${relProd.id}`}><i className="fa fa-search"></i></Link>
                      </div>
                    </div>
                    <div className="text-center py-4">
                      <Link className="h6 text-decoration-none text-truncate" to={`/detail?id=${relProd.id}`}>{relProd.name}</Link>
                      <div className="d-flex justify-content-center mt-2">
                        <h5>{formatCurrency(relProd.price)}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}

export default Detail;
