import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient, { getImageUrl } from '../api/axiosClient';

function OrderDetail() {
  const { id } = useParams();
  const [data, setData] = useState({ order: null, loading: true, error: null });
  const [reviewForm, setReviewForm] = useState({ comment: '', stars: 5, productId: null });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosClient.get(`/api/orders/${id}`);
        // Backend pattern: { view, data: { order, user } } or { order }
        if (response.data && response.data.data) {
          setData({ order: response.data.data.order, loading: false });
        } else if (response.data && response.data.order) {
          setData({ order: response.data.order, loading: false });
        } else {
          setData({ loading: false, error: 'Không tìm thấy đơn hàng' });
        }
      } catch (err) {
        setData({ loading: false, error: 'Không tìm thấy đơn hàng' });
      }
    };
    fetchOrder();
  }, [id]);

  const handleConfirmReceived = async () => {
    try {
      await axiosClient.post(`/api/orders/${id}/confirm`);
      alert('Đã xác nhận nhận hàng!');
      window.location.reload();
    } catch (err) {
      alert('Lỗi xác nhận');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post(`/api/products/${reviewForm.productId}/review`, {
        stars: reviewForm.stars,
        comment: reviewForm.comment
      });
      alert('Gửi đánh giá thành công!');
      setReviewForm({ comment: '', stars: 5, productId: null });
    } catch (err) {
      alert('Lỗi gửi đánh giá');
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

  if (data.loading) return <div className="container py-5 text-center">Đang tải biểu mẫu...</div>;
  if (data.error || !data.order) return <div className="container py-5 text-center text-danger">{data.error}</div>;

  const order = data.order;
  const canReview = order.status === 'completed';

  return (
    <div className="container-fluid pt-4 pb-5">
      <div className="row px-xl-5">
        <div className="col-12 mb-4">
           <Link to="/profile" className="btn btn-sm btn-outline-dark">&larr; Trở về danh sách đơn hàng</Link>
        </div>
        
        <div className="col-lg-8">
          <div className="card border-0 mb-5">
            <div className="card-header bg-secondary border-0 text-white">
              <h4 className="font-weight-semi-bold m-0 p-2 text-dark">Thông tin đơn hàng #{order._id}</h4>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <h6>Ngày đặt:</h6>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <h6>Trạng thái:</h6>
                <p>
                  {order.status === 'pending' && <span className="text-warning font-weight-bold">Đang xử lý</span>}
                  {order.status === 'confirmed' && <span className="text-info font-weight-bold">Đã xác nhận</span>}
                  {order.status === 'shipping' && <span className="text-primary font-weight-bold">Đang giao hàng</span>}
                  {order.status === 'completed' && <span className="text-success font-weight-bold">Hoàn thành</span>}
                  {order.status === 'cancelled' && <span className="text-danger font-weight-bold">Đã hủy</span>}
                </p>
              </div>

              {(order.status === 'shipping' || order.status === 'confirmed') && (
                <div className="alert alert-info d-flex justify-content-between align-items-center">
                  <span>Bạn đã nhận được hàng chưa?</span>
                  <button onClick={handleConfirmReceived} className="btn btn-success font-weight-bold">Đã nhận được hàng</button>
                </div>
              )}
            </div>
          </div>

          <div className="card border-0 mb-5">
            <div className="card-header bg-secondary border-0">
               <h4 className="font-weight-semi-bold m-0 p-2 text-dark">Sản phẩm</h4>
            </div>
            <div className="card-body p-0">
               <table className="table mb-0">
                  <tbody>
                     {order.items.map((item, i) => (
                       <tr key={i}>
                         <td style={{width: '100px'}}><img src={getImageUrl(item.image)} alt={item.name} className="img-fluid" style={{width: '80px'}} /></td>
                         <td className="align-middle">
                           <Link to={`/detail?id=${item.productId}`} className="h6 text-decoration-none">{item.name}</Link><br/>
                           <small>{formatCurrency(item.price)} x {item.quantity}</small>
                         </td>
                         <td className="align-middle text-right">
                           {canReview && (
                             <div>
                               <button className="btn btn-sm btn-outline-warning" onClick={() => setReviewForm({...reviewForm, productId: item.productId})}>
                                 <i className="fa fa-star"></i> Đánh giá
                               </button>
                               
                               {reviewForm.productId === item.productId && (
                                 <form onSubmit={handleReviewSubmit} className="mt-3 text-left p-3 border rounded bg-light">
                                    <h6 className="mb-2">Đánh giá "{item.name}"</h6>
                                    <select className="form-control mb-2 form-control-sm" value={reviewForm.stars} onChange={(e) => setReviewForm({...reviewForm, stars: e.target.value})}>
                                       <option value="5">5 Sao (Tuyệt vời)</option>
                                       <option value="4">4 Sao (Tốt)</option>
                                       <option value="3">3 Sao (Bình thường)</option>
                                       <option value="2">2 Sao (Tệ)</option>
                                       <option value="1">1 Sao (Rất tệ)</option>
                                    </select>
                                    <textarea className="form-control mb-2 form-control-sm" rows="3" required placeholder="Nhận xét của bạn" value={reviewForm.comment} onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}></textarea>
                                    <button type="submit" className="btn btn-sm btn-primary">Gửi đánh giá</button>
                                    <button type="button" className="btn btn-sm btn-secondary mx-2" onClick={() => setReviewForm({...reviewForm, productId: null})}>Hủy</button>
                                 </form>
                               )}
                             </div>
                           )}
                         </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
           {/* Order Summary & Contact Info identical logic */}
           <div className="card border-0 mb-5">
              <div className="card-header bg-secondary border-0"><h4 className="font-weight-semi-bold m-0 p-2 text-dark">Tổng quan thanh toán</h4></div>
              <div className="card-body">
                 <div className="d-flex justify-content-between mb-3"><h6>Tạm tính</h6><h6>{formatCurrency(order.subtotal)}</h6></div>
                 <div className="d-flex justify-content-between mb-3"><h6 className="font-weight-medium">Phí vận chuyển</h6><h6 className="font-weight-medium">{formatCurrency(order.shipping)}</h6></div>
                 {order.discount > 0 && <div className="d-flex justify-content-between mb-3"><h6 className="font-weight-medium text-success">Giảm giá</h6><h6 className="font-weight-medium text-success">-{formatCurrency(order.discount)}</h6></div>}
              </div>
              <div className="card-footer border-secondary bg-transparent">
                 <div className="d-flex justify-content-between mt-2"><h5 className="font-weight-bold">Tổng cộng</h5><h5 className="font-weight-bold">{formatCurrency(order.totalPrice)}</h5></div>
              </div>
           </div>

           <div className="card border-0 mb-5">
              <div className="card-header bg-secondary border-0"><h4 className="font-weight-semi-bold m-0 p-2 text-dark">Thông tin giao hàng</h4></div>
              <div className="card-body">
                 {order.contact && (
                   <>
                     <p className="mb-1"><strong>Người nhận:</strong> {order.contact.firstName} {order.contact.lastName}</p>
                     <p className="mb-1"><strong>Điện thoại:</strong> {order.contact.phone}</p>
                     <p className="mb-1"><strong>Email:</strong> {order.contact.email}</p>
                     <p className="mb-0"><strong>Địa chỉ:</strong> {order.contact.address}, {order.contact.district}, {order.contact.city}</p>
                   </>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
