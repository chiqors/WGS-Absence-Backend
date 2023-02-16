import Attendance from '../models/attendanceModel.js';

const index = async(req, res) => {
    const data = await Attendance.getAllAttendances();
    if (data.rows.length > 0) {
        res.json(data.rows);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
}

const store = async(req, res) => {
    await Attendance.storeAttendance(req.body);
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

const showAllForSpecificEmployee = async(req, res) => {
    const data = await Attendance.getAllAttendancesForSpecificEmployee(req.params.employee_id);
    if (data.rows.length > 0) {
        res.json(data.rows);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
}

const update = async(req, res) => {
    await Attendance.updateAttendance(req.body);
}

const destroy = async(req, res) => {
    await Attendance.deleteAttendance(req.params.id);
}

export default {
    index,
    store,
    show,
    showAllForSpecificDate,
    showAllForSpecificEmployee,
    update,
    destroy
};