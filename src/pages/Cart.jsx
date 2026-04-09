import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient, { getImageUrl } from '../api/axiosClient';

function Cart() {
  const [data, setData] = useState({
    cart: [],
    subtotal: 0,
    shipping: 0,
    grandTotal: 0,
    loading: true,
  });

  const fetchCart = async () => {
    try {
      const response = await axiosClient.get('/api/cart');
      if (response.data && response.data.data) {
        setData({ ...response.data.data, loading: false });
      } else if (response.data) {
        setData({ ...response.data, loading: false });
      }
    } catch (error) {
       setData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (id) => {
    try {
      await axiosClient.post('/api/cart/remove', { id });
      fetchCart(); // refresh Data
    } catch (error) {
      alert("Lỗi khi xóa sản phẩm");
    }
  };

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    
    const updatedCart = data.cart.map(item => {
      if (item.id === id) {
        // Check stock limit on frontend
        if (newQty > item.stock) {
           return item;
        }
        return { ...item, qty: newQty };
      }
      return item;
    });

    const newSubtotal = updatedCart.reduce((total, item) => total + (item.price * item.qty), 0);
    setData({
      ...data,
      cart: updatedCart,
      subtotal: newSubtotal,
      grandTotal: newSubtotal + data.shipping
    });
    // Optional: You could post this change to a backend update endpoint if it existed.
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  if (data.loading) return <div className="container text-center py-5">Đang tải giỏ hàng...</div>;

  return (
    <div className="container-fluid pt-5">
      <div className="row px-xl-5">
        <div className="col-lg-8 table-responsive mb-5">
          <table className="table table-light table-borderless table-hover text-center mb-0">
            <thead className="thead-dark">
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {data.cart?.length > 0 ? data.cart.map((item, index) => (
                <tr key={index}>
                  <td className="align-middle">
                    {item.image && <img src={getImageUrl(item.image)} style={{ width: '50px', marginRight: '10px' }} alt={item.name} />} 
                    {item.name}
                  </td>
                  <td className="align-middle">{formatCurrency(item.price)}</td>
                  <td className="align-middle">
                    <div className="input-group quantity mx-auto" style={{ width: '140px' }}>
                      <div className="input-group-btn">
                        <button className="btn btn-sm btn-primary btn-minus" onClick={() => updateQuantity(item.id, item.qty - 1)}>
                          <i className="fa fa-minus"></i>
                        </button>
                      </div>
                      <input type="number" className="form-control form-control-sm bg-secondary border-0 text-center" 
                             value={item.qty}
                             min="1"
                             max={item.stock}
                             onChange={(e) => {
                               const val = parseInt(e.target.value);
                               if (isNaN(val) || val < 1) updateQuantity(item.id, 1);
                               else if (val > item.stock) updateQuantity(item.id, item.stock);
                               else updateQuantity(item.id, val);
                             }} />
                      <div className="input-group-btn">
                         <button className="btn btn-sm btn-primary btn-plus" 
                                 onClick={() => updateQuantity(item.id, item.qty + 1)}
                                 disabled={item.qty >= item.stock}>
                           <i className="fa fa-plus"></i>
                         </button>
                      </div>
                    </div>
                    {item.stock && <small className="text-muted d-block mt-1">Kho: {item.stock}</small>}
                  </td>
                  <td className="align-middle">{formatCurrency(item.price * item.qty)}</td>
                  <td className="align-middle">
                    <button className="btn btn-sm btn-danger" onClick={() => handleRemove(item.id)}>
                      <i className="fa fa-times"></i>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">Giỏ hàng của bạn đang trống.<br/><Link to="/shop" className="btn btn-primary mt-3">Đến Cửa Hàng</Link></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tóm tắt */}
        <div className="col-lg-4">
          <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Tóm tắt đơn hàng</span></h5>
          <div className="bg-light p-30 mb-5">
            <div className="border-bottom pb-2">
              <div className="d-flex justify-content-between mb-3">
                <h6>Tạm tính</h6>
                <h6>{formatCurrency(data.subtotal)}</h6>
              </div>
              <div className="d-flex justify-content-between">
                <h6 className="font-weight-medium">Phí vận chuyển</h6>
                <h6 className="font-weight-medium">{formatCurrency(data.shipping)}</h6>
              </div>
            </div>
            <div className="pt-2">
              <div className="d-flex justify-content-between mt-2">
                <h5>Tổng cộng</h5>
                <h5>{formatCurrency(data.grandTotal)}</h5>
              </div>
              {data.cart?.length > 0 ? (
                 <Link to="/checkout" className="btn btn-block btn-primary font-weight-bold my-3 py-3">Tiến hành Thanh toán</Link>
              ) : (
                 <button className="btn btn-block btn-secondary font-weight-bold my-3 py-3" disabled>Giỏ trống</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
