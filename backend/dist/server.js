import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
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
app.use(errorHandler);
app.get('/', (req, res) => {
    res.send('Server Ready');
});
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
