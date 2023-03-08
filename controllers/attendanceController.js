import Attendance from '../models/attendanceModel.js';

const index = async(req, res) => {
    const data = await Attendance.getAllAttendances();
    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
}

const checkIn = async(req, res) => {
    const values = {
        employee_id: req.body.employee_id,
        duty_id: parseInt(req.body.duty_id),
        time_in: req.body.time_in,
        note_in: req.body.note_in,
    }
    const data = await Attendance.createAttendanceWithCheckIn(values);
    if (data) {
        console.log("success create attendance with check in");
        res.json(data);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
}

const checkOut = async(req, res) => {
    const payload = {
        employee_id: req.body.employee_id,
        time_out: req.body.time_out,
        status: req.body.status,
        note_out: req.body.note_out,
    }
    const data = await Attendance.updateAttendanceWithCheckOut(payload);
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
}

const checkInStatus = async(req, res) => {
    const payload = {
        employee_id: req.body.employee_id,
    }
    const data = await Attendance.getAttendanceStatus(payload.employee_id);
    res.json(data);
}

const show = async(req, res) => {
    const data = await Attendance.getAttendanceById(req.params.id);
    if (data.rows.length > 0) {
        res.json(data.rows);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
}   

const showAllForSpecificDate = async(req, res) => {
    const data = await Attendance.getAllAttendancesForSpecificDate(req.params.date);
    res.json(data);
}

const showAllForSpecificEmployeePrevList = async(req, res) => {
    const payload = {
        employee_id: parseInt(req.params.employee_id)
    }
    const data = await Attendance.getAllAttendancesForSpecificEmployeeBeforeLatest(payload.employee_id);
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
}

const showAllForSpecificEmployee = async(req, res) => {
    const payload = {
        employee_id: parseInt(req.params.employee_id),
    }
    const data = await Attendance.getAllAttendancesForSpecificEmployee(payload.employee_id);
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
}

const showAllForWeekdays = async(req, res) => {
    const values = {
        week: parseInt(req.params.week),
    }
    const data = await Attendance.getAllAttendancesWeekly(values.week);
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
}

const showAllDutyNotCompletedForSpecificEmployee = async(req, res) => {
    const employeeIdParam = parseInt(req.params.employee_id);
    const data = await Attendance.getAllDutyNotCompletedForSpecificEmployee(employeeIdParam);
    return res.json(data);
}

const showAllDutyNotCompletedForSpecificJob = async(req, res) => {
    const jobIdParam = parseInt(req.params.job_id);
    const data = await Attendance.getAllDutyNotCompletedForJobId(jobIdParam);
    return res.json(data);
}

const checkIfDutyAssignedToday = async(req, res) => {
    const values = {
        duty_id: parseInt(req.params.duty_id)
    }
    const data = await Attendance.checkIfDutyAssignedToday(values.duty_id);
    res.send(data);
}

export default {
    index,
    checkIn,
    checkOut,
    checkInStatus,
    show,
    showAllForSpecificDate,
    showAllForSpecificEmployeePrevList,
    showAllForSpecificEmployee,
    showAllForWeekdays,
    showAllDutyNotCompletedForSpecificEmployee,
    showAllDutyNotCompletedForSpecificJob,
    checkIfDutyAssignedToday
};