const ViewTodo = ({
	isOpen,
	onClose,
	title,
	description,
	status,
	createdAt,
	updatedAt,
}) => {
	if (!isOpen) return null;

	const formatDate = (date) => {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, "0");
		const day = String(d.getDate()).padStart(2, "0");
		const hours = String(d.getHours()).padStart(2, "0");
		const minutes = String(d.getMinutes()).padStart(2, "0");
		return `${year}-${month}-${day} ${hours}:${minutes}`;
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='bg-white rounded-lg p-6 w-11/12 max-w-lg mx-auto shadow-lg'>
				<div className='flex justify-between items-center border-b pb-2 mb-4'>
					<h2 className='text-xl font-semibold'>{title}</h2>
					<button
						onClick={onClose}
						className='text-gray-500 hover:text-gray-700'>
						&times;
					</button>
				</div>
				<div className='mb-4'>
					<p className='text-gray-700'>{description}</p>
				</div>
				<div className='mb-4'>
					<span className='font-bold'>Status: </span>
					<span className='text-gray-700'>{status}</span>
				</div>
				<div className='mb-4'>
					<span className='font-bold'>Created At: </span>
					<span className='text-gray-700'>
						{formatDate(createdAt)}
					</span>
				</div>
				<div>
					<span className='font-bold'>Updated At: </span>
					<span className='text-gray-700'>
						{formatDate(updatedAt)}
					</span>
				</div>
			</div>
		</div>
	);
};

export default ViewTodo;
