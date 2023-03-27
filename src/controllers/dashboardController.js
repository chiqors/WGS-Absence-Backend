import dashboardModel from '../models/dashboardModel.js';
import logger from '../utils/logger.js';

const getDashboardCards = async(req, res) => {
    try {
        await dashboardModel.getDashboardCards().then((response) => {
            if (response) {
                return res.status(200).send(response);
            } else {
                return res.status(404).send('Not found');
            }
        });
    } catch (err) {
        logger.saveErrorLogV2({
            level: 'ERR',
            isStackTrace: true,
            message: err.message,
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 500
        })
        return res.status(500).send('Internal server error');
    }
}

const getTopAttendance = async(req, res) => {
    try {
        await dashboardModel.getTopAttendance().then((resp) => {
            if (resp) {
                return res.status(200).send(resp);
            } else {
                return res.status(404).send('Not found');
            }
        }).catch((error) => {
            logger.saveErrorLogV2({
                level: 'ERR',
                isStackTrace: true,
                message: error.message,
                server: 'BACKEND',
                urlPath: req.originalUrl,
                lastHost: req.headers.host,
                method: req.method,
                status: 500
            })
            return res.status(500).send('Internal server error');
        });
    } catch (err) {
        logger.saveErrorLogV2({
            level: 'ERR',
            isStackTrace: true,
            message: err.message,
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 500
        })
        return res.status(500).send('Internal server error');
    }
}

const getGraphAveragePresence = async(req, res) => {
    try {
        await dashboardModel.getAverageAttendanceThisMonth().then((resp) => {
            if (resp) {
                return res.status(200).send(resp);
            } else {
                return res.status(404).send('Not found');
            }
        }).catch((error) => {
            logger.saveErrorLogV2({
                level: 'ERR',
                isStackTrace: true,
                message: error.message,
                server: 'BACKEND',
                urlPath: req.originalUrl,
                lastHost: req.headers.host,
                method: req.method,
                status: 500
            })
            return res.status(500).send('Internal server error');
        });
    } catch (err) {
        logger.saveErrorLogV2({
            level: 'ERR',
            isStackTrace: true,
            message: err.message,
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 500
        })
        return res.status(500).send('Internal server error');
    }
}

export default {
    getDashboardCards,
    getTopAttendance,
    getGraphAveragePresence
}