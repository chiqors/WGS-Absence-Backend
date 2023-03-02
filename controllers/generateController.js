import {generateInsertEmployeeQuery,generateInsertJobQuery,generateInsertDutyQuery,generateInsertAttendanceQuery,generateInsertAdminQuery} from '../models/generateModel.js';

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

const generateAll = async(req, res) => {
    await generateInsertJobQuery();
    await generateInsertEmployeeQuery(20);
    await generateInsertDutyQuery();
    await generateInsertAttendanceQuery(20);
    console.log('Generate all success');
    res.send('Generate all success');
}

const generateAdmin = async(req, res) => {
    generateInsertAdminQuery();
    console.log('Generate admin success');
    res.send('Generate admin success');
}

export default {
    generateEmployees,
    generateJobs,
    generateDuties,
    generateAttendances,
    generateAll,
    generateAdmin
}