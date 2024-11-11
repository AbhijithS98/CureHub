import  jwt  from "jsonwebtoken";
import { Response } from "express";


const generateUserTokens = (res: Response, userId: string): string =>{
  //access token
  const accessToken = jwt.sign({ userId }, process.env.USER_ACCESS_TOKEN_SECRET as string, {
    expiresIn: '10m',
  });

  //refresh token
  const refreshToken = jwt.sign({ userId }, process.env.USER_REFRESH_TOKEN_SECRET as string, {
    expiresIn: '1d',
  });

  res.cookie('userRefreshJwt', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV ==='production',  
    sameSite: 'lax',
    maxAge: 1 * 24 * 60 * 60 * 1000,  // 1 day in milliseconds
  });
  
  return accessToken;
}

export default generateUserTokens; 