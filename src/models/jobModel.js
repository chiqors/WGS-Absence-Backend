import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
const prisma = new PrismaClient()

const getJobById = async (id) => {
    const job = await prisma.job.findUnique({
        where: {
            id: id
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return job
}

const getJobByName = async (name) => {
    const job = await prisma.job.findFirst({
        where: {
            name: name
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return job
}

const getAllJobs = async () => {
    const jobs = await prisma.job.findMany({
        orderBy: {
            id: 'desc'
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return jobs
}

const storeJob = async (job) => {
    const newJob = await prisma.job.create({
        data: job
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return newJob
}

const updateJob = async (job) => {
    const updateJob = await prisma.job.update({
        where: {
            id: job.id
        },
        data: {
            name: job.name,
            description: job.description,
            updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return updateJob
}

const deleteJob = async (id) => {
    const deleteJob = await prisma.job.delete({
        where: {
            id: id
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return deleteJob
}

const getAllJobsPaginated = async (page, limit) => {
    const total_data = await prisma.job.count();
    const total_page = Math.ceil(total_data / limit);
    const current_page = page;
    const data = await prisma.job.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
            id: 'desc'
        },
        select: {
            id: true,
            name: true,
            description: true,
            created_at: true,
            employee: {
                where: {
                    status: 'active'
                },
                select: {
                    id: true,
                }
            },
            duty: {
                where: {
                    status: {
                        not: 'completed'
                    }
                },
                select: {
                    id: true,
                }
            }
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })

    return {
        total_data,
        total_page,
        current_page,
        data
    }
}

const getDutyAttendanceEmployee = async (id) => {
    // get all duty attendance by job id with employee who is the last has assigned the duty
    const dutyAttendance = await prisma.duty.findMany({
        where: {
            job_id: id
        },
        select: {
            id: true,
            name: true,
            description: true,
            created_at: true,
            updated_at: true,
            status: true,
            attendance: {
                orderBy: {
                    id: 'desc'
                },
                select: {
                    id: true,
                    employee: {
                        select: {
                            full_name: true,
                        }
                    }
                },
                take: 1
            }
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return dutyAttendance
}

export default {
    getJobById,
    getJobByName,
    getAllJobs,
    storeJob,
    updateJob,
    deleteJob,
    getAllJobsPaginated,
    getDutyAttendanceEmployee
};