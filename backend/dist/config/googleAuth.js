var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
dotenv.config();
const configureGoogleAuth = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: process.env.NODE_ENV === 'production' ? 'https://curehub.life/api/auth/google/callback'
            : 'http://localhost:5000/api/auth/google/callback',
    }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("profile is:", profile);
            // // Find or create a user in the database based on the Google profile
            // let user = await User.findOne({ googleId: profile.id });
            // if (!user) {
            //   // If user doesn't exist, create a new user
            //   user = new User({
            //     googleId: profile.id,
            //     name: profile.displayName,
            //     email: profile.emails?.[0]?.value || '',
            //   });
            //   await user.save();
            // }
            // // Generate JWT token for the user
            // const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || '', { expiresIn: '30d' });
            // // Return the user and token
            // done(null, { user, token });
        }
        catch (error) {
            done(error, false);
        }
    })));
};
export default configureGoogleAuth;
