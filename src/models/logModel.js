import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readFile = async (filePath) => {
  try {
    const contents = await fs.readFile(filePath, 'utf8');
    return contents;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getErrorLogContents = async () => {
  const errorLogPath = path.join(__dirname, '..', '..', 'logs', 'error.log');
  const contents = await readFile(errorLogPath);
  return contents;
};

const getAccessLogContents = async () => {
    const accessLogPath = path.join(__dirname, '..', '..', 'logs', 'access.log');
    const contents = await readFile(accessLogPath);
    return contents;
};

const getAllAccessLog = async (data) => {
    // get all access log files
    const accessLogContents = await getAccessLogContents();
    const lines = accessLogContents.split(/\r?\n/).filter(line => line.trim() !== '');
    // create an array of objects
    let accessLogs = lines.map((line) => {
        const lineArray = line.split('|').map(str => str.trim());
        const time = lineArray[0].replace('[','').replace(']','');
        const level = lineArray[1].replace('[','').replace(']','').trim();
        const message = lineArray[2].trim();
        const server = lineArray[3].trim();
        const urlPath = lineArray[4].trim();
        const lastHost = lineArray[5].trim();
        const httpMethod = lineArray[6].trim();
        const httpStatus = lineArray[7].trim();
        const result = {
            time,
            level,
            message,
            server,
            urlPath,
            lastHost,
            httpMethod,
            httpStatus
        };
        return result;
    });
    // check if there is a search query
    if (data.search) {
        accessLogs = accessLogs.filter((log) => {
            return log.message.toLowerCase().includes(data.search.toLowerCase());
        });
    }
    // get total number of logs
    const totalData = accessLogs.length;
    // sort the logs by time descending
    accessLogs.sort((a, b) => {
        return new Date(b.time) - new Date(a.time);
    });
    // get the total page
    const totalPage = Math.ceil(totalData / data.limit);
    // get the current page
    const currentPage = data.page;
    // get the start index
    const startIndex = (data.page - 1) * data.limit;
    // get the end index
    const endIndex = data.page * data.limit;
    // get the data
    const dataResult = accessLogs.slice(startIndex, endIndex);
    // return the result
    return { totalData, totalPage, currentPage, data: dataResult };
};

const getAllErrorLog = async (data) => {
    // get all error log files
    const errorLogContents = await getErrorLogContents();
    const lines = errorLogContents.split(/\r?\n/).filter(line => line.trim() !== '');
    // create an array of objects
    let errorLogs = lines.map((line) => {
        const lineArray = line.split('|').map(str => str.trim());
        const time = lineArray[0].replace('[','').replace(']','');
        const level = lineArray[1].replace('[','').replace(']','').trim();
        const isStackTrace = (lineArray[2].trim() === "true");
        const message = lineArray[3].trim();
        const server = lineArray[4].trim();
        const urlPath = lineArray[5].trim();
        const lastHost = lineArray[6].trim();
        const httpMethod = lineArray[7].trim();
        const httpStatus = lineArray[8].trim();
        const result = {
            time,
            level,
            isStackTrace,
            message,
            server,
            urlPath,
            lastHost,
            httpMethod,
            httpStatus
        };
        return result;
    });
    // check if there is a search query
    if (data.search) {
        // filter the error logs
        errorLogs = errorLogs.filter((errorLog) => {
            return (
                errorLog.message.toLowerCase().includes(data.search.toLowerCase())
            );
        });
    }
    // get the total data
    const totalData = errorLogs.length;
    // sort the logs by time descending
    errorLogs.sort((a, b) => {
        return new Date(b.time) - new Date(a.time);
    });
    // get the total page
    const totalPage = Math.ceil(totalData / data.limit);
    // get the current page
    const currentPage = data.page;
    // get the start index
    const startIndex = (data.page - 1) * data.limit;
    // get the end index
    const endIndex = data.page * data.limit;
    // get the data
    const dataResult = errorLogs.slice(startIndex, endIndex);
    // return the result
    return { totalData, totalPage, currentPage, data: dataResult };
};

export default {
    getAllAccessLog,
    getAllErrorLog
};