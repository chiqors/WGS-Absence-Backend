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
        `SELECT employees.*, jobs.title AS job_title FROM employees JOIN jobs ON employees.job_id = jobs.id ORDER BY employees.id DESC LIMIT $1 OFFSET $2`,
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
        `INSERT INTO employees (full_name, gender, phone, address, birthdate, photo_url, username, password, email, job_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [employee.full_name, employee.gender, employee.phone, employee.address, employee.birthdate, employee.photo_url, employee.username, employee.password, employee.email, employee.job_id]
    )
}

const updateEmployee = async (employee) => {
    // update query based on available data
    let query = `UPDATE employees SET `
    let params = []
    Array.from(Object.keys(employee)).forEach((key, index) => {
        if (employee[key] !== undefined) {
            query += `${key} = $${index + 1}, `
            params.push(employee[key])
        }
    })
    query = query.slice(0, -2) + ` WHERE id = $${params.length + 1} RETURNING id`
    params.push(employee.id)
    return await db.query(
        query,
        params
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