"use client";
import { useState, useEffect } from "react";
import TodoItem from "./components/TodoItem";
import { fetchData } from "@/lib/api";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useSearch } from "@/context/todoContext";

const Todo = () => {
	const { searchValue, sortOption, newTodo } = useSearch();

	const [todo, setTodo] = useState([]);
	const [inProgressTodo, setInProgressTodo] = useState([]);
	const [doneTodo, setDoneTodo] = useState([]);

	const fetchTodo = async () => {
		const data = await fetchData({
			url: `api/v1/todo`,
			method: "GET",
		});

		if (data.success) {
			setTodo(data.data.todo);
			setInProgressTodo(data.data.inProgressTodo);
			setDoneTodo(data.data.doneTodo);
		}
	};

	// UseEffect to fetch todos on initial render
	useEffect(() => {
		fetchTodo();
	}, [newTodo]);

	// UseEffect to fetch todos on searchValue change
	useEffect(() => {
		const fetchTodos = async () => {
			try {
				const data = await fetchData({
					url: `api/v1/todo/search/${searchValue}`,
					method: "GET",
				});

				if (data.success) {
					setTodo(data.data.todo);
					setInProgressTodo(data.data.inProgressTodo);
					setDoneTodo(data.data.doneTodo);
				}
			} catch (error) {
				console.error("Error fetching todos:", error);
			}
		};

		// Debounce mechanism: delay the fetch call
		const delayDebounceFn = setTimeout(() => {
			if (searchValue) {
				fetchTodos();
			} else {
				fetchTodo();
			}
		}, 500); // 500ms debounce delay

		// Cleanup function to clear the timeout if searchValue changes before the timeout completes
		return () => clearTimeout(delayDebounceFn);
	}, [searchValue]);

	// UseEffect to sort todos based on sortOption
	useEffect(() => {
		const sortTodos = (todos) => {
			switch (sortOption) {
				case "title":
					return [...todos].sort((a, b) =>
						a.title.localeCompare(b.title)
					);
				case "createdAt":
					return [...todos].sort(
						(a, b) => new Date(a.createdAt) - new Date(b.createdAt)
					);
				case "updatedAt":
					return [...todos].sort(
						(a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
					);
				case "mostRecent":
					return [...todos].sort(
						(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
					);
				default:
					return todos;
			}
		};

		setTodo((prevTodos) => sortTodos(prevTodos));
		setInProgressTodo((prevTodos) => sortTodos(prevTodos));
		setDoneTodo((prevTodos) => sortTodos(prevTodos));
	}, [sortOption]);

	const onDragEnd = async (result) => {
		console.log("Result: ", result);
		const { source, destination } = result;

		if (!destination) return;
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		)
			return;

		let add;
		let aTodo = todo;
		let aInProgressTodo = inProgressTodo;
		let aDoneTodo = doneTodo;

		// Removing todo from source
		if (source.droppableId === "todo") {
			add = aTodo[source.index];
			aTodo.splice(source.index, 1);
		} else if (source.droppableId === "inProgressTodo") {
			add = aInProgressTodo[source.index];
			aInProgressTodo.splice(source.index, 1);
		} else {
			add = aDoneTodo[source.index];
			aDoneTodo.splice(source.index, 1);
		}

		// Adding todo to destination
		if (destination.droppableId === "todo") {
			aTodo.splice(destination.index, 0, add);
		} else if (destination.droppableId === "inProgressTodo") {
			aInProgressTodo.splice(destination.index, 0, add);
		} else {
			aDoneTodo.splice(destination.index, 0, add);
		}

		// Updating states
		setTodo([...aTodo]);
		setInProgressTodo([...aInProgressTodo]);
		setDoneTodo([...aDoneTodo]);

		// Updating database
		const updatedTodos = {
			todo: aTodo.map((item, index) => ({ ...item, order: index })),
			inProgressTodo: aInProgressTodo.map((item, index) => ({
				...item,
				order: index,
			})),
			doneTodo: aDoneTodo.map((item, index) => ({
				...item,
				order: index,
			})),
		};

		try {
			const data = await fetchData({
				url: `api/v1/todo`,
				method: "PUT",
				body: updatedTodos,
			});

			if (data.success) {
				console.log("Updated dnd data: ", data);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className='mt-8 mx-auto max-w-screen-2xl px-4 md:px-8'>
				<div className='flex flex-col gap-4 lg:flex-row lg:justify-between'>
					<div className='lg:w-[33%]'>
						<h2 className='text-xs mb-1 lg:text-sm'>Todo</h2>
						<Droppable droppableId='todo'>
							{(provided) => (
								<div
									ref={provided.innerRef}
									{...provided.droppableProps}
									className='bg-red-200 rounded-lg p-2 w-full flex flex-col gap-2'>
									{todo.map((item, index) => (
										<TodoItem
											key={item._id}
											index={index}
											{...item}
										/>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</div>
					<div className='lg:w-[33%]'>
						<h2 className='text-xs mb-1 lg:text-sm'>In Progress</h2>
						<Droppable droppableId='inProgressTodo'>
							{(provided) => (
								<div
									ref={provided.innerRef}
									{...provided.droppableProps}
									className='bg-yellow-100 rounded-lg p-2 w-full flex flex-col gap-2'>
									{inProgressTodo.map((item, index) => (
										<TodoItem
											index={index}
											key={item._id}
											{...item}
										/>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</div>
					<div className='lg:w-[33%]'>
						<h2 className='text-xs mb-1 lg:text-sm'>Done</h2>
						<Droppable droppableId='doneTodo'>
							{(provided) => (
								<div
									ref={provided.innerRef}
									{...provided.droppableProps}
									className='bg-green-200 rounded-lg p-2 w-full flex flex-col gap-2 '>
									{doneTodo.map((item, index) => (
										<TodoItem
											index={index}
											key={item._id}
											{...item}
										/>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</div>
				</div>
			</div>
		</DragDropContext>
	);
};

export default Todo;
