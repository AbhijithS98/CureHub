import express, { Request, Response } from 'express'
import connectDB from './config/db'
import dotenv from 'dotenv'

dotenv.config();

const PORT: number = Number(process.env.PORT) || 5000;
const app = express()

//connect to database
connectDB()

//middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded( { extended: true } ))

app.get('/', (req: Request, res: Response) => {
  res.send('Server Ready')
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

