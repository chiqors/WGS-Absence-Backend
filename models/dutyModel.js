import db from '../utils/db.js';

const getDutyById = async(id) => {
    const data = await db.query('SELECT * FROM duties WHERE id = $1', [id]);
    return data;
}

const getDutyByName = async(name) => {
    const data = await db.query('SELECT * FROM duties WHERE task_name LIKE $1', [name]);
    return data;
}

const getAllDuties = async() => {
    const data = await db.query('SELECT * FROM duties');
    return data;
}

const storeDuty = async(duty) => {
    const data = await db.query('INSERT INTO duties (job_id, task_name, duration_type) VALUES ($1, $2, $3) RETURNING id', [duty.job_id, duty.task_name, duty.duration_type]);
    return data;
}

const updateDuty = async(duty) => {
    const data = await db.query('UPDATE duties SET job_id = $1, task_name = $2, duration_type = $3 WHERE id = $4', [duty.job_id, duty.task_name, duty.duration_type, duty.id]);
    return data;
}

const deleteDuty = async(id) => {
    const data = await db.query('DELETE FROM duties WHERE id = $1', [id]);
    return data;
}

export default {
    getDutyById,
    getDutyByName,
    getAllDuties,
    storeDuty,
    updateDuty,
    deleteDuty,
};