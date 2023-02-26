import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
const prisma = new PrismaClient()

const getEmployeeById = async (id) => {
    const employee = await prisma.employee.findUnique({
        where: {
            id: id
        },
        include: {
            account: true,
            job: true,
            attendance: {
                where: {
                    // list 5 last attendance
                    time_in: {
                        gte: dayjs().subtract(5, 'day').toDate(),
                        lte: dayjs().endOf('day').toDate()
                    },
                },
                orderBy: {
                    time_in: 'desc'
                },
                take: 5
            }
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return employee
}

const getEmployeeByName = async (name) => {
    const employee = await prisma.employee.findFirst({
        where: {
            full_name: name
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return employee
}

const checkAuth = async (username, password) => {
    const account = await prisma.account.findFirst({
        where: {
            username: username,
            password: password
        },
        include: {
            employee: true
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return account;
}

const checkGoogleOauth = async (email) => {
    const account = await prisma.account.findFirst({
        where: {
            email: email
        },
        include: {
            employee: true
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return account;
}

const getAllEmployees = async () => {
    const employees = await prisma.employee.findMany({
        orderBy: {
            id: 'desc'
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return employees
}

const getAllEmployeesWithLimitAndOffset = async (limit, offset) => {
    const employees = await prisma.employee.findMany({
        orderBy: {
            id: 'desc'
        },
        take: limit,
        skip: offset
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return employees
}

const getAllEmployeesWithLimitOffsetAndRelationWithJobs = async (limit, offset) => {
    const employees = await prisma.employee.findMany({
        orderBy: {
            id: 'desc'
        },
        take: limit,
        skip: offset,
        select: {
            id: true,
            full_name: true,
            gender: true,
            phone: true,
            address: true,
            birthdate: true,
            joined_at: true,
            photo_url: true,
            account: {
                select: {
                    email: true,
                }
            },
            job: {
                select: {
                    name: true
                }
            },
            // get status from a function to see if he attended today
            attendance: {
                select: {
                    duty: true,
                },
                where: {
                    // time in must be today
                    time_in: {
                        gte: dayjs().startOf('day').toDate(),
                        lte: dayjs().endOf('day').toDate()
                    },
                }
            }
        }
    })
    return employees
}

const countAllEmployees = async () => {
    const count = await prisma.employee.count().finally(async () => {
        await prisma.$disconnect()
    })
    return count
}

const storeEmployee = async (employee) => {
    return await prisma.employee.create({
        data: {
            full_name: employee.full_name,
            gender: employee.gender,
            phone: employee.phone,
            address: employee.address,
            birthdate: employee.birthdate,
            joined_at: dayjs().toDate(),
            photo_url: employee.photo_url,
            job: {
                connect: {
                    id: employee.job_id
                }
            },
            account: {
                create: {
                    email: employee.email,
                    username: employee.username,
                    password: employee.password
                }
            }
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
}

const updateEmployee = async (employee) => {
    return await prisma.employee.update({
        where: {
            id: employee.id
        },
        data: {
            full_name: employee.full_name,
            gender: employee.gender,
            phone: employee.phone,
            address: employee.address,
            birthdate: employee.birthdate,
            photo_url: employee.photo_url,
            account: {
                update: {
                    email: employee.email || undefined,
                    username: employee.username,
                    password: employee.password || undefined
                }
            },
            job: {
                connect: {
                    id: employee.job_id
                }
            }
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
}

const deleteEmployee = async (id) => {
    // delete employee with account
    return await prisma.employee.delete({
        where: {
            id: id
        },
    }).finally(async () => {
        await prisma.$disconnect()
    })
}

export default {
    getEmployeeById,
    getEmployeeByName,
    checkAuth,
    checkGoogleOauth,
    getAllEmployees,
    getAllEmployeesWithLimitAndOffset,
    getAllEmployeesWithLimitOffsetAndRelationWithJobs,
    countAllEmployees,
    storeEmployee,
    updateEmployee,
    deleteEmployee,
};