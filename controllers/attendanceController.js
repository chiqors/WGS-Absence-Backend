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
    const payload = {
        employee_id: req.body.employee_id,
        duty_id: parseInt(req.body.duty_id),
        time_in: req.body.time_in,
    }
    const data = await Attendance.createAttendanceWithCheckIn(payload);
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
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
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
    if (data.rows.length > 0) {
        res.json(data.rows);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
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

export default {
    index,
    checkIn,
    checkOut,
    checkInStatus,
    show,
    showAllForSpecificDate,
    showAllForSpecificEmployeePrevList,
    showAllForSpecificEmployee,
};