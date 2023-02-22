// Depedencies & Libraries
import express from 'express';
import morgan from 'morgan';
import bodyParser from "body-parser";
import dotenv from 'dotenv'
import cors from 'cors';

// Routes
import apiRouter from './routes/api.js';
import genRouter from './routes/gen.js';

// Utils
import logger from './utils/logger.js';

// Global variables and Initialization
const app = express();
const port = process.env.PORT || 3000;
dotenv.config();

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// setup the logger
app.use(morgan('combined', { stream: logger.saveMorganLog() }))

// support parsing of application/json type post data
app.use(bodyParser.json())
// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }))

// Static files
app.use(express.static('public'));

// CORS
app.use(cors());

// Routing
app.use('/api', apiRouter);
app.use('/gen', genRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});