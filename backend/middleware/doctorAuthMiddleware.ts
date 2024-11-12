import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface JwtDoctorPayload {
  doctorId: string;  
}

const verifyDoctorToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    console.error("no token provided")
    res.status(401).json({ message: 'No token provided, authorization denied' });
    return;
  } 

  try {
    const decoded = jwt.verify(token, process.env.DOCTOR_ACCESS_TOKEN_SECRET as string) as JwtDoctorPayload;
    req.doctor = { Id: decoded.doctorId };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error("Token expired");
      res.status(401).json({ message: 'Token expired' });
    } else {
      console.error("Invalid token");
      res.status(403).json({ message: 'Invalid token' });
    }
  }
};

export default verifyDoctorToken;
