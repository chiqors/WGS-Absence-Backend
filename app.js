// Depedencies & Libraries
import express from 'express';
import morgan from 'morgan';
import bodyParser from "body-parser";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Routes
import apiRouter from './routes/api.js';
import genRouter from './routes/gen.js';
import authRouter from './routes/auth.js';

// Utils
import logger from './utils/logger.js';

// Global variables and Initialization
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

// 1. Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 2. Cookie Parser
app.use(cookieParser());

// 3. setup the logger
app.use(morgan('combined', { stream: logger.saveMorganLog() }))

// 4. CORS
app.use(cors());

// 5. support parsing of application/json type post data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 6. Static files
app.use(express.static('public'));

// Routing
app.use('/api', apiRouter);
app.use('/gen', genRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});