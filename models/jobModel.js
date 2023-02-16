import db from '../utils/db.js';

const getJobById = async (id) => {
    return await db.query(
        `SELECT * FROM jobs WHERE id = $1`,
        [id]
    );
}

const getJobByName = async (name) => {
    return await db.query(
        `SELECT * FROM jobs WHERE name = $1`,
        [name]
    );
}

const getAllJobs = async () => {
    return await db.query(
        `SELECT * FROM jobs`
    );
}

const storeJob = async (job) => {
    return await db.query(
        `INSERT INTO jobs (name) VALUES ($1) RETURNING id`,
        [job.name]
    )
}

const updateJob = async (job) => {
    return await db.query(
        `UPDATE jobs SET name = '${job.name}' WHERE id = ${job.id}`
    );
}

const deleteJob = async (id) => {
    return await db.query(
        `DELETE FROM jobs WHERE id = $1`,
        [id]
    );
}

export default {
    getJobById,
    getJobByName,
    getAllJobs,
    storeJob,
    updateJob,
    deleteJob,
};