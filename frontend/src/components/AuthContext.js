import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (token) {
            setIsAuthenticated(true);
            setUserRole(role);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole }}>
            {children}
        </AuthContext.Provider>
    );
};
