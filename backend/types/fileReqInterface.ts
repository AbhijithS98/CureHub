import { Request } from 'express';

// Define a custom interface for requests that include file uploads
export interface IRequestWithFiles extends Request {
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}
