import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
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
            time_in: {
                gte: dayjs(date).startOf('day').toDate(),
                lte: dayjs(date).endOf('day').toDate()
            }
        },
        include: {
            employee: true,
            duty: {
                include: {
                    job: true
                }
            }
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
                },
            },
            time_in: attendance.time_in,
            note_in: attendance.note_in
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    await prisma.duty.update({
        where: {
            id: attendance.duty_id
        },
        data: {
            status: 'assigned'
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
            duty: {
                update: {
                    status: attendance.status
                }
            },
            time_out: attendance.time_out,
            note_out: attendance.note_out
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return updatedAttendance
}

const getAllAttendancesWeekly = async(week) => {
    // week 0 = this week
    // week 1 = last week
    // so on..

    // get all total employees who still active
    const totalEmployees = await prisma.employee.count({
        where: {
            status: 'active'
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })

    // get all attendances for this week
    const attendances = await prisma.attendance.findMany({
        where: {
            time_in: {
                gte: dayjs().startOf('week').add(week, 'week').toDate(),
                lte: dayjs().endOf('week').add(week, 'week').toDate()
            }
        },
        select: {
            time_in: true,
            time_out: true,
            employee: {
                select: {
                    id: true,
                    full_name: true
                }
            }
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })

    // form a variable to store the result
    // result = { week: 0, total_employees: 10, attendances }
    // attendances = [{ date: '2023-03-06', dayName: 'Monday', employee_present: 5 }]

    const result = {
        week: week,
        total_employees: totalEmployees,
        attendances: []
    }

    // fill the attendances with working days
    // from monday to friday
    for (let i = 1; i <= 5; i++) {
        // start from monday using dayjs on that week (week 0 = this week)
        const date = dayjs().startOf('week').subtract(week, 'week').add(i, 'day').format('YYYY-MM-DD')
        const dayName = dayjs().startOf('week').subtract(week, 'week').add(i, 'day').format('dddd')
        result.attendances.push({
            date: date,
            dayName: dayName,
            employee_present: 0
        })
    }
    
    // after that, fill the attendances with the attendances data
    // if there is no attendance for that day, then fill it with 0 for employee_present
    attendances.forEach(attendance => {
        const date = dayjs(attendance.time_in).format('YYYY-MM-DD')
        const dayName = dayjs(attendance.time_in).format('dddd')
        const index = result.attendances.findIndex(attendance => attendance.date === date)
        if (index !== -1) {
            result.attendances[index].employee_present += 1
        } else {
            result.attendances.push({
                date: date,
                dayName: dayName,
                employee_present: 1
            })
        }
    })

    return result
}

const getAllDutyNotCompletedForJobId = async(jobId) => {
    // get all attendances for specific job that not completed their duty
    const attendances = await prisma.attendance.findMany({
        where: {
            duty: {
                job_id: jobId,
                status: {
                    not: 'completed'
                }
            }
        },
        select: {
            employee: {
                select: {
                    full_name: true
                }
            },
            time_in: true,
            time_out: true,
            duty: true
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    return attendances
}

const checkIfDutyAssignedToday = async(duty_id) => {
    const attendance = await prisma.attendance.findFirst({
        where: {
            duty_id: duty_id,
            time_in: {
                gte: dayjs().startOf('day').toDate(),
                lte: dayjs().endOf('day').toDate()
            }
        }
    }).finally(async() => {
        await prisma.$disconnect()
    })
    if (attendance) {
        return true
    } else {
        return false
    }
}

export default {
    getAttendanceById,
    getAllAttendancesForSpecificDate,
    getAllAttendancesForSpecificEmployee,
    getAllAttendancesForSpecificEmployeeBeforeLatest,
    getAttendanceStatus,
    getAllAttendances,
    getAllAttendancesWeekly,
    createAttendanceWithCheckIn,
    updateAttendanceWithCheckOut,
    getAllDutyNotCompletedForJobId,
    checkIfDutyAssignedToday
};