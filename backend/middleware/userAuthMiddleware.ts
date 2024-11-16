import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import userRepository from '../repositories/userRepository.js';

interface JwtUserPayload {
  userId: string;  
}

const verifyUserToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    console.error("no token provided")
    res.status(401).json({ message: 'No token provided, authorization denied' });
    return;
  } 

  try {
    const decoded = jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET as string) as JwtUserPayload;
    const User = await userRepository.findUserById(decoded.userId);
    console.log("user: ",User);

    if(User?.isBlocked){
      console.error("User is blocked");
      res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
      return;
    }
    
    req.user = { Id: decoded.userId };

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

export default verifyUserToken;
