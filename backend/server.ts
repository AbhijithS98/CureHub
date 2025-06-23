import express, { Request, Response } from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cors from 'cors';
import connectDB from './config/db.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js'
import doctorRoutes from './routes/doctorRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import paymentRoutes from './routes/paymentRoute.js'
import chatRoutes from './routes/chatRoutes.js'
import errorHandler from './middleware/errorHandler.js';
import { Server } from 'socket.io';
import http from 'http';
import Chat from './models/chatModel.js';

const os = require("os");
const serverName = os.hostname();
console.log("servername:", serverName);

dotenv.config();

const PORT: number = Number(process.env.PORT) || 5000;
const app = express()

//connect to database
connectDB()

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
}));

app.use(express.json());
app.use(express.urlencoded( { extended: true } ));
app.use(cookieParser());


app.use('/api/users',userRoutes);
app.use('/api/doctors',doctorRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/chat', chatRoutes);


app.use(express.static(path.join(__dirname,'../public')));
console.log("dir-name:",__dirname);


app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Server Ready')
});

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for joining a specific room (doctor or patient)
  socket.on('join', ({ userId, doctorId }) => {
    const room = `${userId}-${doctorId}`;
    socket.join(room); 
  });
  
  socket.on('leave', ({ userId, doctorId }) => {
    const room = `${userId}-${doctorId}`;
    socket.leave(room);
  });

  // Handle incoming messages
  socket.on('sendMessage', async (data) => {
    const { doctorId, patientId, message, isDoctorSender } = data;

    try {
      // Save message to database
      const chat = new Chat({
        doctorId,
        patientId,
        message,
        isDoctorSender,
      });
      await chat.save();

      // // Determine the recipient
      // const recipientId = isDoctorSender ? patientId : doctorId;
      // // Emit the message to the recipient
      // socket.to(recipientId).emit('receiveMessage', chat);
      const room = `${patientId}-${doctorId}`;
      socket.to(room).emit('receiveMessage', chat);

    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
