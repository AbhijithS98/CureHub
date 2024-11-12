import jwt from 'jsonwebtoken';
const verifyRefreshToken = (refreshToken, role, res) => {
    try {
        let refreshTokenSecret = '';
        let accessTokenSecret = '';
        let idKey = 'userId';
        switch (role) {
            case 'user':
                refreshTokenSecret = process.env.USER_REFRESH_TOKEN_SECRET;
                accessTokenSecret = process.env.USER_ACCESS_TOKEN_SECRET;
                idKey = 'userId';
                break;
            case 'doctor':
                refreshTokenSecret = process.env.DOCTOR_REFRESH_TOKEN_SECRET;
                accessTokenSecret = process.env.DOCTOR_ACCESS_TOKEN_SECRET;
                idKey = 'doctorId';
                break;
            case 'admin':
                refreshTokenSecret = process.env.ADMIN_REFRESH_TOKEN_SECRET;
                accessTokenSecret = process.env.ADMIN_ACCESS_TOKEN_SECRET;
                idKey = 'adminId';
                break;
            default:
                res.status(400).json({ message: 'Invalid role specified.' });
                return null;
        }
        const decoded = jwt.verify(refreshToken, refreshTokenSecret);
        // Generate a new access token
        const accessToken = jwt.sign({ [idKey]: decoded[idKey] }, accessTokenSecret, { expiresIn: '10m' });
        return accessToken;
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.clearCookie(`${role}RefreshJwt`, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
            res.status(403).json({ message: 'Refresh token expired. Please log in again.' });
            return null;
        }
        else {
            res.status(403).json({ message: 'Invalid refresh token.' });
            return null;
        }
    }
};
export default verifyRefreshToken;
