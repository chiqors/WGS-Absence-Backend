import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import helper from '../handler/helper.js';
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';
import logger from '../utils/logger.js';

const prisma = new PrismaClient()
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
faker.locale = 'id_ID'; 
dayjs.locale('id');
dayjs.extend(utc);
dayjs.extend(timezone);

export const generateInsertEmployeeQuery = async(num) => {
    // generate fake 
    const jobIds = await prisma.job.findMany({
        select: {
            id: true
        }
    })
    Array.from({ length: num }).forEach(async() => {
        const birthdate = dayjs(faker.date.birthdate({
            min: 20,
            max: 25,
            mode: 'age'
        })).toISOString()
        const joined_at = dayjs(faker.date.between(
            '2020-01-01T00:00:00.000Z', '2023-02-25T00:00:00.000Z'
        )).toISOString()
        const password = faker.internet.password();
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        await prisma.employee.create({
            data: {
                job: {
                    connect: {
                        id: jobIds[Math.floor(Math.random() * jobIds.length)].id
                    }
                },
                full_name: faker.name.fullName(),
                gender: faker.name.sex(),
                phone: faker.phone.number('08##########'),
                address: faker.address.streetAddress(true),
                birthdate: birthdate,
                joined_at: joined_at,
                photo_url: faker.image.avatar(),
                account: {
                    create: {
                        email: faker.internet.email(),
                        username: faker.internet.userName(),
                        password: hashedPassword,
                        role: 'employee'
                    }
                }
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })
    });
}

export const generateInsertJobQuery = async() => {
    // generate fake data
    const jobs = [
        {
            name: 'Frontend Web Developer',
            description: 'Membuat tampilan website'
        },
        {
            name: 'Backend Web Developer',
            description: 'Membuat backend website'
        },
        {
            name: 'Fullstack Web Developer',
            description: 'Membuat tampilan dan backend website'
        },
        {
            name: 'Mobile Developer',
            description: 'Membuat aplikasi mobile'
        },
        {
            name: 'UI/UX Designer',
            description: 'Membuat tampilan website'
        },
        {
            name: 'Graphic Designer',
            description: 'Membuat aset grafik untuk project'
        },
        {
            name: 'Content Writer',
            description: 'Membuat konten untuk project'
        },
        {
            name: 'Project Manager',
            description: 'Mengatur project'
        },
        {
            name: 'System Analyst',
            description: 'Menganalisa sistem'
        },
        {
            name: 'IT Support',
            description: 'Mendukung sistem'
        },
        {
            name: 'IT Security',
            description: 'Mengamankan sistem'
        },
        {
            name: 'HRD Manager',
            description: 'Mengatur sumber daya manusia'
        },
    ]
    jobs.forEach(async(job) => {
        await prisma.job.create({
            data: {
                name: job.name,
                description: job.description,
                created_at: dayjs().toISOString(),
                updated_at: dayjs().toISOString()
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })
    });
}

export const generateInsertDutyQuery = async() => {
    // generate fake data
    // duration_type = full_time, business_trip
    // status = not_assigned, assigned, need_discussion, completed
    const jobs = await prisma.job.findMany({
        select: {
            id: true
        }
    })

    const duties = [
        {
            job_id: helper.randomIntFromInterval(0, jobs.length - 1),
            name: 'Desain UI Project A',
            description: 'Deskripsi project A',
            duration_type: 'full_time',
            status: 'not_assigned'
        },
        {
            job_id: helper.randomIntFromInterval(0, jobs.length - 1),
            name: 'Buat Backend Project A',
            description: 'Deskripsi project A',
            duration_type: 'full_time',
            status: 'not_assigned'
        },
        {
            job_id: helper.randomIntFromInterval(0, jobs.length - 1),
            name: 'Buat Frontend Project A',
            description: 'Deskripsi project A',
            duration_type: 'full_time',
            status: 'not_assigned'
        },
        {
            job_id: helper.randomIntFromInterval(0, jobs.length - 1),
            name: 'Buat Backend Project B',
            description: 'Deskripsi project B',
            duration_type: 'full_time',
            status: 'not_assigned'
        },
        {
            job_id: helper.randomIntFromInterval(0, jobs.length - 1),
            name: 'Buat Frontend Project B',
            description: 'Deskripsi project B',
            duration_type: 'full_time',
            status: 'not_assigned'
        },
        {
            job_id: helper.randomIntFromInterval(0, jobs.length - 1),
            name: 'Buat Backend Project C',
            description: 'Deskripsi project C',
            duration_type: 'full_time',
            status: 'not_assigned'
        }
    ]
    duties.forEach(async(duty) => {
        await prisma.duty.create({
            data: {
                name: duty.name,
                description: duty.description,
                duration_type: duty.duration_type,
                status: duty.status,
                created_at: dayjs().toISOString(),
                updated_at: dayjs().toISOString(),
                job: {
                    connect: {
                        id: jobs[duty.job_id].id
                    }
                }
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })
    });
}

export const generateInsertAttendanceQuery = async(num) => {
    // generate fake data
    const employeeIds = await prisma.employee.findMany({
        select: {
            id: true,
            job_id: true
        }
    })
    const dutyIds = await prisma.duty.findMany({
        select: {
            id: true,
            job_id: true
        }
    })
    Array.from({ length: num }).forEach(async() => {
        // set date between 27 Feb 2023 and 3 Mar 2023 with gmt+7 timezone
        // set intial time to 00:00:00
        // const date = dayjs(helper.randomDate(new Date(2023, 1, 27), new Date(2023, 2, 3))).tz('Asia/Bangkok').set('hour', 0).set('minute', 0).set('second', 0).toISOString()
        const date = dayjs().set('hour', 0).set('minute', 0).set('second', 0).tz('Asia/Bangkok').toISOString()
        const time_in = dayjs(date).add(helper.randomIntFromInterval(8, 9), 'hour').add(helper.randomIntFromInterval(0, 59), 'minute').add(helper.randomIntFromInterval(0, 59), 'second').toISOString()
        const time_out = dayjs(date).add(helper.randomIntFromInterval(17, 18), 'hour').add(helper.randomIntFromInterval(0, 59), 'minute').add(helper.randomIntFromInterval(0, 59), 'second').toISOString()
        const empId_selected = employeeIds[helper.randomIntFromInterval(0, employeeIds.length - 1)].id
        // check if attendance already exist for that employee on that date
        if (await prisma.attendance.findFirst({
            where: {
                employee_id: empId_selected,
                time_in: {
                    gte: dayjs(date).startOf('day').toISOString(),
                    lte: dayjs(date).endOf('day').toISOString()
                }
            }
        })) {
            return
        }
        // create attendance based on employee job
        const job_id_emp = employeeIds.find(emp => emp.id === empId_selected).job_id
        const duty_id = dutyIds.find(duty => duty.job_id === job_id_emp)
        if (!duty_id) {
            return
        }
        await prisma.attendance.create({
            data: {
                time_in: time_in,
                time_out: time_out,
                employee: {
                    connect: {
                        id: empId_selected
                    }
                },
                duty: {
                    connect: {
                        id: duty_id.id
                    }
                },
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })
        // update duty status to assigned once attendance created
        await prisma.duty.update({
            where: {
                id: duty_id.id
            },
            data: {
                status: 'assigned'
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })
    });
}

export const generateInsertAttendanceQueryV2 = async() => {
    // generate fake data
    const employeeIds = await prisma.employee.findMany({
        where: {
            status: 'active'
        },
        select: {
            id: true,
            job_id: true
        }
    })
    // set attendance date today
    // set intial time to 00:00:00
    const date = dayjs().set('hour', 0).set('minute', 0).set('second', 0).tz('Asia/Bangkok').toISOString()
    // fill any missing attendance for today
    employeeIds.forEach(async(emp) => {
        // rules:
        // 1. if employee has no attendance on that date, create attendance based on employee job for duty
        // 2. Only one employee can be assigned to one duty with status not_assigned
        // 3. if duty status is assigned, skip
        // 4. if duty status is not_assigned, check if attendance already exist for that employee on that date
        // 5. if attendance already exist, skip
        
        // check if attendance already exist for that employee on that date
        if (await prisma.attendance.findFirst({
            where: {
                employee_id: emp.id,
                time_in: {
                    gte: dayjs(date).startOf('day').toISOString(),
                    lte: dayjs(date).endOf('day').toISOString()
                }
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })) {
            return
        }

        // check if duty status is assigned
        const duty = await prisma.duty.findFirst({
            where: {
                job_id: emp.job_id,
                status: 'not_assigned'
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })
        if (!duty) {
            return
        }

        // create attendance based on employee job
        const time_in = dayjs(date).add(helper.randomIntFromInterval(8, 9), 'hour').add(helper.randomIntFromInterval(0, 59), 'minute').add(helper.randomIntFromInterval(0, 59), 'second').toISOString()
        const time_out = dayjs(date).add(helper.randomIntFromInterval(17, 18), 'hour').add(helper.randomIntFromInterval(0, 59), 'minute').add(helper.randomIntFromInterval(0, 59), 'second').toISOString()
        await prisma.attendance.create({
            data: {
                time_in: time_in,
                time_out: time_out,
                employee: {
                    connect: {
                        id: emp.id
                    }
                },
                duty: {
                    connect: {
                        id: duty.id
                    }
                },
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })

        // update duty status to assigned once attendance created
        await prisma.duty.update({
            where: {
                id: duty.id
            },
            data: {
                status: 'assigned'
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })
    });
}

export const generateInsertAdminQuery = async() => {
    let jobId = null;
    const findAndGetHrdJob = await prisma.job.findFirst({
        where: {
            name: 'HRD Manager'
        },
        select: {
            id: true
        }
    })
    if (findAndGetHrdJob) {
        jobId = findAndGetHrdJob.id
    }
    const password = 'admin123';
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const admin = {
        job_id: jobId,
        full_name: 'Risa Yunita',
        gender: 'female',
        phone: '081234567890',
        address: 'Jl. Raya Cibubur No. 1',
        birthdate: dayjs('1999-01-01').toISOString(),
        joined_at: dayjs('2020-01-01').toISOString(),
        photo_url: 'https://cdn.discordapp.com/attachments/1023968763432943650/1080692752439844874/hr_1.png',
        account: {
            email: 'fathoniplay@gmail.com',
            username: 'admin',
            password: hashedPassword,
            role: 'admin',
            verified: 'verified'
        }
    }
    await prisma.employee.create({
        data: {
            job: {
                connect: {
                    id: admin.job_id
                }
            },
            full_name: admin.full_name,
            gender: admin.gender,
            phone: admin.phone,
            address: admin.address,
            birthdate: admin.birthdate,
            joined_at: admin.joined_at,
            photo_url: admin.photo_url,
            account: {
                create: {
                    email: admin.account.email,
                    username: admin.account.username,
                    password: admin.account.password,
                    role: admin.account.role,
                    verified: admin.account.verified,
                }
            }
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
}

// const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
// logger.saveErrorLog('Employee not found', fullUrl, 'GET', 404);
// res.status(404).json({ message: 'Data not found' });
export const generateInsertErrorLogQuery = async() => {
    // generate fake error log
    // [2023-03-16 15:46:23] | [ERROR] | true | Error: not found Line 1:49 .value undefined | BACKEND | /api/v1/employee/1 | http://localhost:3000 | GET | 404
    const errorLogs = [
        {
            level: 'ERROR',
            isStackTrace: true,
            message: 'at line 1:49\n .value undefined',
            server: 'BACKEND',
            urlPath: '/api/v1/employee/1',
            lastHost: 'http://localhost:3000',
            method: 'GET',
            status: 404
        },
        {
            level: 'ERROR',
            isStackTrace: false,
            message: 'Employee ID not found',
            server: 'BACKEND',
            urlPath: '/api/v1/employee/1',
            lastHost: 'http://localhost:3000',
            method: 'GET',
            status: 404
        },
        {
            level: 'ERROR',
            isStackTrace: false,
            message: 'Employee ID not found',
            server: 'BACKEND',
            urlPath: '/api/v1/employee/1',
            lastHost: 'http://localhost:3000',
            method: 'GET',
            status: 404
        },
        {
            level: 'ERROR',
            isStackTrace: true,
            message: 'at line 1:49\n .value undefined',
            server: 'BACKEND',
            urlPath: '/api/v1/employee/1',
            lastHost: 'http://localhost:3000',
            method: 'GET',
            status: 404
        },
        {
            level: 'ERROR',
            isStackTrace: false,
            message: 'Employee ID not found',
            server: 'BACKEND',
            urlPath: '/api/v1/employee/1',
            lastHost: 'http://localhost:3000',
            method: 'GET',
            status: 404
        },
        {
            level: 'ERROR',
            isStackTrace: false,
            message: 'Employee ID not found',
            server: 'BACKEND',
            urlPath: '/api/v1/employee/1',
            lastHost: 'http://localhost:3000',
            method: 'GET',
            status: 404
        },
    ]
    // write and save to error log file
    errorLogs.forEach((errorLog) => {
        logger.saveErrorLog(errorLog)
    })
}

export const generateInsertAccessLogQuery = async() => {
    // [2023-03-16 15:46:23] | [ACC] | List Employee With Pagination | BACKEND | /api/v1/employee/1 | http://localhost:3000 | GET | 201
    const accessLogs = [
        {
            level: 'ACC',
            message: 'List Employee With Pagination',
            server: 'BACKEND',
            urlPath: '/api/v1/employee/1',
            lastHost: 'http://localhost:3000',
            method: 'GET',
            status: 201
        },
        {
            level: 'ACC',
            message: 'List Employee With Pagination',
            server: 'BACKEND',
            urlPath: '/api/v1/employee/1',
            lastHost: 'http://localhost:3000',
            method: 'GET',
            status: 201
        },
        {
            level: 'ACC',
            message: 'List Employee With Pagination',
            server: 'BACKEND',
            urlPath: '/api/v1/employee/1',
            lastHost: 'http://localhost:3000',
            method: 'GET',
            status: 201
        },
        {
            level: 'ACC',
            message: 'List Employee With Pagination',
            server: 'BACKEND',
            urlPath: '/api/v1/employee/1',
            lastHost: 'http://localhost:3000',
            method: 'GET',
            status: 201
        },
        {
            level: 'ACC',
            message: 'List Employee With Pagination',
            server: 'BACKEND',
            urlPath: '/api/v1/employee/1',
            lastHost: 'http://localhost:3000',
            method: 'GET',
            status: 201
        },
        {
            level: 'ACC',
            message: 'List Employee With Pagination',
            server: 'BACKEND',
            urlPath: '/api/v1/employee/1',
            lastHost: 'http://localhost:3000',
            method: 'GET',
            status: 201
        }
    ]
    // write and save to access log file
    accessLogs.forEach((accessLog) => {
        logger.saveLog(accessLog)
    })
}