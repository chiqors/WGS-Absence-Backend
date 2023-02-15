// Depedencies & Libraries
import express from 'express';
import rfs from 'rotating-file-stream';
import morgan from 'morgan';
import bodyParser from "body-parser";
import * as dotenv from 'dotenv'
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Routes
import apiRouter from './routes/api.js';
import genRouter from './routes/gen.js';

// Global variables and Initialization
const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// HTTP request logger middleware for node.js
// create a rotating write stream
let accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs')
})
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

// support parsing of application/json type post data
app.use(bodyParser.json())
// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }))

// Routing
app.use('/api', apiRouter);
app.use('/gen', genRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});