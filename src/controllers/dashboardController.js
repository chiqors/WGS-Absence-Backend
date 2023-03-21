import dashboardModel from '../models/dashboardModel.js';
import logger from '../utils/logger.js';

const getDashboardData = async(req, res) => {
    try {
        await dashboardModel.getDashboard().then((response) => {
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

export default {
    getDashboardData
}