const customError = ({ res, status, message }) => {
	return res.status(status).json({ success: false, message });
};

export default customError;
