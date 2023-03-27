import rfs from 'rotating-file-stream';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dayjs from 'dayjs';
import archiver from 'archiver';
import fs from 'fs';

// Global variables and Initialization
// get the project directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dayjs.locale('id');

const archiveLogs = (logFilename) => {
    const logPath = path.join(__dirname, '../../logs');
    const backupPath = path.join(logPath, 'backup');
    if (!fs.existsSync(backupPath)) fs.mkdirSync(backupPath);
    const archivePath = path.join(backupPath, `${logFilename}-${dayjs().format('YYYY-MM-DD')}.zip`);
    const archive = archiver('zip', { zlib: { level: 9 }});
    const logStream = fs.createReadStream(path.join(logPath, logFilename));

    const archiveStream = fs.createWriteStream(archivePath, { flags: 'w' });
    archiveStream.on('close', () => {
        // delete the original log file after archiving
        fs.unlink(path.join(logPath, logFilename), (err) => {
            if (err) console.error(`Error deleting ${logFilename}:`, err);
        });
    });

    archive.pipe(archiveStream);
    archive.append(logStream, { name: logFilename });
    archive.finalize();
};

const saveErrorLogV2 = (log) => {
    // saving error messages to a file in the logs directory
    let errorLogStream = rfs.createStream('error.log', {
        interval: '7d', // rotate daily
        path: path.join(__dirname, '../../logs')
    })
    if (log.isStackTrace) {
        // Replace newline characters with a space
        const stackTraceOneLine = log.message.replace(/\n/g, ' ');
        // write error message with timestamp
        errorLogStream.write(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] | [${log.level}] | ${log.isStackTrace} | ${stackTraceOneLine} | ${log.server} | ${log.urlPath} | ${log.lastHost} | ${log.method} | ${log.status}\n`);
    } else {
        // write error message with timestamp
        errorLogStream.write(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] | [${log.level}] | false | ${log.message} | ${log.server} | ${log.urlPath} | ${log.lastHost} | ${log.method} | ${log.status}\n`);
    }
    archiveLogs('error.log');
}

const saveLog = (log) => {
    // saving error messages to a file in the logs directory
    let accessLogStream = rfs.createStream('access.log', {
        interval: '7d', // rotate daily
        path: path.join(__dirname, '../../logs')
    })
    // write log message with timestamp
    accessLogStream.write(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] | [${log.level}] | ${log.message} | ${log.server} | ${log.urlPath} | ${log.lastHost} | ${log.method} | ${log.status}\n`);
    archiveLogs('access.log');
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
    saveErrorLogV2,
    saveLog,
    saveMorganLog
};