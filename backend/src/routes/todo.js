import { Router } from "express";
import {
	createTodo,
	getTodos,
	getTodo,
	updateTodo,
	deleteTodo,
	updateTodoStatus,
	searchTodo,
} from "../controllers/todo.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";

const router = Router();

router.post("/", isLoggedIn, createTodo);
router.put("/", isLoggedIn, updateTodoStatus);

router.get("/search/:value", isLoggedIn, searchTodo);
router.get("/:id", isLoggedIn, getTodo);

router.get("/", isLoggedIn, getTodos);
router.patch("/:id", isLoggedIn, updateTodo);
router.delete("/:id", isLoggedIn, deleteTodo);

export default router;
