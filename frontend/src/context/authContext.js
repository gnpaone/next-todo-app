"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getCookie, deleteCookie } from "@/actions/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuth = async () => {
        const token = await getCookie("access-token");
        setIsAuthenticated(!!token);
    };

	const logout = async () => {
		await deleteCookie();
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, checkAuth, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
