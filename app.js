// Depedencies & Libraries
import express from 'express';
import rfs from 'rotating-file-stream';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Routes
import apiRouter from './routes/api.js';

// Global variables
const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// HTTP request logger middleware for node.js
// create a rotating write stream
var accessLogStream = rfs.createStream('server.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs')
})
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

// Routing
app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});