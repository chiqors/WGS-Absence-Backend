// Depedencies & Libraries
import express from 'express';
import morgan from 'morgan';
import bodyParser from "body-parser";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Routes
import apiRouter from './src/routes/api.js';
import genRouter from './src/routes/gen.js';
import authRouter from './src/routes/auth.js';

// Utils
import logger from './src/utils/logger.js';

// Global variables and Initialization
dotenv.config();
const app = express();
const checkProductionMode = process.env.PRODUCTION_MODE === 'true'
const checkNgrokMode = process.env.NGROK_MODE === 'true'
// remove http for express listen in production mode
const listenUrl = process.env.BACKEND_PRODUCTION_URL.replace('https://', '');

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
// Error 404
app.use((req, res, next) => {
    res.status(404).send('Sorry cant find that!');
});

if (checkNgrokMode) {
    if (checkProductionMode) {
        console.error('Ngrok mode is enabled. Please disable it in .env file')
        process.exit(1)
    }
    app.listen(process.env.BACKEND_PORT, () => {
        console.log(`${process.env.APP_NAME} listening on port ${process.env.BACKEND_PORT} from ${process.env.BACKEND_DEVELOPMENT_URL}`)
        console.log(`Ngrok mode is ${process.env.NGROK_MODE}. Backend is listening on ${process.env.BACKEND_PRODUCTION_URL}`)
    });
} else {
    if (checkProductionMode) {
        app.listen(process.env.BACKEND_PORT, listenUrl, () => {
            console.log(`${process.env.APP_NAME} listening on port ${process.env.BACKEND_PORT} from ${process.env.BACKEND_PRODUCTION_URL}`)
        });
    } else {
        app.listen(process.env.BACKEND_PORT, () => {
            console.log(`${process.env.APP_NAME} listening on port ${process.env.BACKEND_PORT} from ${process.env.BACKEND_DEVELOPMENT_URL}`)
        });
    }
}