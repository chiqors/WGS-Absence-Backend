import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const getAttendanceById = async(id) => {
    const attendance = await prisma.attendance.findUnique({
        where: {
            id: id
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return attendance
}

const getAllAttendancesForSpecificDate = async(date) => {
    const attendances = await prisma.attendance.findMany({
        where: {
            date: date
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return attendances
}

const getAllAttendancesForSpecificEmployee = async(employee_id) => {
    const attendances = await prisma.attendance.findMany({
        where: {
            employee_id: employee_id
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return attendances
}

const getAllAttendances = async() => {
    const attendances = await prisma.attendance.findMany({
        orderBy: {
            id: 'desc'
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return attendances
}

const storeAttendance = async(attendance) => {
    const newAttendance = await prisma.attendance.create({
        data: attendance
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return newAttendance
}

const updateAttendance = async(attendance) => {
    const updateAttendance = await prisma.attendance.update({
        where: {
            id: attendance.id
        },
        data: attendance
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return updateAttendance
}

const updateAttendanceTimeOut = async(attendance) => {
    const updateAttendance = await prisma.attendance.update({
        where: {
            id: attendance.id
        },
        data: {
            time_out: attendance.time_out
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return updateAttendance
}

const deleteAttendance = async(id) => {
    const deleteAttendance = await prisma.attendance.delete({
        where: {
            id: id
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return deleteAttendance
}

export default {
    getAttendanceById,
    getAllAttendancesForSpecificDate,
    getAllAttendancesForSpecificEmployee,
    getAllAttendances,
    storeAttendance,
    updateAttendance,
    updateAttendanceTimeOut,
    deleteAttendance,
};