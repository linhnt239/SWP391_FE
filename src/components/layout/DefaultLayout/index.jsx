// src/components/DefaultLayout/index.js
import { useEffect, useState } from 'react';
import Header from '../Header/Header';
import HeaderAfterLogin from '../Header/HeaderAfterLogin';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const DefaultLayout = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        // Lắng nghe sự thay đổi trong localStorage
        const handleStorageChange = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            {isLoggedIn ? <HeaderAfterLogin /> : <Header />}
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default DefaultLayout;