import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import sessionRoutes from './routes/sessions';
import cardRoutes from './routes/cards';


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  credentials: true
}));
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
    res.send('hola mundo!');
});

app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'server is running, holmes',
      timestamp: new Date().toISOString(),
    });
});



// app routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/cards', cardRoutes);

// catch all 404s
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
