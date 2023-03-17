import LogModel from '../models/logModel.js';

const getAccessLog = async(req, res) => {
    const values = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 5,
        search: req.query.search || null
    }
    const data = await LogModel.getAllAccessLog(values);
    res.json(data);
}

const getErrorLog = async(req, res) => {
    const values = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 5,
        search: req.query.search || null
    }
    const data = await LogModel.getAllErrorLog(values);
    res.json(data);
}

export default {
    getAccessLog,
    getErrorLog
}