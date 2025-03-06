// src/components/Header/Header.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faMapMarkerAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    return (
        <header className="bg-blue-900 text-white p-2 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm">
                        <FontAwesomeIcon icon={faPhone} className="h-4 mr-1" /> 0898520760
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 mr-1" /> 123 Nguyễn Trãi, P.Tân Phú, Q.3, TP.HCM
                    </span>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <a href="#">
                    <FontAwesomeIcon icon={faShoppingCart} className="h-6" />
                </a>
                <a href="/login" className="text-sm">
                    Đăng nhập
                </a>
            </div>
        </header>
    );
};

export default Header;