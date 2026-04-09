import React from 'react';

function About() {
  return (
    <div className="container-fluid py-5">
      <div className="row px-xl-5">
        <div className="col-12">
          <h2 className="section-title position-relative text-uppercase mb-4">
             <span className="bg-secondary pr-3">Về Chúng Tôi</span>
          </h2>
          <div className="bg-light p-5">
             <h4 className="mb-3">Chào mừng bạn đến với Sport Shop</h4>
             <p>Sport Shop là cửa hàng chuyên cung cấp dụng cụ thể thao chuyên nghiệp và chính hãng. Chúng tôi luôn cam kết đem đến cho bạn những trải nghiệm tốt nhất với nhiều mẫu mã đa dạng và giá cả cạnh tranh trên thị trường.</p>
             <p>Sứ mệnh của chúng tôi là truyền cảm hứng và tinh thần thể thao đến tất cả mọi người, vì một cộng đồng khỏe mạnh và năng động!</p>
             <ul className="list-unstyled mt-4">
               <li><i className="fa fa-check text-primary mr-2"></i>Sản phẩm chính hãng 100%</li>
               <li><i className="fa fa-check text-primary mr-2"></i>Giao hàng toàn quốc nhanh chóng</li>
               <li><i className="fa fa-check text-primary mr-2"></i>Đổi trả miễn phí trong vòng 7 ngày</li>
               <li><i className="fa fa-check text-primary mr-2"></i>Hỗ trợ tư vấn khách hàng 24/7</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
