import  jwt  from "jsonwebtoken";
import { Response } from "express";


const generateDoctorTokens = (res: Response, doctorId: string): string =>{
  //access token
  const accessToken = jwt.sign({ doctorId }, process.env.DOCTOR_ACCESS_TOKEN_SECRET as string, {
    expiresIn: '10m',
  });

  //refresh token
  const refreshToken = jwt.sign({ doctorId }, process.env.DOCTOR_REFRESH_TOKEN_SECRET as string, {
    expiresIn: '1d',
  });

  res.cookie('doctorRefreshJwt', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV ==='production',  
    sameSite: 'lax',
    maxAge: 1 * 24 * 60 * 60 * 1000,  // 1 day in milliseconds
  });
  
  return accessToken;
}

export default generateDoctorTokens; 