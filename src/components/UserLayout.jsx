import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const UserLayout = () => {
    return (
        <>
            <Header />
            <div className="container-fluid mb-3">
                <Outlet />
            </div>
            <Footer />
        </>
    );
};

export default UserLayout;
