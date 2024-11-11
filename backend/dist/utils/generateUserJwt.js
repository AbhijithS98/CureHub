import jwt from "jsonwebtoken";
const generateUserTokens = (res, userId) => {
    //access token
    const accessToken = jwt.sign({ userId }, process.env.USER_ACCESS_TOKEN_SECRET, {
        expiresIn: '1m',
    });
    //refresh token
    const refreshToken = jwt.sign({ userId }, process.env.USER_REFRESH_TOKEN_SECRET, {
        expiresIn: '1m',
    });
    res.cookie('userRefreshJwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1 * 60 * 1000, // 1 day in milliseconds
    });
    return accessToken;
};
export default generateUserTokens;
