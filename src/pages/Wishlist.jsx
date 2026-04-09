import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient, { getImageUrl } from '../api/axiosClient';

function Wishlist() {
  const [data, setData] = useState({ wishlist: [], loading: true });

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axiosClient.get('/api/wishlist');
        // Fallback for data structure
        if (response.data && response.data.data) {
          setData({ wishlist: response.data.data.wishlist || [], loading: false });
        } else if (response.data && response.data.wishlist) {
          setData({ wishlist: response.data.wishlist || [], loading: false });
        } else {
          setData({ wishlist: [], loading: false });
        }
      } catch (error) {
         setData({ wishlist: [], loading: false });
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (id) => {
    try {
      await axiosClient.post('/api/wishlist/remove', { id });
      setData(prev => ({
        ...prev,
        wishlist: prev.wishlist.filter(item => item.id !== id)
      }));
    } catch (error) {
      alert("Lỗi khi xóa khỏi danh sách yêu thích");
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await axiosClient.post('/api/cart/add', {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        qty: 1
      });
      alert('Đã thêm thành công vào giỏ hàng!');
    } catch (error) {
      alert('Lỗi khi thêm giỏ hàng');
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

  if (data.loading) return <div className="container py-5 text-center">Đang tải danh sách yêu thích...</div>;

  return (
    <div className="container-fluid pt-5">
      <div className="row px-xl-5">
        <div className="col-12 table-responsive mb-5">
           <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Danh sách yêu thích</span></h5>
           {data.wishlist?.length > 0 ? (
             <table className="table table-light table-borderless table-hover text-center mb-0">
               <thead className="thead-dark">
                  <tr>
                     <th>Sản phẩm</th>
                     <th>Giá</th>
                     <th>Thêm vào giỏ</th>
                     <th>Xóa</th>
                  </tr>
               </thead>
               <tbody className="align-middle">
                  {data.wishlist.map((item, i) => (
                    <tr key={i}>
                       <td className="align-middle text-left pl-4">
                          {item.image && <img src={getImageUrl(item.image)} style={{width: '50px', marginRight: '15px'}} alt={item.name} />}
                          <Link to={`/detail?id=${item.id}`} className="text-dark">{item.name}</Link>
                       </td>
                       <td className="align-middle">{formatCurrency(item.price)}</td>
                       <td className="align-middle">
                          <button className="btn btn-sm btn-primary" onClick={() => handleAddToCart(item)}>
                             <i className="fa fa-shopping-cart mr-1"></i> Thêm giỏ hàng
                          </button>
                       </td>
                       <td className="align-middle">
                          <button className="btn btn-sm btn-danger" onClick={() => handleRemove(item.id)}>
                             <i className="fa fa-times"></i>
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
             </table>
           ) : (
             <div className="bg-light p-5 text-center border">
                <h4 className="text-muted mb-4">Danh sách yêu thích của bạn trống.</h4>
                <Link to="/shop" className="btn btn-primary px-4">Khám phá sản phẩm</Link>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
