import {
    generateInsertEmployeeQuery,
    generateInsertJobQuery,
    generateInsertDutyQuery,
    generateInsertAttendanceQuery,
    generateInsertAdminQuery,
    generateInsertAttendanceQueryV2,
    generateInsertErrorLogQuery,
    generateInsertAccessLogQuery
} from '../models/generateModel.js';

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

const generateAttendancesV2 = async(req, res) => {
    generateInsertAttendanceQueryV2();
    console.log('Generate attendances for today success');
    res.send('Generate attendances success');
}

const generateAccessLog = async(req, res) => {
    generateInsertAccessLogQuery();
    console.log('Generate access log success');
    res.send('Generate access log success');
}

const generateErrorLog = async(req, res) => {
    generateInsertErrorLogQuery();
    console.log('Generate error log success');
    res.send('Generate error log success');
}

export default {
    generateEmployees,
    generateJobs,
    generateDuties,
    generateAttendances,
    generateAll,
    generateAdmin,
    generateAttendancesV2,
    generateAccessLog,
    generateErrorLog
}