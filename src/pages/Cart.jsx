import React, { useState, useEffect, useRef } from 'react';
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

  const [voucherCode, setVoucherCode] = useState('');
  const syncId = useRef(0);

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

  const handleApplyVoucher = async (e) => {
    e.preventDefault();
    if (!voucherCode) return;
    try {
      const response = await axiosClient.post('/api/cart/apply-voucher', { code: voucherCode });
      if (response.data.success) {
        alert(response.data.message);
        setVoucherCode('');
        fetchCart();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('Lỗi áp dụng mã giảm giá.');
    }
  };

  const handleRemoveVoucher = async () => {
    try {
      await axiosClient.post('/api/cart/remove-voucher');
      fetchCart();
    } catch (error) {
      alert('Lỗi gỡ mã giảm giá.');
    }
  };

  const handleRemove = async (id) => {
    // 1. XÓA LẠC QUAN: Xóa khỏi giao diện ngay lập tức
    const itemToRemove = data.cart.find(item => item.id === id);
    if (!itemToRemove) return;

    const updatedCart = data.cart.filter(item => item.id !== id);
    
    // Tính toán lại các con số tổng tiền ngay tại local với giới hạn không âm
    const newSubtotal = updatedCart.reduce((total, item) => total + (item.price * item.qty), 0);
    const effectiveDiscount = Math.min(newSubtotal, data.discountAmount || 0);
    const newGrandTotal = newSubtotal + data.shipping - effectiveDiscount;

    setData(prev => ({
      ...prev,
      cart: updatedCart,
      subtotal: newSubtotal,
      discountAmount: effectiveDiscount, // Cập nhật lại số tiền giảm thực tế
      grandTotal: Math.max(0, newGrandTotal)
    }));

    try {
      // 2. Gửi lệnh xóa ngầm lên server
      await axiosClient.post('/api/cart/remove', { id });
      // Không gọi fetchCart() vì UI đã được cập nhật đúng rồi
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      // Nếu lỗi, mới cần nạp lại dữ liệu thật từ server để đảm bảo chính xác
      fetchCart();
    }
  };

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    
    // Tìm sản phẩm và kiểm tra kho
    const currentItem = data.cart.find(item => item.id === id);
    if (currentItem && newQty > currentItem.stock) return;

    // CẬP NHẬT LẠC QUAN (Optimistic Update): Thay đổi UI ngay lập tức
    const updatedCart = data.cart.map(item => {
      if (item.id === id) return { ...item, qty: newQty };
      return item;
    });

    // Tính toán lại tổng tiền tạm thời trong React để UI phản hồi nhanh
    const newSubtotal = updatedCart.reduce((total, item) => total + (item.price * item.qty), 0);
    const effectiveDiscount = Math.min(newSubtotal, data.discountAmount || 0);
    const newGrandTotal = newSubtotal + data.shipping - effectiveDiscount;

    setData(prev => ({
      ...prev,
      cart: updatedCart,
      subtotal: newSubtotal,
      discountAmount: effectiveDiscount,
      grandTotal: Math.max(0, newGrandTotal)
    }));
  };

  // ĐỒNG BỘ NGẦM (Debounced Sync) với xử lý chống nhảy số (Jitter Control)
  useEffect(() => {
    if (data.loading || data.cart.length === 0) return;

    // Tăng mã định danh yêu cầu mỗi khi giỏ hàng thay đổi
    const currentId = ++syncId.current;

    const syncTimer = setTimeout(async () => {
      try {
        const response = await axiosClient.post('/api/cart/update', { cart: data.cart });
        
        // CHỈ cập nhật vào State nếu đây là phản hồi của yêu cầu MỚI NHẤT
        if (response.data.success && syncId.current === currentId) {
          setData(prev => ({
            ...prev,
            ...response.data.data
          }));
        }
      } catch (error) {
        console.error('Lỗi đồng bộ giỏ hàng:', error);
      }
    }, 500);

    return () => clearTimeout(syncTimer);
  }, [data.cart]);


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
          <form className="mb-30" onSubmit={handleApplyVoucher}>
            <div className="input-group">
                <input type="text" className="form-control border-0 p-4" placeholder="Mã giảm giá" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} />
                <div className="input-group-append">
                    <button className="btn btn-primary">Áp dụng</button>
                </div>
            </div>
          </form>

          <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Tóm tắt đơn hàng</span></h5>
          <div className="bg-light p-30 mb-5">
            <div className="border-bottom pb-2">
              <div className="d-flex justify-content-between mb-3">
                <h6>Tạm tính</h6>
                <h6>{formatCurrency(data.subtotal)}</h6>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <h6 className="font-weight-medium">Phí vận chuyển</h6>
                <h6 className="font-weight-medium">{formatCurrency(data.shipping)}</h6>
              </div>
              {data.discountAmount > 0 && (
                <div className="d-flex justify-content-between mb-3 text-success">
                  <h6 className="font-weight-bold">Giảm giá ({data.appliedVoucher?.code}) <span className="text-danger" style={{cursor:'pointer'}} onClick={handleRemoveVoucher}>&times;</span></h6>
                  <h6 className="font-weight-bold">-{formatCurrency(data.discountAmount)}</h6>
                </div>
              )}
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
