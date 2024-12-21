import nodemailer from 'nodemailer'
import dotenv from 'dotenv';

dotenv.config(); 

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const sendEmail = async ({ to, subject, text, html }: EmailOptions): Promise<void> => {
  try {
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOptions = {
      from: 'abhijithSb745@gmail.com',
      to,
      subject,
      ...(text && { text }), 
      ...(html && { html }),  
    }

    await transporter.sendMail(mailOptions);
    console.log('email sent successfully');
  }
  catch (error){
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }  
}

export default sendEmail;