import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from "@features/Header/Header.jsx";
import Footer from "@features/Contact/Footer.jsx";


const MainLayout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet /> {/* Các component con sẽ được render ở đây */}
            </main>
            <Footer />
        </>
    );
};

export default MainLayout;