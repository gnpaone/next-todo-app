"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchData } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { useSearch } from "@/context/todoContext";

const schema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
});

const CreateTodoModal = ({
	isOpen,
	onClose,
	id,
	title,
	description,
	order,
}) => {
	const { setNewTodo } = useSearch();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			title: title ? title : "",
			description: description ? description : "",
		},
	});

	const createTodo = async (values) => {
		try {
			const data = await fetchData({
				url: `api/v1/todo`,
				method: "POST",
				body: JSON.stringify(values),
			});

			if (data.success) {
				setNewTodo(data.data.todo._id);
				onClose();
				revalidatePath("/todo");
			}
		} catch (error) {}
	};
	const editTodo = async (values) => {
		try {
			const data = await fetchData({
				url: `api/v1/todo/${id}`,
				method: "PATCH",
				body: {
					...values,
					order,
				},
			});

			if (data.success) {
				setNewTodo(data.data.todo._id);
				revalidatePath("/todo");
				onClose();
			}
		} catch (error) {}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='bg-white p-6 rounded shadow-lg w-full max-w-md mx-4 sm:w-1/2 lg:w-1/3'>
				<h2 className='text-2xl font-bold mb-4'>
					{title ? "Edit Todo" : "Add Todo"}
				</h2>
				<form>
					<div className='mb-4'>
						<label className='block text-gray-700'>Title</label>
						<Input
							type='text'
							placeholder='Enter title'
							{...register("title")}
							className='mt-1 block w-full p-2 border border-gray-300 rounded'
						/>
						{errors.title && (
							<p className='text-red-500 text-sm mt-2'>
								{errors.title.message}
							</p>
						)}
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700'>
							Description
						</label>
						<textarea
							{...register("description")}
							placeholder='Enter description'
							className='mt-1 block w-full p-2 border border-gray-300 rounded'
						/>
						{errors.description && (
							<p className='text-red-500 text-sm mt-2'>
								{errors.description.message}
							</p>
						)}
					</div>
					<div className='flex items-center gap-4 justify-end'>
						<Button
							className='cursor-pointer'
							onClick={onClose}
							variant='destructive'>
							Cancel
						</Button>
						{title ? (
							<Button
								onClick={handleSubmit(editTodo)}
								variant='hero'
								className='cursor-pointer'>
								Edit Todo
							</Button>
						) : (
							<Button
								onClick={handleSubmit(createTodo)}
								variant='hero'
								className='cursor-pointer'>
								Create Todo
							</Button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateTodoModal;
