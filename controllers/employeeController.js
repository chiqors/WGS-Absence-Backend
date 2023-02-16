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
    const data = await Employee.getAllEmployees();
    if (data.rows.length > 0) {
        res.json(data.rows);
    } else {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog('Employee List Empty', fullUrl, 'GET', 404);
        res.status(404).json({ message: 'Data is Empty' });
    }
};

const store = async(req, res) => {
    await Employee.storeEmployee(req.body);
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