import { PrismaClient } from '@prisma/client'
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
        data: job
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

export default {
    getJobById,
    getJobByName,
    getAllJobs,
    storeJob,
    updateJob,
    deleteJob,
};