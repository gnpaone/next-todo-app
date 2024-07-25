import request from "supertest";
import mongoose from "mongoose";
import connectDB from "../db/index.js";
import app from "../../app.js";

beforeAll(async () => {
	await connectDB(); // Connect to the database
});

afterAll(async () => {
	await mongoose.connection.close(); // Close the database connection
});

describe("GET /health", () => {
	it("should return a success message", async () => {
		const res = await request(app).get("/health");
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual({ success: true, message: "Hello World" });
	});
});
