import rfs from 'rotating-file-stream';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import moment from 'moment';

// Global variables and Initialization
// get the project directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
moment.locale('id');

const saveErrorLog = (err, url, http_method, status_code) => {
    // saving error messages to a file in the logs directory
    let accessLogStream = rfs.createStream('error.log', {
        interval: '1d', // rotate daily
        path: path.join(__dirname, '../logs')
    })
    // write error message with timestamp
    accessLogStream.write(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err} = ${url} - ${http_method} | ${status_code}` + '\n');
}

const saveMorganLog = () => {
    // saving access messages to a file
    let accessLogStream = rfs.createStream('access.log', {
        interval: '1d', // rotate daily
        path: path.join(__dirname, '../logs')
    })
    return accessLogStream;
}
    

export default {
    saveErrorLog,
    saveMorganLog
};