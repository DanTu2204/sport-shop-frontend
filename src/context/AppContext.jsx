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
    try {
      const response = await axiosClient.post('/api/cart/add', {
        id: product.id || product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: qty,
        size: size
      });
      syncState(); // Update counts
      alert('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (error) {
      console.error("Add to cart error", error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng.';
      alert(msg);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      await axiosClient.get(`/api/wishlist?add=${productId}`);
      syncState();
      alert('Đã thêm vào danh sách yêu thích!');
    } catch (error) {
      console.error("Add to wishlist error", error);
      alert('Vui lòng đăng nhập để sử dụng tính năng này.');
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, setUser, 
      cartCount, wishlistCount, 
      loading, syncState, 
      login, logout, 
      addToCart, addToWishlist 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
