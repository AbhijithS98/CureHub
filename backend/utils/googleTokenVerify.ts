import { OAuth2Client } from 'google-auth-library';
import { TokenPayload } from 'google-auth-library'; 
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const GoogleTokenVerify = async (token: string): Promise<TokenPayload | undefined> => {


  try {
          const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID, 
      });
      const payload = ticket.getPayload();
      
      if (!payload) {
          throw new Error("Failed to extract payload from Google token");
      }
      console.log("Google token payload:", payload);
      return payload;
  } catch (error) {
      console.error("Error verifying Google token:", error);
      throw new Error("Invalid Google token");
  }
};