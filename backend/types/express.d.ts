
declare namespace Express {
  export interface Request {
    user?: { Id: string };  // For user authentication
    doctor?: { Id: string };  // For doctor authentication
    admin?: { Id: string };  // For admin authentication
  }
}
  