import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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

export default {
    getAllDuty,
    getAllDutyNotAssignedWithJobId,
}