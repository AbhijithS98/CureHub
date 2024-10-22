import  jwt  from "jsonwebtoken";
import { Response } from "express";


const generateUserToken = (res: Response, userId: string): string =>{
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_USER as string, {
    expiresIn: '30d',
  });

  res.cookie('userJwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',  
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days in milliseconds
  });
  return token;
}

export default generateUserToken; 