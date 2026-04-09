import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/api/contact', formData);
      setSuccessMsg('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
      window.alert('Gửi thông báo liên hệ thành công!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      alert('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="container-fluid py-5">
      <h2 className="section-title position-relative text-uppercase text-center mb-4">
         <span className="bg-secondary pr-3">Liên hệ với chúng tôi</span>
      </h2>
      <div className="row px-xl-5">
        <div className="col-lg-7 mb-5">
          <div className="contact-form bg-light p-30">
            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            <form onSubmit={handleSubmit}>
              <div className="control-group mb-3">
                <input type="text" className="form-control" name="name" placeholder="Tên của bạn" required value={formData.name} onChange={handleChange} />
              </div>
              <div className="control-group mb-3">
                <input type="email" className="form-control" name="email" placeholder="Email của bạn" required value={formData.email} onChange={handleChange} />
              </div>
              <div className="control-group mb-3">
                <input type="text" className="form-control" name="subject" placeholder="Tiêu đề" required value={formData.subject} onChange={handleChange} />
              </div>
              <div className="control-group mb-3">
                <textarea className="form-control" rows="8" name="message" placeholder="Nội dung tin nhắn" required value={formData.message} onChange={handleChange}></textarea>
              </div>
              <div>
                 <button className="btn btn-primary py-2 px-4" type="submit">Gửi tin nhắn</button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-lg-5 mb-5">
          <div className="bg-light p-30 mb-30">
            <iframe style={{width: '100%', height: '250px', border: 0}}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.460232421919!2d106.66627031480084!3d10.776019492321857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752edb7bc78bdf%3A0x6bba84323c214c77!2sDistrict%205%2C%20Ho%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1680100000000!5m2!1sen!2s"
              allowFullScreen="" aria-hidden="false" tabIndex="0" title="Map"></iframe>
          </div>
          <div className="bg-light p-30 mb-3">
            <p className="mb-2"><i className="fa fa-map-marker-alt text-primary mr-3"></i>123 Nguyễn Trãi, Quận 5, TP. Hồ Chí Minh</p>
            <p className="mb-2"><i className="fa fa-envelope text-primary mr-3"></i>dantutp@gmail.com</p>
            <p className="mb-2"><i className="fa fa-phone-alt text-primary mr-3"></i>0396554056</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
