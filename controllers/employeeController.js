import { validationResult } from 'express-validator';
import Employee from '../models/employeeModel.js';
import logger from '../utils/logger.js';

const login = async(req, res) => {
    const data = await Employee.checkAuth(req.body.username, req.body.password);
    if (data.rows.length > 0) {
        res.json(data.rows);
    } else {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog('Failed to do authentication', fullUrl, 'POST', 404);
        res.status(404).json({ message: 'Failed to do authentication' });
    }
}

const index = async(req, res) => {
    const reqlimit = req.query.limit;
    const reqoffset = req.query.offset;
    const data = await Employee.getAllEmployeesWithLimitOffsetAndRelationWithJobs(reqlimit, reqoffset);
    const total = await Employee.countAllEmployees();
    const getTotalPage = Math.ceil(total / reqlimit);
    const response = {
        total_data: total,
        total_pages: getTotalPage,
        data: data.rows
    }
    if (data.rows.length > 0) {
        res.json(response);
    } else {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog('Employee List Empty', fullUrl, 'GET', 404);
        res.status(404).json({ message: 'Data is Empty' });
    }
};

const store = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog('Validation Error', fullUrl, 'POST', 422);
        return res.status(422).json({ errors: errors.array() });
    }
    if (req.file) {
        const fullPublicUrl = `${process.env.UPLOAD_FOLDER || '/uploads'}/${req.body.username}/${req.file.filename}`
        req.body.photo_url = fullPublicUrl
    }
    await Employee.storeEmployee(req.body).catch((err) => {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog(err, fullUrl, 'POST', 500);
        res.status(500).json({ message: 'Internal Server Error' });
    });
    return res.status(201).json({ message: 'submitted' });
}

const show = async(req, res) => {
    const data = await Employee.getEmployeeById(req.params.id);
    if (data.rows.length > 0) {
        res.json(data.rows);
    } else {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog('Employee not found', fullUrl, 'GET', 404);
        res.status(404).json({ message: 'Data not found' });
    }
}

const update = async(req, res) => {
    await Employee.updateEmployee(req.body);
}

const destroy = async(req, res) => {
    await Employee.deleteEmployee(req.params.id);
}

export default {
    login,
    index,
    store,
    show,
    update,
    destroy
};