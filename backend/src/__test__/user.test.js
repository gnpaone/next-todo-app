import request from "supertest";
import mongoose from "mongoose";
import app from "../../app.js"; // Adjust the path to your app
import User from "../models/user.js"; // Adjust the path to your User model
import connectDB from "../db/index.js"; // Adjust the path to your DB connection

// Connect to the database before running tests
beforeAll(async () => {
	await connectDB();
});

// Clean up database after tests
afterAll(async () => {
	await User.deleteMany(); // Clear the users collection
	await mongoose.connection.close();
});

describe("POST /register", () => {
	it("should successfully register a new user", async () => {
		const userData = {
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@example.com",
			password: "password123",
		};

		const res = await request(app).post("/register").send(userData);
		console.log("Res: ", res);

		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty("success", true);
		expect(res.body.message).toBe("User created successfully");
		expect(res.body.data.user).toHaveProperty("email", userData.email);
		expect(res.body.data.user).toHaveProperty(
			"firstName",
			userData.firstName
		);
		expect(res.body.data.user).toHaveProperty(
			"lastName",
			userData.lastName
		);
	});

	it("should return 400 if required fields are missing", async () => {
		const res = await request(app)
			.post("/register")
			.send({ firstName: "John", email: "john.doe@example.com" }); // Missing lastName and password

		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty("success", false);
		expect(res.body.message).toBe(
			"firstName, lastName, email and password are required"
		);
	});

	it("should return 401 if user already exists", async () => {
		const userData = {
			firstName: "Jane",
			lastName: "Doe",
			email: "jane.doe@example.com",
			password: "password123",
		};

		// First, create a user
		await User.create(userData);

		// Then attempt to register with the same email
		const res = await request(app).post("/register").send(userData);

		expect(res.statusCode).toBe(401);
		expect(res.body).toHaveProperty("success", false);
		expect(res.body.message).toBe("User already exists, please login");
	});

	it("should handle internal server errors gracefully", async () => {
		// Mock User.create to throw an error
		jest.spyOn(User, "create").mockImplementation(() => {
			throw new Error("Database error");
		});

		const userData = {
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@example.com",
			password: "password123",
		};

		const res = await request(app).post("/register").send(userData);

		expect(res.statusCode).toBe(500);
		expect(res.body).toHaveProperty("success", false);
		expect(res.body.message).toBe("Internal server error");

		// Restore the original implementation
		User.create.mockRestore();
	});
});
