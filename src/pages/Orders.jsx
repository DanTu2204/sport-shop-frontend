import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

function Orders() {
  const navigate = useNavigate();
  const [data, setData] = useState({ orders: [], loading: true });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosClient.get('/api/orders');
        // If the backend returns { view, data: { orders } } or similar
        if (response.data && response.data.data) {
          setData({ orders: response.data.data.orders || [], loading: false });
        } else if (response.data && response.data.orders) {
          setData({ orders: response.data.orders, loading: false });
        } else {
          // Fallback, try fetch profile
          const profRes = await axiosClient.get('/api/profile');
          if (profRes.data && profRes.data.data) {
             setData({ orders: profRes.data.data.orders || [], loading: false });
          } else if (profRes.data && profRes.data.orders) {
             setData({ orders: profRes.data.orders || [], loading: false });
          } else {
             setData({ orders: [], loading: false });
          }
        }
      } catch (error) {
        navigate('/login');
      }
    };
    fetchOrders();
  }, [navigate]);

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

  if (data.loading) return <div className="container py-5 text-center">Đang tải biểu mẫu...</div>;

  return (
    <div className="container-fluid pt-4 pb-5">
      <div className="row px-xl-5">
        <div className="col-12 table-responsive mb-5">
          <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Lịch sử đơn hàng</span></h5>
          {data.orders?.length > 0 ? (
            <table className="table table-light table-borderless table-hover text-center mb-0">
               <thead className="thead-dark">
                  <tr>
                     <th>Mã đơn hàng</th>
                     <th>Ngày đặt</th>
                     <th>Sản phẩm</th>
                     <th>Tổng tiền</th>
                     <th>Trạng thái</th>
                     <th>Chi tiết</th>
                  </tr>
               </thead>
               <tbody className="align-middle">
                  {data.orders.map((o) => (
                    <tr key={o._id}>
                       <td className="align-middle">{o._id}</td>
                       <td className="align-middle">{new Date(o.createdAt).toLocaleDateString()}</td>
                       <td className="align-middle text-left">
                          <ul className="list-unstyled mb-0">
                             {o.items?.map((item, i) => (
                               <li key={i}>- {item.name} x{item.quantity}</li>
                             ))}
                          </ul>
                       </td>
                       <td className="align-middle">
                          {formatCurrency(o.totalPrice)}
                          {o.discount > 0 && <><br/><small className="text-success">(Đã giảm: {formatCurrency(o.discount)})</small></>}
                       </td>
                       <td className="align-middle">
                          {o.status === 'pending' && <span className="badge badge-warning p-2">Đang xử lý</span>}
                          {o.status === 'confirmed' && <span className="badge badge-info p-2">Đã xác nhận</span>}
                          {o.status === 'shipping' && <span className="badge badge-primary p-2">Đang giao</span>}
                          {o.status === 'completed' && <span className="badge badge-success p-2">Hoàn thành</span>}
                          {o.status === 'cancelled' && <span className="badge badge-danger p-2">Đã hủy</span>}
                       </td>
                       <td className="align-middle">
                          <Link to={`/orders/${o._id}`} className="btn btn-sm btn-primary">Xem</Link>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          ) : (
            <div className="text-center py-5 border bg-light">
               <h4 className="text-muted">Bạn chưa có đơn hàng nào.</h4>
               <Link to="/shop" className="btn btn-primary mt-3">Mua sắm ngay</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;
