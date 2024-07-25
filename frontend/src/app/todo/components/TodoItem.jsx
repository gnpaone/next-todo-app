"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateTodoModal from "./createTodoModal";
import ViewTodo from "./view";
import { fetchData } from "@/lib/api";
import { Draggable } from "react-beautiful-dnd";

const TodoItem = ({
	_id,
	index,
	title,
	description,
	order,
	status,
	createdAt,
	updatedAt,
}) => {
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);

	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "long", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	const onView = () => {
		setIsViewModalOpen(true);
	};
	const onEdit = () => {
		openEditModal();
	};
	const onDelete = async () => {
		try {
			const data = await fetchData({
				url: `api/v1/todo/${_id}`,
				method: "DELETE",
			});

			if (data.success) {
				console.log(data);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const openEditModal = () => setIsEditModalOpen(true);
	const closeEditModal = () => setIsEditModalOpen(false);

	return (
		<Draggable draggableId={_id.toString()} index={index}>
			{(provided) => (
				<div
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
					className='bg-white shadow-md rounded-lg p-4 cursor-pointer'>
					<div className='flex flex-col justify-between items-start '>
						<div>
							<h3 className='text-lg font-bold text-gray-800'>
								{title}
							</h3>
							<p className='text-sm text-gray-600 mt-1'>
								{description}
							</p>
							<p className='text-xs text-gray-400 mt-2'>
								{formatDate(createdAt)}
							</p>
						</div>
						<div className='flex mt-4 space-x-4'>
							<Button variant='hero' onClick={onView}>View</Button>
							<Button variant='secondary' onClick={onEdit}>
								Edit
							</Button>
							<Button onClick={onDelete} variant='destructive'>
								Delete
							</Button>
						</div>
					</div>
					<CreateTodoModal
						isOpen={isEditModalOpen}
						onClose={closeEditModal}
						id={_id}
						title={title}
						description={description}
						order={order}
					/>
					<ViewTodo
						isOpen={isViewModalOpen}
						onClose={() => setIsViewModalOpen(false)}
						status={status}
						title={title}
						description={description}
						createdAt={createdAt}
						updatedAt={updatedAt}
					/>
				</div>
			)}
		</Draggable>
	);
};

export default TodoItem;
