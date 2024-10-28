// middleware/typeCheck.ts
import { NextFunction, Request, Response } from 'express';
import { IRequestWithFiles } from '../types/fileReqInterface'; // Adjust the path

const typeCheckMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req.files = req.files as IRequestWithFiles['files']; // Cast req.files to the appropriate type
    next();
};

export default typeCheckMiddleware;
