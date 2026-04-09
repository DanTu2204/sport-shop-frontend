import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className="container-fluid bg-dark text-secondary mt-5 pt-5">
      <div className="row px-xl-5 pt-5">
        <div className="col-lg-4 col-md-12 mb-5 pr-3 pr-xl-5">
          <h5 className="text-secondary text-uppercase mb-4">Kết nối với chúng tôi</h5>
          <p className="mb-4">SportShop cam kết mang đến những sản phẩm thể thao chất lượng tốt nhất. Hãy đồng hành cùng chúng tôi trên con đường rèn luyện sức khỏe.</p>
          <p className="mb-2"><i className="fa fa-map-marker-alt text-primary mr-3"></i>123 Đường Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCM</p>
          <p className="mb-2"><i className="fa fa-envelope text-primary mr-3"></i>info@sportshop.vn</p>
          <p className="mb-0"><i className="fa fa-phone-alt text-primary mr-3"></i>0909 123 456</p>
        </div>
        <div className="col-lg-8 col-md-12">
          <div className="row">
            <div className="col-md-4 mb-5">
              <h5 className="text-secondary text-uppercase mb-4">Mua sắm</h5>
              <div className="d-flex flex-column justify-content-start">
                <Link className="text-secondary mb-2" to="/"><i className="fa fa-angle-right mr-2"></i>Trang chủ</Link>
                <Link className="text-secondary mb-2" to="/shop"><i className="fa fa-angle-right mr-2"></i>Cửa hàng</Link>
                <Link className="text-secondary mb-2" to="/cart"><i className="fa fa-angle-right mr-2"></i>Giỏ hàng</Link>
                <Link className="text-secondary mb-2" to="/checkout"><i className="fa fa-angle-right mr-2"></i>Thanh toán</Link>
              </div>
            </div>
            <div className="col-md-4 mb-5">
              <h5 className="text-secondary text-uppercase mb-4">Chính sách</h5>
              <div className="d-flex flex-column justify-content-start">
                <Link className="text-secondary mb-2" to="/faq"><i className="fa fa-angle-right mr-2"></i>Câu hỏi thường gặp</Link>
                <Link className="text-secondary mb-2" to="/help"><i className="fa fa-angle-right mr-2"></i>Chính sách đổi trả</Link>
                <Link className="text-secondary mb-2" to="/help"><i className="fa fa-angle-right mr-2"></i>Giao hàng</Link>
              </div>
            </div>
            <div className="col-md-4 mb-5">
              <h5 className="text-secondary text-uppercase mb-4">Nhận Bản Tin</h5>
              <p>Nhận thông tin ưu đãi mới nhất từ SportShop</p>
              <form action="">
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="Email của bạn" />
                  <div className="input-group-append">
                    <button className="btn btn-primary">Đăng ký</button>
                  </div>
                </div>
              </form>
              <h6 className="text-secondary text-uppercase mt-4 mb-3">Theo dõi chúng tôi</h6>
              <div className="d-flex">
                <a className="btn btn-primary btn-square mr-2" href="#"><i className="fab fa-twitter"></i></a>
                <a className="btn btn-primary btn-square mr-2" href="#"><i className="fab fa-facebook-f"></i></a>
                <a className="btn btn-primary btn-square mr-2" href="#"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row border-top mx-xl-5 py-4" style={{ borderColor: 'rgba(256, 256, 256, .1) !important' }}>
        <div className="col-md-6 px-xl-0">
          <p className="mb-md-0 text-center text-md-left text-secondary">
            &copy; <a className="text-primary" href="#">SportShop</a>. Đã đăng ký bản quyền.
          </p>
        </div>
        <div className="col-md-6 px-xl-0 text-center text-md-right">
          <img className="img-fluid" src="img/payments.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Footer;
