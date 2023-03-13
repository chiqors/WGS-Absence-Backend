import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import dayjs from 'dayjs'

const getAllDuty = async() => {
    const data = await prisma.duty.findMany()
    return data;
}

const getAllDutyNotAssignedWithJobId = async(job_id) => {
    const data = await prisma.duty.findMany({
        where: {
            job_id: job_id,
            status: 'not_assigned'
        }
    })
    return data;
}

const getDutyById = async(id) => {
    const data = await prisma.duty.findUnique({
        where: {
            id: id
        }
    })
    return data;
}

const storeDuty = async(duty) => {
    const newDuty = await prisma.duty.create({
        data: {
            job: {
                connect: {
                    id: duty.job_id
                }
            },
            name: duty.name,
            description: duty.description,
            duration_type: duty.duration_type
        }
    })
    return newDuty;
}

const updateDuty = async(duty) => {
    const updatedDuty = await prisma.duty.update({
        where: {
            id: duty.id
        },
        data: {
            name: duty.name,
            description: duty.description,
            duration_type: duty.duration_type,
            status: duty.status,
            updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
    })
    return updatedDuty;
}

export default {
    getAllDuty,
    getAllDutyNotAssignedWithJobId,
    getDutyById,
    storeDuty,
    updateDuty
}