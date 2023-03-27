import Job from '../models/jobModel.js';
import logger from '../utils/logger.js';

const index = async(req, res) => {
    const values = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 5
    }
    const data = await Job.getAllJobsPaginated(values.page, values.limit);
    res.json(data);
}

const store = async(req, res) => {
    try {
        await Job.storeJob(req.body);
        logger.saveLog({
            level: 'INFO',
            message: `Job ${req.body.name} created`,
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 201
        })
        return res.status(201).json({ message: 'Job created' });
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
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const show = async(req, res) => {
    const paramId = parseInt(req.params.id);
    const data = await Job.getJobById(paramId);
    res.json(data);
}

const update = async(req, res) => {
    try {
        await Job.updateJob(req.body);
        logger.saveLog({
            level: 'ACC',
            message: `Job ${req.body.name} updated`,
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 201
        })
        return res.status(200).json({ message: 'Job updated' });
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
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const destroy = async(req, res) => {
    try {
        await Job.deleteJob(req.params.id);
        logger.saveLog({
            level: 'ACC',
            message: `Job ${req.params.id} deleted`,
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 201
        })
        return res.status(201).json({ message: 'Job deleted' });
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
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const showDutyAttendanceEmployee = async(req, res) => {
    const paramJobId = parseInt(req.params.job_id);
    const data = await Job.getDutyAttendanceEmployee(paramJobId);
    res.json(data);
}

export default {
    index,
    store,
    show,
    update,
    destroy,
    showDutyAttendanceEmployee
};