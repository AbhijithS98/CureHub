import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import doctorRepository from '../repositories/doctorRepository.js';

interface JwtDoctorPayload {
  doctorId: string;  
}

const verifyDoctorToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    console.error("no token provided")
    res.status(401).json({ message: 'No token provided, authorization denied' });
    return;
  } 

  try {
    const decoded = jwt.verify(token, process.env.DOCTOR_ACCESS_TOKEN_SECRET as string) as JwtDoctorPayload;
    const doctor = await doctorRepository.findDoctorById(decoded.doctorId);
        
    if(doctor?.isBlocked){
      console.error("doctor is blocked");
      res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
      return;
    }

    req.doctor = { Id: decoded.doctorId };
    
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error("Token expired");
      res.status(401).json({ message: 'Token expired' });
    } else {
      console.error("Invalid token");
      res.status(403).json({ message: 'Invalid token' });
    }
  }
  next();
};

export default verifyDoctorToken;
