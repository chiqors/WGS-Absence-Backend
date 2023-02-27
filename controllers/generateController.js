import {generateInsertEmployeeQuery,generateInsertJobQuery,generateInsertDutyQuery,generateInsertAttendanceQuery} from '../models/generateModel.js';

const generateEmployees = async(req, res) => {
    generateInsertEmployeeQuery(20);
    res.send('Generate employees success');
}

const generateJobs = async(req, res) => {
    generateInsertJobQuery();
    res.send('Generate jobs success');
}

const generateDuties = async(req, res) => {
    generateInsertDutyQuery();
    res.send('Generate duties success');
}

const generateAttendances = async(req, res) => {
    generateInsertAttendanceQuery(20);
    res.send('Generate attendances success');
}

export default {
    generateEmployees,
    generateJobs,
    generateDuties,
    generateAttendances
}