import mongoose from "mongoose";

import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
	mongoose
		.connect(process.env.DB_URL)
		.then(console.log("DATABASE CONNECTED"))
		.catch((error) => {
			console.log("DATABASE NOT CONNECTED");
			console.log(error);
			process.exit(1);
		});
};

export default connectDB;
