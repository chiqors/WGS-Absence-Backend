import rfs from 'rotating-file-stream';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dayjs from 'dayjs';

// Global variables and Initialization
// get the project directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dayjs.locale('id');

const saveErrorLog = (err, url, http_method, status_code) => {
    // saving error messages to a file in the logs directory
    let accessLogStream = rfs.createStream('error.log', {
        interval: '1d', // rotate daily
        path: path.join(__dirname, '../../logs')
    })
    // write error message with timestamp
    accessLogStream.write(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] ${err} = ${url} - ${http_method} | ${status_code}` + '\n');
}

const saveErrorLogV2 = (log) => {
    // saving error messages to a file in the logs directory
    let accessLogStream = rfs.createStream('error.log', {
        interval: '1d', // rotate daily
        path: path.join(__dirname, '../../logs')
    })
    if (log.isStackTrace) {
        // Replace newline characters with a space
        const stackTraceOneLine = log.message.replace(/\n/g, ' ');
        // write error message with timestamp
        accessLogStream.write(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] | [${log.level}] | ${log.isStackTrace} | ${stackTraceOneLine} | ${log.server} | ${log.urlPath} | ${log.lastHost} | ${log.method} | ${log.status}\n`);
    } else {
        // write error message with timestamp
        accessLogStream.write(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] | [${log.level}] | false | ${log.message} | ${log.server} | ${log.urlPath} | ${log.lastHost} | ${log.method} | ${log.status}\n`);
    }
}

const saveLog = (log) => {
    // saving error messages to a file in the logs directory
    let accessLogStream = rfs.createStream('access.log', {
        interval: '1d', // rotate daily
        path: path.join(__dirname, '../../logs')
    })
    // write log message with timestamp
    accessLogStream.write(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] | [${log.level}] | ${log.message} | ${log.server} | ${log.urlPath} | ${log.lastHost} | ${log.method} | ${log.status}\n`);
}

const saveMorganLog = () => {
    // saving access messages to a file
    let accessLogStream = rfs.createStream('morgan.log', {
        interval: '1d', // rotate daily
        path: path.join(__dirname, '../../logs')
    })
    return accessLogStream;
}
    

export default {
    saveErrorLog,
    saveErrorLogV2,
    saveLog,
    saveMorganLog
};