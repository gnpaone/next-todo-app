import axios from "axios";
import { getCookie } from "@/actions/auth";

// Assuming BE_URL is your backend URL
const BE_URL = process.env.NEXT_PUBLIC_BE_URL;

const axiosInstance = axios.create({
	baseURL: BE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Rename `fetchData` to `fetchData`
const fetchData = async ({ url, method, body }) => {
	const token = await getCookie("access-token");
	console.log("Token:", token);

	try {
		const { data } = await axiosInstance(`${BE_URL}/${url}`, {
			method,
			data: body,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return data;
	} catch (error) {
		return error;
	}
};

export { axiosInstance, fetchData };
