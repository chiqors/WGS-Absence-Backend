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
    // should return all attendances on this week only
    const attendances = await prisma.attendance.findMany({
        where: {
            employee_id: employee_id,
            time_in: {
                gte: new Date(new Date().setDate(new Date().getDate() - 7))
            }
        },
        include: {
            duty: true
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return attendances
}

const getAllAttendancesForSpecificEmployeeBeforeLatest = async(employee_id) => {
    // should return all attendances on this week only before the latest attendance
    const attendances = await prisma.attendance.findMany({
        where: {
            employee_id: employee_id,
            time_in: {
                gte: new Date(new Date().setDate(new Date().getDate() - 7))
            },
            time_out: {
                not: null
            }
        },
        include: {
            duty: true
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return attendances
}

const getAttendanceStatus = async(employee_id) => {
    // should return the latest attendance for the employee for today
    const attendance = await prisma.attendance.findFirst({
        where: {
            employee_id: employee_id,
            time_in: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        },
        orderBy: {
            id: 'desc'
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return attendance
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

const createAttendanceWithCheckIn = async(attendance) => {
    const newAttendance = await prisma.attendance.create({
        data: {
            employee: {
                connect: {
                    id: attendance.employee_id
                }
            },
            duty: {
                connect: {
                    id: attendance.duty_id
                }
            },
            time_in: attendance.time_in
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return newAttendance
}

const updateAttendanceWithCheckOut = async(attendance) => {
    // first get the latest attendance for the employee
    const latestAttendance = await prisma.attendance.findFirst({
        where: {
            employee_id: attendance.employee_id
        },
        orderBy: {
            id: 'desc'
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    // then update the attendance with the time_out value
    const updatedAttendance = await prisma.attendance.update({
        where: {
            id: latestAttendance.id
        },
        data: {
            time_out: attendance.time_out
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return updatedAttendance
}

export default {
    getAttendanceById,
    getAllAttendancesForSpecificDate,
    getAllAttendancesForSpecificEmployee,
    getAllAttendancesForSpecificEmployeeBeforeLatest,
    getAttendanceStatus,
    getAllAttendances,
    createAttendanceWithCheckIn,
    updateAttendanceWithCheckOut,
};