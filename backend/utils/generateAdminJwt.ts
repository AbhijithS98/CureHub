import  jwt  from "jsonwebtoken";
import { Response } from "express";


const generateAdminTokens = (res: Response, adminId: string): string =>{
  //access token
  const accessToken = jwt.sign({ adminId }, process.env.ADMIN_ACCESS_TOKEN_SECRET as string, {
    expiresIn: '10m',
  });

  //refresh token
  const refreshToken = jwt.sign({ adminId }, process.env.ADMIN_REFRESH_TOKEN_SECRET as string, {
    expiresIn: '1d',
  });

  res.cookie('adminRefreshJwt', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV ==='production',  
    sameSite: 'lax',
    maxAge: 1 * 24 * 60 * 60 * 1000,  // 1 day in milliseconds
  });
  
  return accessToken;
}

export default generateAdminTokens; 