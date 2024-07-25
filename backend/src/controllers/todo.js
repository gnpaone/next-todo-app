import customError from "../utils/customError.js";
import response from "../utils/response.js";

import Todo from "../models/todo.js";

export const createTodo = async (req, res) => {
	const { title, description } = req.body;

	// Checking all the fields are present
	if (!title || !description) {
		return customError({
			res,
			status: 400,
			message: "title, and description are required",
		});
	}
	try {
		const highestOrderTodo = await Todo.findOne().sort("-order");
		const newOrder = highestOrderTodo ? highestOrderTodo.order + 1 : 1;

		const todo = await Todo.create({
			title,
			description,
			order: newOrder,
			userId: req.user._id,
		});

		// Sending response
		response({
			res,
			status: 201,
			message: "Todo created successfully",
			data: { todo },
		});
	} catch (error) {
		console.log("Error in create todo: ");
		console.log(error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

export const getTodos = async (req, res) => {
	try {
		const todo = await Todo.find({
			userId: req.user._id,
			status: "todo",
		}).sort("order");
		const inProgressTodo = await Todo.find({
			userId: req.user._id,
			status: "in progress",
		}).sort("order");
		const doneTodo = await Todo.find({
			userId: req.user._id,
			status: "done",
		}).sort("order");

		// Sending response
		response({
			res,
			status: 200,
			message: "Todo's fetched successfully",
			data: { todo, inProgressTodo, doneTodo },
		});
	} catch (error) {
		console.log("Error in get todo: ");
		console.log(error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

export const getTodo = async (req, res) => {
	const { id } = req.params;

	console.log("Request ");

	try {
		const todo = await Todo.findOne({ _id: id, userId: req.user._id });

		if (!todo) {
			return customError({
				res,
				status: 404,
				message: "Todo not found",
			});
		}

		// Sending response
		response({
			res,
			status: 200,
			message: "Todo fetched successfully",
			data: { todo },
		});
	} catch (error) {
		console.log("Error in get todo: ");
		console.log(error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

export const updateTodo = async (req, res) => {
	const { id } = req.params;
	const { title, description, order } = req.body;

	// Checking all the fields are present
	if (!title || !description || !order) {
		return customError({
			res,
			status: 400,
			message: "title, description, and order are required",
		});
	}

	try {
		const todo = await Todo.findOne({ _id: id, userId: req.user._id });

		if (!todo) {
			return customError({
				res,
				status: 404,
				message: "Todo not found",
			});
		}

		const updatedTodo = await Todo.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
		});

		// Sending response
		response({
			res,
			status: 200,
			message: "Todo updated successfully",
			data: { todo: updatedTodo },
		});
	} catch (error) {
		console.log("Error in update todo: ");
		console.log(error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

export const updateTodoStatus = async (req, res) => {
	const { todo, inProgressTodo, doneTodo } = req.body;

	if (!todo || !inProgressTodo || !doneTodo) {
		return customError({
			res,
			status: 400,
			message: "todo, inProgressTodo, and doneTodo are required",
		});
	}

	try {
		const bulkOperations = [];

		todo.forEach((item) => {
			bulkOperations.push({
				updateOne: {
					filter: { _id: item._id },
					update: {
						order: item.order,
						status: "todo",
					},
				},
			});
		});

		inProgressTodo.forEach((item) => {
			bulkOperations.push({
				updateOne: {
					filter: { _id: item._id },
					update: {
						order: item.order,
						status: "in progress",
					},
				},
			});
		});

		doneTodo.forEach((item) => {
			bulkOperations.push({
				updateOne: {
					filter: { _id: item._id },
					update: {
						order: item.order,
						status: "done",
					},
				},
			});
		});

		await Todo.bulkWrite(bulkOperations);

		// Sending response
		res.status(200).json({
			success: true,
			message: "Todos updated successfully",
			data: {},
		});
	} catch (error) {
		console.log("Error in update todo status: ");
		console.log(error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

export const deleteTodo = async (req, res) => {
	const { id } = req.params;

	try {
		const todo = await Todo.findOne({ _id: id, userId: req.user._id });

		if (!todo) {
			return customError({
				res,
				status: 404,
				message: "Todo not found",
			});
		}

		await Todo.deleteOne({ _id: id });

		// Sending response
		response({
			res,
			status: 200,
			message: "Todo deleted successfully",
		});
	} catch (error) {
		console.log("Error in delete todo: ");
		console.log(error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

export const searchTodo = async (req, res) => {
	const { value } = req.params;

	try {
		const searchQuery = {
			userId: req.user._id,
			$or: [
				{ title: { $regex: value, $options: "i" } },
				{ description: { $regex: value, $options: "i" } },
			],
		};

		// Perform the search
		const todo = await Todo.find({
			...searchQuery,
			status: "todo",
		}).sort("order");
		const inProgressTodo = await Todo.find({
			...searchQuery,
			status: "in progress",
		}).sort("order");
		const doneTodo = await Todo.find({
			...searchQuery,
			status: "done",
		}).sort("order");

		// Send the response
		res.status(200).json({
			success: true,
			message: "Search Todo's fetched successfully",
			data: { todo, inProgressTodo, doneTodo },
		});
	} catch (error) {
		console.error("Error in searchTodo: ", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
