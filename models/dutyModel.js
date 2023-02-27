import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const getDutyById = async(id) => {
    const duty = await prisma.duty.findUnique({
        where: {
            id: id
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return duty
}

const getDutyByName = async(name) => {
    const duty = await prisma.duty.findFirst({
        where: {
            task_name: name
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return duty
}

const getAllDuties = async() => {
    const duties = await prisma.duty.findMany({
        orderBy: {
            id: 'desc'
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return duties
}

const storeDuty = async(duty) => {
    const newDuty = await prisma.duty.create({
        data: duty
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return newDuty
}

const updateDuty = async(duty) => {
    const updateDuty = await prisma.duty.update({
        where: {
            id: duty.id
        },
        data: duty
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return updateDuty
}

const deleteDuty = async(id) => {
    const deleteDuty = await prisma.duty.delete({
        where: {
            id: id
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return deleteDuty
}

export default {
    getDutyById,
    getDutyByName,
    getAllDuties,
    storeDuty,
    updateDuty,
    deleteDuty,
};