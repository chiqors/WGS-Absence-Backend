import db from '../utils/db.js';

const getEmployeeById = async (id) => {
    return await db.query(
        `SELECT * FROM employees WHERE id = $1`,
        [id]
    );
}

const getEmployeeByName = async (name) => {
    return await db.query(
        `SELECT * FROM employees WHERE full_name LIKE $1`,
        [name]
    );
}

const checkAuth = async (username, password) => {
    return await db.query(
        `SELECT * FROM employees WHERE username = $1 AND password = $2`,
        [username, password]
    );
}

const getAllEmployees = async () => {
    return await db.query(
        `SELECT * FROM employees`
    );
}

const getAllEmployeesWithLimitAndOffset = async (limit, offset) => {
    return await db.query(
        `SELECT * FROM employees LIMIT $1 OFFSET $2`,
        [limit, offset]
    );
}

const getAllEmployeesWithLimitOffsetAndRelationWithJobs = async (limit, offset) => {
    return await db.query(
        `SELECT employees.*, jobs.title AS job_title FROM employees JOIN jobs ON employees.job_id = jobs.id LIMIT $1 OFFSET $2`,
        [limit, offset]
    );
}

const countAllEmployees = async () => {
    const data = await db.query(
        `SELECT COUNT(*) as total FROM employees`
    );
    const number = parseInt(data.rows[0].total);
    return number;
}

const storeEmployee = async (employee) => {
    return await db.query(
        `INSERT INTO employees (full_name, gender, phone, address, birthdate, photo_url, username, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [employee.full_name, employee.gender, employee.phone, employee.address, employee.birthdate, employee.photo_url, employee.username, employee.password]
    )
}

const updateEmployee = async (employee) => {
    return await db.query(
        `UPDATE employees SET full_name = '${employee.full_name}', gender = '${employee.gender}', phone = '${employee.phone}', address = '${employee.address}', birthdate = '${employee.birthdate}', photo_url = '${employee.photo_url}', username = '${employee.username}', password = '${employee.password}' WHERE id = ${employee.id}`
    );
}

const deleteEmployee = async (id) => {
    return await db.query(
        `DELETE FROM employees WHERE id = $1`,
        [id]
    );
}

export default {
    getEmployeeById,
    getEmployeeByName,
    checkAuth,
    getAllEmployees,
    getAllEmployeesWithLimitAndOffset,
    getAllEmployeesWithLimitOffsetAndRelationWithJobs,
    countAllEmployees,
    storeEmployee,
    updateEmployee,
    deleteEmployee,
};