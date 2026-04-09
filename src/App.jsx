import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Topbar from './components/Topbar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';

function App() {
  return (
    <Router>
      <Topbar />
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        {/* Placeholder for other routes */}
        <Route path="*" element={<div className="container py-5 text-center"><h2>Khong tim thay trang / Not Found</h2></div>} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
