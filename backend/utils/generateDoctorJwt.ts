import  jwt  from "jsonwebtoken";
import { Response } from "express";


const generateDoctorToken = (res: Response, doctorId: string): void =>{
  const token = jwt.sign({ doctorId }, process.env.JWT_SECRET_DOCTOR as string, {
    expiresIn: '30d',
  });

  res.cookie('doctorJwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',  
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,  
  });
}

export default generateDoctorToken; 