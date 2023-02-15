import generateInsertEmployeeQuery from '../models/generateModel.js';

const generateEmployees = async(req, res) => {
    generateInsertEmployeeQuery(20);
    res.send('Generate employees success');
}

export default {
    generateEmployees,
}