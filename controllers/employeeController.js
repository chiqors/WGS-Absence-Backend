import { validationResult } from 'express-validator';
import Employee from '../models/employeeModel.js';
import logger from '../utils/logger.js';
import fs from 'fs';

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
        return res.status(500).json({ message: 'Internal Server Error' });
    });
    return res.status(201).json({ message: 'submitted' });
}

const show = async(req, res) => {
    const data = await Employee.getEmployeeById(req.params.id);
    if (data.rows.length > 0) {
        res.json(data.rows[0]);
    } else {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog('Employee not found', fullUrl, 'GET', 404);
        res.status(404).json({ message: 'Data not found' });
    }
}

const update = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog('Validation Error', fullUrl, 'PUT', 422);
        return res.status(422).json({ errors: errors.array() });
    }
    const old_data = await Employee.getEmployeeById(req.params.id);
    if (req.file) {
        if (req.body.username !== old_data.rows[0].username) {
            // delete old avatar and folder
            if (fs.existsSync(`public/uploads/${old_data.rows[0].username}`)) {
                fs.rm(`public/uploads/${old_data.rows[0].username}`, { recursive: true });
                console.log('avatar and user folder has been deleted')
            }
        }
        const fullPublicUrl = `${process.env.UPLOAD_FOLDER || '/uploads'}/${req.body.username}/${req.file.filename}`
        req.body.photo_url = fullPublicUrl
    }
    await Employee.updateEmployee(req.body).catch((err) => {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog(err, fullUrl, 'POST', 500);
        return res.status(500).json({ message: 'Internal Server Error' });
    });
    return res.status(201).json({ message: 'updated' });
}

const destroy = async(req, res) => {
    const paramsId = req.params.id;
    const data = await Employee.getEmployeeById(paramsId);
    if (data.rows.length > 0) {
        const username = data.rows[0].username;
        if (fs.existsSync(`public/uploads/${username}`)) {
            fs.rm(`public/uploads/${username}`, { recursive: true });
            console.log('avatar and user folder has been deleted')
        }
        await Employee.deleteEmployee(paramsId).catch((err) => {
            const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
            logger.saveErrorLog(err, fullUrl, 'DELETE', 500);
            res.status(500).json({ message: 'Internal Server Error' });
        });
        return res.status(201).json({ message: 'deleted' });
    } else {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog('Employee not found', fullUrl, 'DELETE', 404);
        res.status(404).json({ message: 'Data not found' });
    }
}

export default {
    login,
    index,
    store,
    show,
    update,
    destroy
};