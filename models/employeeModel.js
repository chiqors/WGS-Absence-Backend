import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient()

const getEmployeeById = async (id) => {
    const employee = await prisma.employee.findUnique({
        where: {
            id: id
        },
        include: {
            account: true,
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
            },
            contract: {
                where: {
                    // show only active contract
                    status: true
                },
                include: {
                    job: true
                }
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
        select: {
            id: true,
            employee: {
                select: {
                    id: true
                }
            },
            role: true
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    const payload = {
        id: account.id,
        employee_id: account.employee.id,
        role: account.role
    };
    const tokenJwt = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return tokenJwt;
}

const checkGoogleOauth = async (data) => {
    const oauthAccount = await prisma.oAuthAccount.findFirst({
        where: {
            email: data.email,
            provider: 'google'
        },
        select: {
            id: true,
            employee: {
                select: {
                    id: true,
                    account: {
                        select: {
                            role: true
                        }
                    }
                }
            }
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    // check if oauth account is valid
    if (oauthAccount) {
        // generate new token
        const payload = {
            id: oauthAccount.id,
            employee_id: oauthAccount.employee.id,
            role: oauthAccount.employee.account.role
        };
        const tokenJwt = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        await prisma.oAuthAccount.update({
            where: {
                id: oauthAccount.id
            },
            data: {
                token: tokenJwt
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })
        return tokenJwt
    }
}

const checkAuthJwt = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const account = await prisma.account.findUnique({
            where: {
                id: decoded.id
            },
            include: {
                employee: true
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })
        return account
    } catch (err) {
        return 'token expired / invalid'
    }
}

const verifyEmail = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const account = await prisma.account.findUnique({
            where: {
                id: decoded.id
            },
            include: {
                employee: true
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })
        if (account) {
            await prisma.account.update({
                where: {
                    id: account.id
                },
                data: {
                    token: null,
                    verified: true
                }
            }).finally(async () => {
                await prisma.$disconnect()
            })
            return 'email verified'
        }
    } catch (err) {
        return 'token expired / invalid'
    }
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
            contract: {
                select: {
                    job: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    start_date: true,
                    end_date: true,
                },
                where: {
                    // contract must be active
                    status: true
                },
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
    const createdRecord = await prisma.employee.create({
        data: {
            full_name: employee.full_name,
            gender: employee.gender,
            phone: employee.phone,
            address: employee.address,
            birthdate: employee.birthdate,
            joined_at: dayjs().toDate(),
            photo_url: employee.photo_url,
            contract: {
                create: {
                    start_date: employee.contract.start_date,
                    end_date: employee.contract.end_date,
                    status: employee.contract.status,
                    job: {
                        connect: {
                            id: employee.contract.job_id
                        }
                    }
                }
            },
            account: {
                create: {
                    email: employee.email,
                    username: employee.username,
                    password: employee.password
                }
            },
        },
        select: {
            account: {
                select: {
                    id: true,
                    role: true
                }
            },
            id: true,
        }   
    }).finally(async () => {
        await prisma.$disconnect()
    })
    const payload = {
        id: createdRecord.account.id,
        employee_id: createdRecord.id,
        role: createdRecord.account.role
    };
    const tokenJwt = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    await prisma.account.update({
        where: {
            id: createdRecord.account.id
        },
        data: {
            token: tokenJwt
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return tokenJwt;
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
            joined_at: employee.joined_at || undefined,
            account: {
                update: {
                    email: employee.email || undefined,
                    username: employee.username,
                    password: employee.password || undefined
                }
            },
            contract: {
                update: {
                    start_date: employee.contract.start_date || undefined,
                    end_date: employee.contract.end_date || undefined,
                    status: employee.contract.status || undefined,
                    job: {
                        connect: {
                            id: employee.contract.job_id || undefined
                        }
                    }
                }
            }
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
}

const resignEmployee = async (id) => {
    return await prisma.employee.update({
        where: {
            id: id
        },
        data: {
            account: {
                update: {
                    token: null,
                    verified: false,
                    status: false
                }
            },
            contract: {
                update: {
                    status: false
                },
                where: {
                    status: true
                }
            }
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
}

export default {
    getEmployeeById,
    getEmployeeByName,
    checkAuth,
    checkGoogleOauth,
    checkAuthJwt,
    verifyEmail,
    getAllEmployees,
    getAllEmployeesWithLimitOffsetAndRelationWithJobs,
    countAllEmployees,
    storeEmployee,
    updateEmployee,
    resignEmployee
};