import React from 'react';

function FAQ() {
  const faqs = [
    { question: 'Thời gian giao hàng bao lâu?', answer: 'Đơn nội thành 1-2 ngày, toàn quốc từ 3-5 ngày làm việc.' },
    { question: 'Làm sao để đổi size?', answer: 'Liên hệ hotline hoặc chat để được cấp mã đổi size miễn phí.' },
    { question: 'Tôi có thể kiểm tra hàng trước khi thanh toán không?', answer: 'Có, bạn được kiểm tra sản phẩm trước khi thanh toán COD.' }
  ];

  return (
    <div className="container-fluid py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="section-title position-relative text-uppercase mb-4 text-center">
             <span className="bg-secondary pr-3">Câu Hỏi Thường Gặp</span>
          </h2>
          <div className="bg-light p-5">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                 <h5 className="font-weight-semi-bold"><i className="fa fa-question-circle text-primary mr-2"></i>{faq.question}</h5>
                 <p className="pl-4 text-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
