import  jwt  from "jsonwebtoken";
import { Response } from "express";


const generateAdminToken = (res: Response, adminId: string): string =>{
  const token = jwt.sign({ adminId }, process.env.JWT_SECRET_ADMIN as string, {
    expiresIn: '30d',
  });

  res.cookie('adminJwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',  
    sameSite: 'none',
    maxAge: 30 * 24 * 60 * 60 * 1000,  
});

  return token;
}

export default generateAdminToken; 