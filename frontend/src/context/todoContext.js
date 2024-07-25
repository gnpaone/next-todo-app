"use client";
import { createContext, useState, useContext } from "react";

// Creating the search context
const SearchContext = createContext();

// Create a provider component
export const SearchProvider = ({ children }) => {
	const [searchValue, setSearchValue] = useState("");
	const [sortOption, setSortOption] = useState("order");
	const [newTodo, setNewTodo] = useState(false);
	return (
		<SearchContext.Provider
			value={{
				searchValue,
				setSearchValue,
				sortOption,
				setSortOption,
				newTodo,
				setNewTodo,
			}}>
			{children}
		</SearchContext.Provider>
	);
};

// Custom hook to use the search context
export const useSearch = () => useContext(SearchContext);
