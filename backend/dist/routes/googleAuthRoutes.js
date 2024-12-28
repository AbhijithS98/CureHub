// import express from 'express';
// import passport from 'passport';
// import { Request, Response } from 'express';
// const router = express.Router();
// router.get('/google', (req, res, next) => {
//   console.log('Google login route hit'); // Check if this logs
//   next();
// }, passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
// // Google callback route
// router.get(
//   '/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login', session: false }),
//   (req: Request, res: Response) => {
//     const user = req.user;
//     if (user ) {
//       console.log("user is: ",user);  
//       // // Send JWT token back to the frontend
//       // res.cookie('userJwt', user.token, { httpOnly: true, secure: true, sameSite: 'Strict' });
//       // res.redirect('/'); // Redirect to the home page or wherever you want after successful login
//     } else {
//       res.status(401).send('Authentication failed');
//     }
//   }
// );
// export default router;
import express from 'express';
const router = express.Router();
