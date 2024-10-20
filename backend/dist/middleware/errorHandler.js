const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if (err.name === 'ValidationError') {
        res.status(400).json({ message: err.message });
    }
    else if (err.name === 'UnauthorizedError') {
        res.status(401).json({ message: 'Unauthorized' });
    }
    else {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
export default errorHandler;
