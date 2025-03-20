// src/components/staff/Sidebar.js
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Sidebar = ({ activeSection, setActiveSection }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <div className="w-64 bg-gray-800 text-white p-4">
            <div className="relative">
                <div
                    className="flex items-center mb-6 cursor-pointer"
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <Image
                        src="/avt.jpg"
                        alt="Staff Avatar"
                        width={40}
                        height={40}
                        className="rounded-full mr-2"
                    />
                    <div>
                        <p className="text-sm">Staff 1</p>
                        <p className="text-xs">Staff ID: 001</p>
                    </div>
                </div>
                {showDropdown && (
                    <div className="absolute top-12 left-0 w-full bg-gray-700 rounded-md shadow-lg z-10">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 rounded-md"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
            <nav>
                <ul className="space-y-2">
                    <li>
                        <button
                            onClick={() => setActiveSection('overview')}
                            className={`w-full text-left px-4 py-2 rounded ${activeSection === 'overview' ? 'bg-teal-500' : 'hover:bg-gray-700'}`}
                        >
                            Overview
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveSection('addVaccine')}
                            className={`w-full text-left px-4 py-2 rounded ${activeSection === 'addVaccine' ? 'bg-teal-500' : 'hover:bg-gray-700'}`}
                        >
                            Vaccine Management
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveSection('appointment')}
                            className={`w-full text-left px-4 py-2 rounded ${activeSection === 'appointment' ? 'bg-teal-500' : 'hover:bg-gray-700'}`}
                        >
                            Appointment Management
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveSection('feedback')}
                            className={`w-full text-left px-4 py-2 rounded ${activeSection === 'feedback' ? 'bg-teal-500' : 'hover:bg-gray-700'}`}
                        >
                            Feedback
                        </button>
                    </li>
                    {/* <li>
                        <button
                            onClick={() => setActiveSection('system')}
                            className={`w-full text-left px-4 py-2 rounded ${activeSection === 'system' ? 'bg-teal-500' : 'hover:bg-gray-700'}`}
                        >
                            System Management
                        </button>
                    </li> */}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
