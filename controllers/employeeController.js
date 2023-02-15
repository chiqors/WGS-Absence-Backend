import Employee from '../models/employeeModel.js';

const index = async(req, res) => {
    const data = await Employee.getAllEmployees();
    if (data.rows.length > 0) {
        res.json(data.rows);
    } else {
        res.status(404).json({ message: 'Data not found' });
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
    index,
    store,
    show,
    update,
    destroy
};