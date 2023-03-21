import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
const prisma = new PrismaClient()

const getDashboard = async () => {
    const getTotalAttendees = await prisma.attendance.count({
        where: {
            time_in: {
                gte: dayjs().startOf('day').toDate(),
                lte: dayjs().endOf('day').toDate()
            }
        }
    })
    const getTotalEmployees = await prisma.employee.count({
        where: {
            status: 'active'
        }
    })
    const getTotalAbsent = getTotalEmployees - getTotalAttendees;
    const getTotalDuty = await prisma.duty.count({
        where: {
            status: 'assigned'
        }
    })
    const getTotalDutyNotAssigned = await prisma.duty.count({
        where: {
            status: 'not_assigned'
        }
    })
    const getTotalDutyCompleted = await prisma.duty.count({
        where: {
            status: 'completed',
            updated_at: {
                // yesterday
                gte: dayjs().subtract(1, 'day').startOf('day').toDate(),
                lte: dayjs().subtract(1, 'day').endOf('day').toDate()
            }
        }
    })
    const getTotalDutyNeedDiscussion = await prisma.duty.count({
        where: {
            status: 'need_discussion',
            updated_at: {
                // yesterday
                gte: dayjs().subtract(1, 'day').startOf('day').toDate(),
                lte: dayjs().subtract(1, 'day').endOf('day').toDate()
            }
        }
    })
    const getTotalJob = await prisma.job.count();
    // { totalAttendees: 0, totalAbsent: 0, totalDuty: 0, totalDutyNotAssigned: 0, totalDutyCompleted: 0, totalDutyNeedDiscussion: 0, totalJob: 0 }
    return {
        totalAttendees: getTotalAttendees,
        totalAbsent: getTotalAbsent,
        totalDuty: getTotalDuty,
        totalDutyNotAssigned: getTotalDutyNotAssigned,
        totalDutyCompleted: getTotalDutyCompleted,
        totalDutyNeedDiscussion: getTotalDutyNeedDiscussion,
        totalJob: getTotalJob
    }
}

export default {
    getDashboard
}