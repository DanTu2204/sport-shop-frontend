import React from 'react';
import { Link } from 'react-router-dom';

function CheckoutSuccess() {
  return (
    <div className="container-fluid pt-5">
      <div className="row px-xl-5 text-center">
        <div className="col-lg-12 mb-5">
          <div className="bg-light p-30">
            <h1 className="display-4 text-success mb-4"><i className="fa fa-check-circle"></i></h1>
            <h2 className="mb-4">Đặt hàng thành công!</h2>
            <p className="lead">
              Cảm ơn bạn đã mua sắm tại Sport Shop. Đơn hàng của bạn đã được ghi nhận và đang được xử lý.
            </p>
            <p className="mb-5">
              Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận thông tin giao hàng.
            </p>
            <div className="d-flex justify-content-center">
              <Link to="/orders" className="btn btn-primary px-4 py-2 mx-2">Xem đơn hàng</Link>
              <Link to="/shop" className="btn btn-outline-primary px-4 py-2 mx-2">Tiếp tục mua sắm</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess;
