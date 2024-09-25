import express, { urlencoded } from 'express'
import connectDB from './config/db.js'
import dotenv from 'dotenv'
const PORT = process.env.PORT || 5000;

dotenv.config();
const app = express()
connectDB()

app.use(express.json());

app.get('/', (req, res) => res.send('Server Ready'));
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.use(express.urlencoded())