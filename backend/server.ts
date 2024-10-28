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
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const PORT: number = Number(process.env.PORT) || 5000;
const app = express()

//connect to database
connectDB()


app.use(cors({
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded( { extended: true } ))
app.use(cookieParser())

app.use('/api/users',userRoutes)
app.use('/api/doctors',doctorRoutes)
app.use('/api/admin',adminRoutes)

console.log("path: ",path.join(__dirname,'../public'));

app.use(express.static(path.join(__dirname,'../public')));


app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Server Ready')
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
