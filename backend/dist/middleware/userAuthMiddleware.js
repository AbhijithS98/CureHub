import jwt from 'jsonwebtoken';
const verifyUserToken = (req, res, next) => {
    const token = req.cookies.userJwt;
    if (!token) {
        console.error("no token");
        res.status(401).json({ message: 'No token provided, authorization denied' });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
        req.user = { Id: decoded.userId };
        next();
    }
    catch (error) {
        console.error(error);
        res.status(403).json({ message: 'Invalid token' });
    }
};
export default verifyUserToken;
