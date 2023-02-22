import db from '../utils/db.js';
import { faker } from '@faker-js/faker';
import moment from 'moment';
import helper from '../handler/helper.js';
faker.locale = 'id_ID'; 
moment.locale('id');

const createRandomUser = async() => {
    return Promise.resolve({
        username: faker.internet.userName(),
        password: faker.internet.password(8, true),
        full_name: faker.name.fullName(),
        gender: faker.name.sex(),
        phone: faker.phone.number('08##########'),
        address: faker.address.streetAddress(true),
        photo_url: faker.image.avatar(),
        birthdate: moment(faker.date.birthdate({
            min: 20,
            max: 25,
            mode: 'age'
        })).format('YYYY-MM-DD'),
        email: faker.internet.email(),
        job_id: helper.randomIntFromInterval(1, 5)
    });
}

const saveDetailEmployee = async(detail) => {
    return await db.query(
        `INSERT INTO employees (full_name, gender, phone, address, birthdate, photo_url, username, password, email, job_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [detail.full_name, detail.gender, detail.phone, detail.address, detail.birthdate, detail.photo_url, detail.username, detail.password, detail.email, detail.job_id]
    );
}

const generateInsertEmployeeQuery = (num) => {
    // generate fake data
    Array.from({ length: num }).forEach(async() => {
        const detail = await createRandomUser();
        await saveDetailEmployee(detail);
    });
}

export default generateInsertEmployeeQuery;