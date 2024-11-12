import jwt from 'jsonwebtoken';
const verifyDoctorToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        console.error("no token provided");
        res.status(401).json({ message: 'No token provided, authorization denied' });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.DOCTOR_ACCESS_TOKEN_SECRET);
        req.doctor = { Id: decoded.doctorId };
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.error("Token expired");
            res.status(401).json({ message: 'Token expired' });
        }
        else {
            console.error("Invalid token");
            res.status(403).json({ message: 'Invalid token' });
        }
    }
};
export default verifyDoctorToken;
