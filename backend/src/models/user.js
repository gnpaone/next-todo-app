import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, "First name is required"],
			trim: true,
			lowercase: true,
		},
		lastName: {
			type: String,
			required: [true, "Last name is required"],
			trim: true,
			lowercase: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			trim: true,
			lowercase: true,
			unique: [true, "Email already exists"],
			validator: validator.isEmail,
		},
		password: {
			type: String,
		},
		type: {
			type: String,
			enum: ["email", "google"],
			default: "email",
		},
		role: {
			type: String,
			enum: ["admin", "user"],
			default: "user",
		},
	},
	{ timestamps: true }
);

// Getting jwt login token
userSchema.methods.getJwtLoginToken = async function () {
	const token = jwt.sign(
		{
			id: this._id,
		},
		process.env.JWT_SECRET_KEY,
		{
			expiresIn: process.env.JWT_EXPIRY,
		}
	);
	return token;
};

// Checking is valid password
userSchema.methods.isValidPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
