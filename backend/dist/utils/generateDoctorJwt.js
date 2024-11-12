import jwt from "jsonwebtoken";
const generateDoctorTokens = (res, doctorId) => {
    //access token
    const accessToken = jwt.sign({ doctorId }, process.env.DOCTOR_ACCESS_TOKEN_SECRET, {
        expiresIn: '10m',
    });
    //refresh token
    const refreshToken = jwt.sign({ doctorId }, process.env.DOCTOR_REFRESH_TOKEN_SECRET, {
        expiresIn: '1d',
    });
    res.cookie('doctorRefreshJwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });
    return accessToken;
};
export default generateDoctorTokens;
