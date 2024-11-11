import jwt from "jsonwebtoken";
const generateUserToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_USER, {
        expiresIn: '30d',
    });
    res.cookie('userJwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });
    return token;
};
export default generateUserToken;
