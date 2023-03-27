import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const getEmployeeById = async (id) => {
    const employee = await prisma.employee.findUnique({
        where: {
            id: id
        },
        include: {
            account: true,
            oauthaccount: true,
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
    // there's a reason why i put password verification after getting the account
    // because, that's how bcrypt works
    // it's not possible to rehash the password to compare it with the hashed password from database
    // so, i have to get the account password first, then compare it
    const account = await prisma.account.findFirst({
        where: {
            username: username,
            verified: 'verified'
        },
        select: {
            id: true,
            employee: {
                select: {
                    id: true
                }
            },
            role: true,
            password: true
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    // check if account is valid
    if (account) {
        // check if password is valid
        if (await bcrypt.compare(password, account.password)) {
            // generate new token
            const payload = {
                id: account.id,
                employee_id: account.employee.id,
                role: account.role
            };
            const tokenJwt = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
            await prisma.account.update({
                where: {
                    id: account.id
                },
                data: {
                    token: tokenJwt
                }
            }).finally(async () => {
                await prisma.$disconnect()
            })
            return tokenJwt
        }
    } else {
        console.log('account not found')
        return false
    }
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
    // check if token is valid
    const isValid = jwt.verify(token, process.env.JWT_SECRET);
    if (!isValid) {
        return false
    }
    try {
        // get account by token
        const account = await prisma.account.findFirst({
            where: {
                verification_token: token
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })
        if (account) {
            // update account to verified
            await prisma.account.update({
                where: {
                    id: account.id
                },
                data: {
                    verification_token: null,
                    verified: 'verified'
                }
            }).finally(async () => {
                await prisma.$disconnect()
            })
            return true
        } else {
            return false
        }
    } catch (err) {
        return false
    }
}

const updateEmail = async (id, email) => {
    // generate new token
    const payload = {
        email: email
    };
    const tokenJwt = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    // update account
    await prisma.account.update({
        where: {
            id: id
        },
        data: {
            email: email,
            verification_token: tokenJwt,
            verified: 'not_verified'
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return tokenJwt
}

const updatePassword = async (id, password) => {
    const saltRound = parseInt(process.env.BCRYPT_SALT_ROUNDS)
    const salt = await bcrypt.genSalt(saltRound)
    const passwordHashed = await bcrypt.hash(password, salt)
    // update account
    await prisma.account.update({
        where: {
            id: id
        },
        data: {
            password: passwordHashed
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return true
}

const forgotPassword = async (email) => {
    // generate new token
    const payload = {
        email: email
    };
    const tokenJwt = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    // update account
    await prisma.account.update({
        where: {
            email: email
        },
        data: {
            verification_token: tokenJwt
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return tokenJwt
}

const resetPassword = async (token, password) => {
    // check if token is valid
    const isValid = jwt.verify(token, process.env.JWT_SECRET);
    if (!isValid) {
        return false
    }
    try {
        // get account by token
        const account = await prisma.account.findFirst({
            where: {
                verification_token: token
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })
        if (account) {
            const saltRound = parseInt(process.env.BCRYPT_SALT_ROUNDS)
            const salt = await bcrypt.genSalt(saltRound)
            const passwordHashed = await bcrypt.hash(password, salt)
            // update account
            await prisma.account.update({
                where: {
                    id: account.id
                },
                data: {
                    password: passwordHashed,
                    verification_token: null
                }
            }).finally(async () => {
                await prisma.$disconnect()
            })
            return true
        } else {
            return false
        }
    } catch (err) {
        return false
    }
}

const getAllEmployees = async () => {
    const employees = await prisma.employee.findMany({
        where: {
            status: 'active'
        },
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
        where: {
            status: 'active'
        },
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
        where: {
            status: 'active'
        },
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
    const count = await prisma.employee.count({
        where: {
            status: 'active'
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return count
}

const storeEmployee = async (employee) => {
    const saltRound = parseInt(process.env.BCRYPT_SALT_ROUNDS)
    const salt = await bcrypt.genSalt(saltRound)
    const passwordHashed = await bcrypt.hash(employee.password, salt)
    if (!employee.photo_url) {
        // set default photo
        employee.photo_url = 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/240.jpg'
    }
    const createdRecord = await prisma.employee.create({
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
                    password: passwordHashed
                }
            }
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
    // generate verification token
    const payload = {
        id: createdRecord.account.id,
    };
    const tokenJwt = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    // update account with verification token
    await prisma.account.update({
        where: {
            id: createdRecord.account.id
        },
        data: {
            verification_token: tokenJwt
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

const deactivateEmployee = async (id) => {
    return await prisma.employee.update({
        where: {
            id: id
        },
        data: {
            status: 'inactive',
            account: {
                update: {
                    status: 'inactive'
                }
            },
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
}

const googleOauthLink = async (data) => {
    return await prisma.oAuthAccount.create({
        data: {
            employee: {
                connect: {
                    id: data.employee_id
                }
            },
            provider: 'google',
            token: data.access_token,
            email: data.email,
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
}

const googleOauthUnlink = async (id) => {
    return await prisma.oAuthAccount.delete({
        where: {
            id: id
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
}

const googleOauthData = async (employee_id) => {
    // get oauth data with google provider
    const oauthData = await prisma.oAuthAccount.findFirst({
        where: {
            employee_id: employee_id,
            provider: 'google'
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return oauthData
}

const getAuthById = async (id) => {
    const auth = await prisma.account.findUnique({
        where: {
            id: id
        },
        include: {
            employee: {
                include: {
                    job: true
                }
            }
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return auth
}

const getAllJobsForSelect = async () => {
    const jobs = await prisma.job.findMany({
        select: {
            id: true,
            name: true
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return jobs
}

const findEmail = async (email) => {
    const account = await prisma.account.findUnique({
        where: {
            email: email
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return account
}

const findPhone = async (phone) => {
    const account = await prisma.employee.findUnique({
        where: {
            phone: phone
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return account
}

export default {
    getEmployeeById,
    getEmployeeByName,
    checkAuth,
    checkGoogleOauth,
    checkAuthJwt,
    verifyEmail,
    updateEmail,
    updatePassword,
    forgotPassword,
    resetPassword,
    getAllEmployees,
    getAllEmployeesWithLimitAndOffset,
    getAllEmployeesWithLimitOffsetAndRelationWithJobs,
    countAllEmployees,
    storeEmployee,
    updateEmployee,
    deactivateEmployee,
    googleOauthLink,
    googleOauthUnlink,
    googleOauthData,
    getAuthById,
    getAllJobsForSelect,
    findEmail,
    findPhone
};