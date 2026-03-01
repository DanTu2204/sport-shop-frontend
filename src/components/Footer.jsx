import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="container-fluid bg-dark text-secondary mt-5 pt-5">
            <div className="row px-xl-5 pt-5">
                <div className="col-lg-4 col-md-12 mb-5 pr-3 pr-xl-5">
                    <h5 className="text-secondary text-uppercase mb-4">Thông tin liên hệ</h5>
                    <p className="mb-4">Chúng tôi cung cấp các sản phẩm thể thao chất lượng cao với giá cả hợp lý nhất trên thị trường. Hãy liên hệ với chúng tôi để được tư vấn.</p>
                    <p className="mb-2"><i className="fa fa-map-marker-alt text-primary mr-3"></i>123 Đường Số 1, Quận 1, TP.HCM</p>
                    <p className="mb-2"><i className="fa fa-envelope text-primary mr-3"></i>support@sportshop.vn</p>
                    <p className="mb-0"><i className="fa fa-phone-alt text-primary mr-3"></i>0909 123 456</p>
                </div>
                <div className="col-lg-8 col-md-12">
                    <div className="row">
                        <div className="col-md-4 mb-5">
                            <h5 className="text-secondary text-uppercase mb-4">Mua sắm</h5>
                            <div className="d-flex flex-column justify-content-start">
                                <Link className="text-secondary mb-2" to="/"><i className="fa fa-angle-right mr-2"></i>Trang chủ</Link>
                                <Link className="text-secondary mb-2" to="/shop"><i className="fa fa-angle-right mr-2"></i>Cửa hàng</Link>
                                <Link className="text-secondary mb-2" to="/detail"><i className="fa fa-angle-right mr-2"></i>Chi tiết sản phẩm</Link>
                                <Link className="text-secondary mb-2" to="/cart"><i className="fa fa-angle-right mr-2"></i>Giỏ hàng</Link>
                                <Link className="text-secondary mb-2" to="/checkout"><i className="fa fa-angle-right mr-2"></i>Thanh toán</Link>
                                <Link className="text-secondary" to="/contact"><i className="fa fa-angle-right mr-2"></i>Liên hệ</Link>
                            </div>
                        </div>
                        <div className="col-md-4 mb-5">
                            <h5 className="text-secondary text-uppercase mb-4">Tài khoản</h5>
                            <div className="d-flex flex-column justify-content-start">
                                <Link className="text-secondary mb-2" to="/"><i className="fa fa-angle-right mr-2"></i>Trang chủ</Link>
                                <Link className="text-secondary mb-2" to="/shop"><i className="fa fa-angle-right mr-2"></i>Cửa hàng</Link>
                                <Link className="text-secondary mb-2" to="/detail"><i className="fa fa-angle-right mr-2"></i>Chi tiết sản phẩm</Link>
                                <Link className="text-secondary mb-2" to="/cart"><i className="fa fa-angle-right mr-2"></i>Giỏ hàng</Link>
                                <Link className="text-secondary mb-2" to="/checkout"><i className="fa fa-angle-right mr-2"></i>Thanh toán</Link>
                                <Link className="text-secondary" to="/contact"><i className="fa fa-angle-right mr-2"></i>Liên hệ</Link>
                            </div>
                        </div>
                        <div className="col-md-4 mb-5">
                            <h5 className="text-secondary text-uppercase mb-4">Nhận Bản Tin</h5>
                            <p>Đăng ký email để nhận thông tin khuyến mãi mới nhất từ SportShop.</p>
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
                                <a className="btn btn-primary btn-square mr-2" href="#"><i className="fab fa-linkedin-in"></i></a>
                                <a className="btn btn-primary btn-square" href="#"><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row border-top mx-xl-5 py-4" style={{ borderColor: 'rgba(256, 256, 256, .1)' }}>
                <div className="col-md-6 px-xl-0">
                    <p className="mb-md-0 text-center text-md-left text-secondary">
                        &copy; <a className="text-primary" href="#">SportShop</a>. All Rights Reserved. Xây dựng bởi
                        <a className="text-primary" href="#"> Nhóm 7</a>
                    </p>
                </div>
                <div className="col-md-6 px-xl-0 text-center text-md-right">
                    <img className="img-fluid" src="img/payments.png" alt="Payments" />
                </div>
            </div>
        </div>
    );
};

export default Footer;
