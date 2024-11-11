import jwt from "jsonwebtoken";
const generateAdminToken = (res, adminId) => {
    const token = jwt.sign({ adminId }, process.env.JWT_SECRET_ADMIN, {
        expiresIn: '30d',
    });
    res.cookie('adminJwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return token;
};
export default generateAdminToken;
