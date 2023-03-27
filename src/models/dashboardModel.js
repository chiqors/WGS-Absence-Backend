import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
const prisma = new PrismaClient()

const getDashboardCards = async () => {
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

const getTopAttendance = async () => {
    const getTopAttendance = await prisma.attendance.findMany({
        where: {
            time_in: {
                gte: dayjs().startOf('month').toDate(),
                lte: dayjs().endOf('month').toDate()
            }
        },
        select: {
            time_out: true,
            employee: {
                select: {
                    id: true,
                    full_name: true,
                    gender: true,
                    photo_url: true,
                    birthdate: true,
                    job: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        },
        orderBy: {
            time_in: 'desc'
        }
    })

    // remove duplicate employee and count the attendance for each employee
    const getTopAttendanceCount = getTopAttendance.reduce((acc, cur) => {
        const x = acc.find(item => item.employee.id === cur.employee.id);
        if (!x) {
            return acc.concat([{ ...cur, count: 1 }]);
        } else {
            return acc.map(item => item.employee.id === cur.employee.id ? { ...item, count: item.count + 1 } : item);
        }
    }, []);

    // sort by attendance count
    const getTopAttendanceSorted = getTopAttendanceCount.sort((a, b) => b.count - a.count);

    // return only 5 employee
    return getTopAttendanceSorted.slice(0, 5);
}

const getAverageAttendanceThisMonth = async () => {
    const getDatesForThisMonth = Array.from({ length: dayjs().daysInMonth() }, (_, i) => dayjs().startOf('month').add(i, 'day').format('YYYY-MM-DD')).filter(item => dayjs(item).day() !== 0 && dayjs(item).day() !== 6);

    const getAllAttendanceForThisMonth = await prisma.attendance.findMany({
        where: {
            time_in: {
                gte: dayjs().startOf('month').toDate(),
                lte: dayjs().endOf('month').toDate()
            }
        },
        select: {
            time_out: true,
            employee: {
                select: {
                    id: true,
                    full_name: true,
                }
            }
        },
        orderBy: {
            time_in: 'asc'
        }
    })

    const total_employee = await prisma.employee.count({
        where: {
            status: 'active'
        }
    });

    // count total_present and total_absent for each date
    let dataAttend = [];
    getAllAttendanceForThisMonth.forEach(item => {
        const x = dataAttend.find(item2 => item2.date === dayjs(item.time_out).format('YYYY-MM-DD'));
        if (!x) {
            dataAttend.push({
                date: dayjs(item.time_out).format('YYYY-MM-DD'),
                employee_present: [{ employee_id: item.employee.id, employee_name: item.employee.full_name }],
                total_absent: total_employee - 1
            });
        } else {
            dataAttend = dataAttend.map(item2 => item2.date === dayjs(item.time_out).format('YYYY-MM-DD') ? { ...item2, employee_present: item2.employee_present.concat([{ employee_id: item.employee.id, employee_name: item.employee.full_name }]), total_absent: item2.total_absent - 1 } : item2);
        }
    });

    // push dataAttend into getDatesForThisMonth
    const getDatesForThisMonthWithAttendance = getDatesForThisMonth.map(item => {
        const x = dataAttend.find(item2 => item2.date === item);
        if (!x) {
            return {
                date: item,
                employee_present: [],
                total_absent: total_employee
            }
        } else {
            return x;
        }
    });

    // calculate percentage present, percentage absent, and average present for whole month from getDatesForThisMonth
    let total_percentage_present = 0;
    let total_percentage_absent = 0;
    let average_present = 0;
    getDatesForThisMonthWithAttendance.forEach(item => {
        const percentage_present = item.employee_present.length / total_employee * 100;
        const percentage_absent = item.total_absent / total_employee * 100;
        total_percentage_present += percentage_present;
        total_percentage_absent += percentage_absent;
        average_present += item.employee_present.length;
    });

    return {
        total_percentage_present: parseFloat((total_percentage_present / getDatesForThisMonthWithAttendance.length).toFixed(2)),
        total_percentage_absent: parseFloat((total_percentage_absent / getDatesForThisMonthWithAttendance.length).toFixed(2)),
        average_present: parseFloat((average_present / getDatesForThisMonthWithAttendance.length).toFixed(2)),
        approx_present: Math.ceil(average_present / getDatesForThisMonthWithAttendance.length),
        data: getDatesForThisMonthWithAttendance
    }
}

export default {
    getDashboardCards,
    getTopAttendance,
    getAverageAttendanceThisMonth
}