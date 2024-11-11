import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

interface JwtUserPayload {
  userId: string;
}

const verifyRefreshToken = (refreshToken:any, res:Response) => {

    try{

        const decoded = jwt.verify(refreshToken, process.env.USER_REFRESH_TOKEN_SECRET as string) as JwtUserPayload;
        
        // Generate a new access token
        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.USER_ACCESS_TOKEN_SECRET as string, {
          expiresIn: '10m',
        });
        
        return accessToken;

    }catch (error){

       if (error instanceof jwt.TokenExpiredError) {
            res.clearCookie('userRefreshJwt', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });

            res.status(403).json({ message: 'Refresh token expired. Please log in again.' });
            return null;
        } else {
            res.status(403).json({ message: 'Invalid refresh token.' });
            return null;
        }
    }
};

export default verifyRefreshToken;
