import db from '../utils/db.js';

const getAttendanceById = async(id) => {
    return await db.query(
        `SELECT * FROM attendances WHERE id = $1`,
        [id]
    );
}

const getAllAttendancesForSpecificDate = async(date) => {
    return await db.query(
        `SELECT * FROM attendances WHERE date = $1`,
        [date]
    );
}

const getAllAttendancesForSpecificEmployee = async(employee_id) => {
    return await db.query(
        `SELECT * FROM attendances WHERE employee_id = $1`,
        [employee_id]
    );
}

const getAllAttendances = async() => {
    return await db.query(
        `SELECT * FROM attendances`
    );
}

const storeAttendance = async(attendance) => {
    return await db.query(
        `INSERT INTO attendances (employee_id, duty_id, time_in, time_out, date) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [attendance.employee_id, attendance.duty_id, attendance.time_in, attendance.time_out, attendance.date]
    )
}

const updateAttendance = async(attendance) => {
    return await db.query(
        `UPDATE attendances SET employee_id = $1, duty_id = $2, time_in = $3, time_out = $4, date = $5 WHERE id = $6`,
        [attendance.employee_id, attendance.duty_id, attendance.time_in, attendance.time_out, attendance.date, attendance.id]
    )
}

const updateAttendanceTimeOut = async(attendance) => {
    return await db.query(
        `UPDATE attendances SET time_out = $1 WHERE id = $2`,
        [attendance.time_out, attendance.id]
    )
}

const deleteAttendance = async(id) => {
    return await db.query(
        `DELETE FROM attendances WHERE id = $1`,
        [id]
    )
}

export default {
    getAttendanceById,
    getAllAttendancesForSpecificDate,
    getAllAttendancesForSpecificEmployee,
    getAllAttendances,
    storeAttendance,
    updateAttendance,
    updateAttendanceTimeOut,
    deleteAttendance,
};