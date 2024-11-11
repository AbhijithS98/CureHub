import jwt from "jsonwebtoken";
const generateDoctorToken = (res, doctorId) => {
    const token = jwt.sign({ doctorId }, process.env.JWT_SECRET_DOCTOR, {
        expiresIn: '30d',
    });
    res.cookie('doctorJwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return token;
};
export default generateDoctorToken;
