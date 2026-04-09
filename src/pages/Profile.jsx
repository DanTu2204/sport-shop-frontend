import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient, { getImageUrl } from '../api/axiosClient';
import { useAppContext } from '../context/AppContext';

function Profile() {
  const { logout: contextLogout } = useAppContext();
  const navigate = useNavigate();
  const [data, setData] = useState({ user: null, orders: [], contacts: [], loading: true });
  const [activeTab, setActiveTab] = useState('profile');
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', address: '', birthday: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await axiosClient.get('/api/profile');
      if (response.data && response.data.data) {
        const u = response.data.data.user;
        setData({ 
          user: u, 
          orders: response.data.data.orders || [], 
          contacts: response.data.data.contacts || [],
          loading: false 
        });
        if(u) {
           setProfileForm({
             name: u.name || '',
             phone: u.phone || '',
             address: u.address || '',
             birthday: u.birthday ? new Date(u.birthday).toISOString().split('T')[0] : ''
           });
        }
      } else if (response.data && response.data.user) {
        const u = response.data.user;
        setData({ 
          user: u, 
          orders: response.data.orders || [], 
          contacts: response.data.contacts || [],
          loading: false 
        });
        // Handle direct json
        setProfileForm({
             name: u.name || '', phone: u.phone || '', address: u.address || '',
             birthday: u.birthday ? new Date(u.birthday).toISOString().split('T')[0] : ''
        });
      }
    } catch (error) {
       navigate('/login');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const handleProfileUpdate = async (e) => {
    if (e) e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(profileForm).forEach(k => formData.append(k, profileForm[k]));
      
      if (avatarFile) {
        formData.append('image', avatarFile);
      }
      
      const res = await axiosClient.post('/api/profile/update', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Cập nhật thành công!');
      
      // Clear avatar state after success
      setAvatarFile(null);
      setAvatarPreview(null);
      
      // Update local storage if backend returns new user data
      if (res.data && res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      
      fetchProfile();
    } catch (err) {
      alert('Lỗi cập nhật');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      return alert("Mật khẩu xác nhận không khớp");
    }
    try {
      // Backend expects these fields
      await axiosClient.post('/api/profile/password', passForm);
      alert('Cập nhật mật khẩu thành công!');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      alert('Lỗi đổi mật khẩu');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;
    try {
      await axiosClient.post(`/api/orders/${orderId}/cancel`);
      alert('Hủy đơn hàng thành công! Số lượng sản phẩm đã được hoàn trả vào kho.');
      fetchProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi hủy đơn hàng');
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

  if (data.loading) return <div className="container py-5 text-center">Đang tải biểu mẫu...</div>;
  if (!data.user) return null;

  const user = data.user;

  return (
    <div className="container-fluid pb-5 pt-4">
      <div className="row px-xl-5">
        <div className="col-lg-3 col-md-4 mb-4">
          <div className="bg-light p-4 text-center rounded shadow-sm">
            <div className="position-relative d-inline-block mb-3">
               <img 
                 src={avatarPreview || (user.image ? getImageUrl(user.image) : 'https://www.w3schools.com/howto/img_avatar.png')} 
                 className="rounded-circle border shadow-sm" 
                 style={{width: '150px', height: '150px', objectFit: 'cover'}} 
                 alt="User Avatar" 
                 id="sidebar-avatar-preview"
                 onError={(e) => { e.target.onerror = null; e.target.src = 'https://www.w3schools.com/howto/img_avatar.png'; }}
               />
               <label 
                 htmlFor="avatar-upload" 
                 className="position-absolute border-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                 style={{ bottom: '5px', right: '5px', width: '35px', height: '35px', cursor: 'pointer' }}
                 title="Thay đổi ảnh đại diện"
               >
                 <i className="fas fa-camera"></i>
               </label>
               <input 
                 type="file" 
                 id="avatar-upload" 
                 name="image" 
                 hidden 
                 accept="image/*"
                 onChange={(e) => {
                   if (e.target.files[0]) {
                     const file = e.target.files[0];
                     setAvatarFile(file);
                     setAvatarPreview(URL.createObjectURL(file));
                   }
                 }}
               />
            </div>
            {avatarFile && (
              <div className="mt-3 d-flex justify-content-center">
                <button 
                  className="btn btn-sm btn-success mr-2 px-3 shadow-sm" 
                  onClick={() => handleProfileUpdate()}
                  title="Lưu ảnh đại diện mới"
                >
                  <i className="fas fa-check mr-1"></i> Lưu ảnh
                </button>
                <button 
                  className="btn btn-sm btn-danger px-3 shadow-sm" 
                  onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}
                  title="Hủy bỏ thay đổi"
                >
                  <i className="fas fa-times mr-1"></i> Hủy
                </button>
              </div>
            )}
            <h5 className="font-weight-semi-bold mt-3">{user.name}</h5>
            <p className="text-muted">{user.email}</p>

            <div className="nav flex-column nav-pills text-left mt-4" style={{cursor: 'pointer'}}>
               <div className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><i className="fas fa-user mr-2"></i> Hồ sơ của tôi</div>
               <div className={`nav-link ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}><i className="fas fa-key mr-2"></i> Đổi mật khẩu</div>
               <div className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}><i className="fas fa-shopping-bag mr-2"></i> Đơn hàng của tôi</div>
               <div className={`nav-link ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => setActiveTab('contacts')}><i className="fas fa-envelope mr-2"></i> Liên hệ của tôi</div>
               <button className="nav-link text-danger text-left border-0 bg-transparent mt-3" onClick={async () => { await contextLogout(); navigate('/login'); }}><i className="fas fa-sign-out-alt mr-2"></i> Đăng xuất</button>
            </div>
          </div>
        </div>

        <div className="col-lg-9 col-md-8">
          <div className="tab-content bg-light p-4 rounded shadow-sm">
            
            {activeTab === 'profile' && (
              <div>
                 <h4 className="mb-4">Thông tin cá nhân</h4>
                 <form onSubmit={handleProfileUpdate}>
                    <div className="row">
                       <div className="col-md-6 form-group">
                           <label>Họ và Tên</label>
                           <input type="text" className="form-control" required value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} />
                       </div>
                       <div className="col-md-6 form-group">
                           <label>Email (Không thể thay đổi)</label>
                           <input type="email" className="form-control" readOnly value={user.email} />
                       </div>
                       <div className="col-md-6 form-group">
                           <label>Số điện thoại</label>
                           <input type="text" className="form-control" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} />
                       </div>
                       <div className="col-md-6 form-group">
                           <label>Ngày sinh</label>
                           <input type="date" className="form-control" value={profileForm.birthday} onChange={(e) => setProfileForm({...profileForm, birthday: e.target.value})} />
                       </div>
                       <div className="col-md-12 form-group">
                           <label>Địa chỉ</label>
                           <input type="text" className="form-control" value={profileForm.address} onChange={(e) => setProfileForm({...profileForm, address: e.target.value})} />
                       </div>
                       <div className="col-md-12 form-group">
                           <button type="submit" className="btn btn-primary mt-3">Cập nhật thông tin</button>
                       </div>
                    </div>
                 </form>
              </div>
            )}

            {activeTab === 'password' && (
              <div>
                 <h4 className="mb-4">Đổi mật khẩu</h4>
                 <form onSubmit={handlePasswordUpdate}>
                    <div className="row">
                       <div className="col-md-12 form-group">
                          <label>Mật khẩu hiện tại</label>
                          <input type="password" className="form-control" required value={passForm.currentPassword} onChange={(e) => setPassForm({...passForm, currentPassword: e.target.value})} />
                       </div>
                       <div className="col-md-6 form-group">
                          <label>Mật khẩu mới</label>
                          <input type="password" className="form-control" required minLength="6" value={passForm.newPassword} onChange={(e) => setPassForm({...passForm, newPassword: e.target.value})} />
                       </div>
                       <div className="col-md-6 form-group">
                          <label>Xác nhận mật khẩu mới</label>
                          <input type="password" className="form-control" required minLength="6" value={passForm.confirmPassword} onChange={(e) => setPassForm({...passForm, confirmPassword: e.target.value})} />
                       </div>
                       <div className="col-md-12 form-group">
                          <button type="submit" className="btn btn-primary mt-3">Lưu mật khẩu mới</button>
                       </div>
                    </div>
                 </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                 <h4 className="mb-4">Lịch sử Đơn hàng</h4>
                 <div className="table-responsive">
                    {data.orders.length > 0 ? (
                       <table className="table table-bordered table-hover text-center mb-0">
                          <thead className="thead-dark">
                             <tr>
                                <th>Mã đơn</th>
                                <th>Ngày đặt</th>
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
                                   <td className="align-middle text-success font-weight-bold">{formatCurrency(o.totalPrice)}</td>
                                   <td className="align-middle">
                                      {o.status === 'pending' && <span className="badge badge-warning p-2">Đang xử lý</span>}
                                      {o.status === 'confirmed' && <span className="badge badge-info p-2">Đã xác nhận</span>}
                                      {o.status === 'shipping' && <span className="badge badge-primary p-2">Đang giao</span>}
                                      {o.status === 'completed' && <span className="badge badge-success p-2">Hoàn thành</span>}
                                      {o.status === 'cancelled' && <span className="badge badge-danger p-2">Đã hủy</span>}
                                   </td>
                                   <td className="align-middle">
                                      <Link to={`/orders/${o._id}`} className="btn btn-sm btn-outline-dark mr-1">Chi tiết</Link>
                                      {(o.status === 'pending' || o.status === 'confirmed') && (
                                        <button 
                                          onClick={() => handleCancelOrder(o._id)} 
                                          className="btn btn-sm btn-outline-danger"
                                        >
                                          Hủy đơn
                                        </button>
                                      )}
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    ) : (
                       <div className="text-center py-5 border bg-white rounded">
                           <h5 className="text-muted">Bạn chưa có đơn hàng nào.</h5>
                           <Link to="/shop" className="btn btn-primary mt-3">Mua sắm ngay</Link>
                       </div>
                    )}
                 </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div>
                <h4 className="mb-4">Liên hệ của tôi</h4>
                {data.contacts.length > 0 ? (
                  <div className="list-group">
                    {data.contacts.map((c) => (
                      <div key={c._id} className="list-group-item list-group-item-action flex-column align-items-start mb-3 border rounded shadow-sm p-4">
                        <div className="d-flex w-100 justify-content-between mb-2">
                          <h5 className="mb-1 text-primary">{c.subject}</h5>
                          <small className="text-muted">{new Date(c.createdAt).toLocaleDateString()} {new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                        </div>
                        <p className="mb-3 text-dark bg-light p-3 rounded" style={{borderLeft: '4px solid #ced4da'}}>
                          <i className="fas fa-comment-dots mr-2 text-muted"></i>
                          {c.message}
                        </p>
                        
                        {c.reply ? (
                          <div className="mt-3 p-3 bg-white border-left border-primary rounded" style={{borderLeft: '4px solid #007bff'}}>
                            <div className="font-weight-bold text-primary mb-2">
                              <i className="fas fa-reply mr-2"></i>Admin phản hồi:
                            </div>
                            <div className="text-dark">
                              {c.reply}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 text-muted italic small">
                            <i className="fas fa-hourglass-half mr-2"></i>Đang chờ cửa hàng phản hồi...
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 border bg-white rounded">
                    <i className="fas fa-envelope-open-text fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">Bạn chưa gửi tin nhắn liên hệ nào.</h5>
                    <Link to="/contact" className="btn btn-primary mt-3">Gửi liên hệ ngay</Link>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
