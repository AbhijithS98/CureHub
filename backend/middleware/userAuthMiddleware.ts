import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface JwtUserPayload {
  userId: string;  
}

const verifyUserToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    console.error("no token provided")
    res.status(401).json({ message: 'No token provided, authorization denied' });
    return;
  } 

  try {
    const decoded = jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET as string) as JwtUserPayload;
    req.user = { Id: decoded.userId };
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

export default verifyUserToken;
