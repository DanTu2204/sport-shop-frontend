import React from 'react';

function Help() {
  return (
    <div className="container-fluid py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="section-title position-relative text-uppercase mb-4 text-center">
             <span className="bg-secondary pr-3">Trợ Giúp Khách Hàng</span>
          </h2>
          
          <div className="bg-light p-5 mb-4">
             <h4 className="mb-4">Chủ đề Hỗ trợ</h4>
             <ul className="list-group list-group-flush">
                <li className="list-group-item bg-transparent"><strong>Tình trạng đơn hàng:</strong> Truy cập trang hồ sơ để theo dõi đơn và cập nhật giao hàng.</li>
                <li className="list-group-item bg-transparent"><strong>Đổi trả sản phẩm:</strong> Bạn có 7 ngày để đổi trả miễn phí cho các sản phẩm chưa qua sử dụng.</li>
                <li className="list-group-item bg-transparent"><strong>Phương thức thanh toán:</strong> Hỗ trợ COD, chuyển khoản và các ví điện tử phổ biến.</li>
             </ul>
          </div>

          <div className="bg-light p-5">
             <h4 className="mb-4">Kênh Hỗ trợ Trực tiếp</h4>
             <div className="row">
                <div className="col-md-4 text-center mb-3">
                   <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3" style={{width: '60px', height: '60px'}}>
                      <i className="fa fa-phone-alt fa-2x"></i>
                   </div>
                   <h5>Hotline</h5>
                   <p>0909 123 456<br/>(8h00 - 22h00)</p>
                </div>
                <div className="col-md-4 text-center mb-3">
                   <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3" style={{width: '60px', height: '60px'}}>
                      <i className="fa fa-envelope fa-2x"></i>
                   </div>
                   <h5>Email</h5>
                   <p>support@sportshop.vn</p>
                </div>
                <div className="col-md-4 text-center mb-3">
                   <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3" style={{width: '60px', height: '60px'}}>
                      <i className="fa fa-comments fa-2x"></i>
                   </div>
                   <h5>Live Chat</h5>
                   <p>Phản hồi trong vòng<br/>5 phút</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Help;
