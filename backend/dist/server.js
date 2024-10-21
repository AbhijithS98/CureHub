import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import errorHandler from './middleware/errorHandler.js';
dotenv.config();
const PORT = Number(process.env.PORT) || 5000;
const app = express();
//connect to database
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorHandler);
app.get('/', (req, res) => {
    res.send('Server Ready');
});
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
