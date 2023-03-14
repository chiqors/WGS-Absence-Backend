import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import dayjs from 'dayjs'

const getAllDuty = async(data) => {
    // get all duty without pagination
    let duties = await prisma.duty.findMany({
        orderBy: {
            id: 'desc'
        },
        include: {
            job: true,
            attendance: {
                orderBy: {
                    id: 'desc'
                },
                take: 1,
                include: {
                    employee: true
                }
            }
        }
    })

    // filter by job_id
    if (data.job_id) {
        duties = duties.filter(duty => duty.job_id == data.job_id)
    }

    // filter by status
    if (data.status) {
        duties = duties.filter(duty => duty.status == data.status)
    }

    // filter by updated_at (today, yesterday, this week, this month, this year)
    if (data.updated_at) {
        if (data.updated_at == 'today') {
            duties = duties.filter(duty => dayjs(duty.updated_at).format('YYYY-MM-DD') == dayjs().format('YYYY-MM-DD'))
        } else if (data.updated_at == 'yesterday') {
            duties = duties.filter(duty => dayjs(duty.updated_at).format('YYYY-MM-DD') == dayjs().subtract(1, 'day').format('YYYY-MM-DD'))
        } else if (data.updated_at == 'this_week') {
            duties = duties.filter(duty => dayjs(duty.updated_at).format('YYYY-MM-DD') >= dayjs().startOf('week').format('YYYY-MM-DD') && dayjs(duty.updated_at).format('YYYY-MM-DD') <= dayjs().endOf('week').format('YYYY-MM-DD'))
        } else if (data.updated_at == 'this_month') {
            duties = duties.filter(duty => dayjs(duty.updated_at).format('YYYY-MM-DD') >= dayjs().startOf('month').format('YYYY-MM-DD') && dayjs(duty.updated_at).format('YYYY-MM-DD') <= dayjs().endOf('month').format('YYYY-MM-DD'))
        } else if (data.updated_at == 'this_year') {
            duties = duties.filter(duty => dayjs(duty.updated_at).format('YYYY-MM-DD') >= dayjs().startOf('year').format('YYYY-MM-DD') && dayjs(duty.updated_at).format('YYYY-MM-DD') <= dayjs().endOf('year').format('YYYY-MM-DD'))
        }
    }
    
    // search by duty_name
    if (data.duty_name) {
        duties = duties.filter(duty => duty.name.toLowerCase().includes(data.duty_name.toLowerCase()))
    }

    // calculate total data, total page, and current page
    const total_data = duties.length;
    const total_page = Math.ceil(total_data / data.limit);
    const current_page = data.page;

    // get all duty with pagination
    duties = duties.slice((data.page - 1) * data.limit, data.page * data.limit)

    // get all job for dynamic filter
    const getAllJobs = await prisma.job.findMany();
    const dynamic_filter = {
        jobs: getAllJobs
    }

    return {
        total_data,
        total_page,
        current_page,
        dynamic_filter,
        data: duties
    };
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
            updated_at: dayjs().toISOString()
        }
    })
    return updatedDuty;
}

const getDutyAttendanceAndEmployeeById = async(duty_id) => {
    const data = await prisma.duty.findUnique({
        where: {
            id: duty_id
        },
        include: {
            attendance: {
                orderBy: {
                    id: 'desc'
                },
                take: 5,
                include: {
                    employee: true
                }
            }
        }
    })
    return data;
}

const getAllJobs = async() => {
    const data = await prisma.job.findMany();
    return data;
}

export default {
    getAllDuty,
    getAllDutyNotAssignedWithJobId,
    getDutyAttendanceAndEmployeeById,
    getDutyById,
    storeDuty,
    updateDuty,
    getAllJobs
}