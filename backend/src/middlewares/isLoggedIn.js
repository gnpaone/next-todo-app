import jwt from "jsonwebtoken";

import User from "../models/user.js";
import customError from "../utils/customError.js";

import dotenv from 'dotenv';

dotenv.config();

const isLoggedIn = async (req, res, next) => {
	let token = req.cookies.token;

	if (!token && req.header("Authorization")) {
		token = req.header("Authorization").replace("Bearer ", "");

		if (!token) {
			return customError({
				res,
				status: 401,
				message: "Please login to access this route",
			});
		}
	} else if (!token) {
		return customError({
			res,
			status: 401,
			message: "Please login to access this route",
		});
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

		const user = await User.findById(decoded.id);

		if (!user) {
			return customError({
				res,
				status: 401,
				message: "User not found",
			});
		}

		req.user = user;

		next();
	} catch (error) {
		console.log("Error in isLoggedIn middleware: ");
		console.log(error);
		return res.status(500).json({
			success: false,
			status: "error",
			message: "Please login to access this route",
		});
	}
};

export default isLoggedIn;
