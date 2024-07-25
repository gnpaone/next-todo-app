import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Title is required"],
			trim: true,
		},
		description: {
			type: String,
			required: [true, "Description is required"],
			trim: true,
		},
		order: {
			type: Number,
			required: [true, "Order is required"],
		},
		status: {
			type: String,
			enum: ["todo", "in progress", "done"],
			default: "todo",
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		created_at: {
		    type: Date,
		    default: Date.now,
  		},
	},
	{ timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
