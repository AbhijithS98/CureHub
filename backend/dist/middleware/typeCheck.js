const typeCheckMiddleware = (req, res, next) => {
    req.files = req.files; // Cast req.files to the appropriate type
    next();
};
export default typeCheckMiddleware;
