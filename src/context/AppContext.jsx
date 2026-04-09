import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const syncState = async () => {
    try {
      const response = await axiosClient.get('/api/users/me');
      if (response.data.success) {
        setUser(response.data.user);
        setCartCount(response.data.cartCount || 0);
        setWishlistCount(response.data.wishlistCount || 0);
      } else {
        setUser(null);
        setCartCount(0);
        setWishlistCount(0);
      }
    } catch (error) {
      console.error("Auth sync error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncState();
    
    // Listen for custom auth-change events
    const handleAuthChange = () => syncState();
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const login = (userData) => {
    setUser(userData);
    syncState();
  };

  const logout = async () => {
    try {
      await axiosClient.get('/api/users/logout');
      setUser(null);
      setCartCount(0);
      setWishlistCount(0);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const addToCart = async (product, qty = 1, size = null) => {
    // OPTIMISTIC UI: Giả định là thêm món mới hoàn toàn và tăng số ngay
    // (Nếu là món đã có, syncState() sau đó sẽ điều chỉnh lại cho đúng)
    setCartCount(prev => prev + 1);

    try {
      await axiosClient.post('/api/cart/add', {
        id: product.id || product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: qty,
        size: size
      });
      syncState(); // Cập nhật lại con số chính xác tuyệt đối từ server
      alert('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (error) {
      setCartCount(prev => Math.max(0, prev - 1)); // Hoàn tác nếu lỗi
      console.error("Add to cart error", error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng.';
      alert(msg);
    }
  };

  const addToWishlist = async (productId) => {
    // OPTIMISTIC UI: Tăng ngay lập tức
    setWishlistCount(prev => prev + 1);

    try {
      const response = await axiosClient.post('/api/wishlist/add', { productId });
      if (response.data.success) {
        // Cập nhật lại số chuẩn từ server
        setWishlistCount(response.data.wishlistCount || (wishlistCount + 1));
        alert('Đã thêm vào danh sách yêu thích!');
      }
    } catch (error) {
      setWishlistCount(prev => Math.max(0, prev - 1)); // Hoàn tác nếu lỗi
      console.error("Add to wishlist error", error);
      alert('Vui lòng đăng nhập để sử dụng tính năng này.');
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, setUser, 
      cartCount, setCartCount,
      wishlistCount, setWishlistCount, 
      loading, syncState, 
      login, logout, 
      addToCart, addToWishlist 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
