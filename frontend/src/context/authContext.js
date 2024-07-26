"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getCookie, deleteCookie } from "@/actions/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuth = async () => {
        try {
            const token = await getCookie("access-token");
            console.log("Token retrieved:", token); // Log token value
            setIsAuthenticated(!!token);
        } catch (error) {
            console.error("Error checking auth:", error); // Log errors
        }
    };

	const logout = async () => {
		try {
			await deleteCookie();
			setIsAuthenticated(false);
		} catch (error) {
			console.error("Error logging out:", error); // Log errors
		}
	};

	useEffect(() => {
		checkAuth(); // Ensure auth check on mount
	}, []);

	return (
		<AuthContext.Provider value={{ isAuthenticated, checkAuth, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);

