import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

function Checkout() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    cart: [],
    subtotal: 0,
    shipping: 0,
    discountAmount: 0,
    grandTotal: 0,
    voucherCode: '',
    user: null,
    loading: true,
    error: null
  });

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', district: '', paymentMethod: 'cod'
  });
  
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherMsg, setVoucherMsg] = useState({ text: '', type: '' });

  const fetchCheckoutData = async () => {
    try {
      const response = await axiosClient.get('/api/checkout');
      // If user is not logged in, backend redirects to login. 
      // Axios interceptor or manual check should handle it.
      if (response.data && response.data.data) {
        setData({ ...response.data.data, loading: false });
        if(response.data.data.user) {
           setFormData(f => ({ ...f, 
              firstName: response.data.data.user.name?.split(' ')[0] || '',
              lastName: response.data.data.user.name?.split(' ').slice(1).join(' ') || '',
              email: response.data.data.user.email || '',
              phone: response.data.data.user.phone || '',
           }));
        }
      } else if (response.data) {
        setData({ ...response.data, loading: false });
      }
    } catch (error) {
      if(error.response && (error.response.status === 401 || error.response.status === 302)) {
         navigate('/login');
      } else {
         setData(prev => ({ ...prev, loading: false, error: 'Vui lòng đăng nhập để tiếp tục.' }));
         // Fallback if CORS or network block
         setTimeout(() => navigate('/login'), 2000);
      }
    }
  };

  useEffect(() => {
    fetchCheckoutData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyVoucher = async () => {
    if (!voucherInput) return setVoucherMsg({ text: 'Vui lòng nhập mã giảm giá', type: 'text-danger' });
    try {
      const res = await axiosClient.post('/api/cart/apply-voucher', { code: voucherInput });
      if (res.data.success) {
        setVoucherMsg({ text: res.data.message, type: 'text-success' });
        
        // CẬP NHẬT TỨC THÌ (Optimistic UI) dựa trên quy tắc 0đ
        const v = res.data.data;
        let potentialDiscount = (v.type === 'percent') ? (data.subtotal * v.value) / 100 : v.value;

        let finalDiscount = 0;
        let finalGrandTotal = 0;

        // Áp dụng quy tắc: Tạm tính <= Giảm giá thì Tổng = 0
        if (data.subtotal <= potentialDiscount) {
            finalDiscount = data.subtotal;
            finalGrandTotal = 0;
        } else {
            finalDiscount = potentialDiscount;
            finalGrandTotal = data.subtotal + data.shipping - finalDiscount;
        }

        setData(prev => ({
            ...prev,
            discountAmount: finalDiscount,
            grandTotal: finalGrandTotal,
            voucherCode: v.code
        }));
      } else {
        setVoucherMsg({ text: res.data.message, type: 'text-danger' });
      }
    } catch (error) {
      setVoucherMsg({ text: 'Có lỗi xảy ra', type: 'text-danger' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/api/checkout', formData);
      navigate('/checkout/success');
    } catch (error) {
      alert("Lỗi tạo đơn hàng: " + (error.response?.data?.error || error.message));
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

  if (data.loading) return <div className="container py-5 text-center">Đang tải biểu mẫu...</div>;
  if (data.error) return <div className="container py-5 text-center text-danger">{data.error}</div>;

  return (
    <div className="container-fluid pt-5">
      <form onSubmit={handleSubmit} className="row px-xl-5">
        <div className="col-lg-8">
          <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Địa chỉ thanh toán</span></h5>
          <div className="bg-light p-30 mb-5">
            <div className="row">
              <div className="col-md-6 form-group">
                <label>Họ <span className="text-danger">*</span></label>
                <input name="firstName" className="form-control" type="text" required value={formData.firstName} onChange={handleChange}/>
              </div>
              <div className="col-md-6 form-group">
                <label>Tên <span className="text-danger">*</span></label>
                <input name="lastName" className="form-control" type="text" required value={formData.lastName} onChange={handleChange}/>
              </div>
              <div className="col-md-6 form-group">
                <label>Email <span className="text-danger">*</span></label>
                <input name="email" className="form-control" type="email" required value={formData.email} onChange={handleChange}/>
              </div>
              <div className="col-md-6 form-group">
                <label>Số điện thoại <span className="text-danger">*</span></label>
                <input name="phone" className="form-control" type="text" required value={formData.phone} onChange={handleChange}/>
              </div>
              <div className="col-md-12 form-group">
                <label>Địa chỉ giao hàng <span className="text-danger">*</span></label>
                <input name="address" className="form-control" type="text" required value={formData.address} onChange={handleChange}/>
              </div>
              <div className="col-md-6 form-group">
                <label>Tỉnh/Thành phố <span className="text-danger">*</span></label>
                <input name="city" className="form-control" type="text" required value={formData.city} onChange={handleChange}/>
              </div>
              <div className="col-md-6 form-group">
                <label>Quận/Huyện <span className="text-danger">*</span></label>
                <input name="district" className="form-control" type="text" required value={formData.district} onChange={handleChange}/>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Tổng đơn hàng</span></h5>
          <div className="bg-light p-30 mb-5">
            <div className="border-bottom">
              <h6 className="mb-3">Sản phẩm</h6>
              {data.cart?.length > 0 ? data.cart.map((item, i) => (
                <div key={i} className="d-flex justify-content-between mb-2">
                   <p className="mb-0">{item.name} <small className="text-muted">x{item.qty}</small></p>
                   <p className="mb-0">{formatCurrency(item.price * item.qty)}</p>
                </div>
              )) : <p>Giỏ trống</p>}
            </div>
            <div className="border-bottom pt-3 pb-2">
              <div className="d-flex justify-content-between mb-3">
                <h6>Tạm tính</h6>
                <h6>{formatCurrency(data.subtotal)}</h6>
              </div>
              
              <div className="input-group mb-3">
                 <input type="text" className="form-control" placeholder="Mã giảm giá" value={voucherInput} onChange={(e)=>setVoucherInput(e.target.value)} />
                 <div className="input-group-append">
                    <button className="btn btn-primary" type="button" onClick={handleApplyVoucher}>Áp dụng</button>
                 </div>
              </div>
              {voucherMsg.text && <div className={`mb-2 ${voucherMsg.type}`}><small>{voucherMsg.text}</small></div>}
              
              {data.discountAmount > 0 && (
                <div className="d-flex justify-content-between mb-3 text-success">
                   <div className="d-flex align-items-center">
                      <h6 className="mb-0">Giảm giá ({data.voucherCode})</h6>
                      <button 
                        type="button" 
                        className="btn btn-sm text-danger ml-2 p-0" 
                        title="Hủy mã"
                        onClick={async () => {
                           try {
                              await axiosClient.post('/api/cart/remove-voucher');
                              setVoucherMsg({ text: 'Đã hủy mã giảm giá', type: 'text-muted' });
                              setVoucherInput('');
                              // Reset UI ngay lập tức
                              setData(prev => ({
                                 ...prev,
                                 discountAmount: 0,
                                 grandTotal: prev.subtotal + prev.shipping,
                                 voucherCode: ''
                              }));
                           } catch (e) {}
                        }}
                      >
                         <i className="fa fa-times-circle"></i>
                      </button>
                   </div>
                   <h6>-{formatCurrency(data.discountAmount)}</h6>
                </div>
              )}

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
            </div>
          </div>

          <div className="mb-5">
             <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Phương thức thanh toán</span></h5>
             <div className="bg-light p-30">
                <div className="form-group">
                   <div className="custom-control custom-radio">
                      <input type="radio" className="custom-control-input" name="paymentMethod" id="cod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} />
                      <label className="custom-control-label" htmlFor="cod">Thanh toán khi nhận hàng (COD)</label>
                   </div>
                </div>
                <div className="form-group mb-4">
                   <div className="custom-control custom-radio">
                      <input type="radio" className="custom-control-input" name="paymentMethod" id="banktransfer" value="banktransfer" checked={formData.paymentMethod === 'banktransfer'} onChange={handleChange} />
                      <label className="custom-control-label" htmlFor="banktransfer">Chuyển khoản</label>
                   </div>
                </div>
                <button type="submit" className="btn btn-block btn-primary font-weight-bold py-3">Xác nhận đặt hàng</button>
             </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
