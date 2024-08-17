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
    // archive logs every week or if log file > 10MB
    const logsPath = path.join(__dirname, '../../logs');
    const fileLogPath = path.join(logsPath, logFilename);

    if (dayjs().day() === 1) {
        fs.stat(fileLogPath, (err, stats) => {
            if (err) console.log(err);

            const fileSizeInBytes = stats.size;
            const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

            if (dayjs().day() === 1 || fileSizeInMB > 10) {
                const archiveFilename = `${logFilename}-${dayjs().format('YYYY-MM-DD')}.zip`;
                const archivePath = path.join(logsPath, 'backup', archiveFilename);
                // check if archive file not exist, create new archive file
                if (!fs.existsSync(archivePath)) {
                    const output = fs.createWriteStream(archivePath);
                    const archive = archiver('zip', {
                        zlib: { level: 9 } // Sets the compression level.
                    });
                    // listen for all archive data to be written
                    output.on('close', function () {
                        // delete file log
                        fs.unlinkSync(accessLogPath);
                    });
                    // good practice to catch this error explicitly
                    archive.on('error', function (err) {
                        throw err;
                    });
                    // pipe archive data to the file
                    archive.pipe(output);
                    // append log file to archive file
                    archive.file(fileLogPath, { name: logFilename });
                    // finalize the archive (ie we are done appending files but streams have to finish yet)
                    archive.finalize();
                }
            }
        });
    }
};

const saveErrorLog = (log) => {
    // saving error messages to a file in the logs directory
    let errorLogStream = fs.createWriteStream(path.join(__dirname, '../../logs/error.log'), {
        flags: 'a' // 'a' means appending (old data will be preserved)
    });
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
    // saving access messages to a file in the logs directory
    let accessLogStream = fs.createWriteStream(path.join(__dirname, '../../logs/access.log'), {
        flags: 'a' // 'a' means appending (old data will be preserved)
    });
    // write log message with timestamp
    accessLogStream.write(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] | [${log.level}] | ${log.message} | ${log.server} | ${log.urlPath} | ${log.lastHost} | ${log.method} | ${log.status}\n`);
    archiveLogs('access.log');
}

const saveMorganLog = () => {
    // saving morgan messages to a file
    let morganLogStream = fs.createWriteStream(path.join(__dirname, '../../logs/morgan.log'), {
        flags: 'a' // 'a' means appending (old data will be preserved)
    });
    return morganLogStream;
}
    

export default {
    saveErrorLog,
    saveLog,
    saveMorganLog
};