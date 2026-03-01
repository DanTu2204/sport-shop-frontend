import { Routes, Route } from 'react-router-dom';
import UserLayout from './components/UserLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes with Original Header/Footer */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="product" element={<AdminProducts />} />
          <Route path="*" element={<div style={{ padding: '2rem' }}>Page under construction</div>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
