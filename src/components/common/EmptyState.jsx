import React from 'react';

const EmptyState = ({ message }) => {
    return (
        <div className="text-center py-8">
            <p className="text-gray-500">{message}</p>
        </div>
    );
};

export default EmptyState; 