// src/components/DefaultLayout/index.js
import React from 'react';
import Header from '../Header/HeaderAfterLogin';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const DefaultLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
};

export default DefaultLayout;