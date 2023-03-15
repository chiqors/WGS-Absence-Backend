import Duty from '../models/dutyModel.js';

const index = async(req, res) => {
    const values = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 5,
        job_id: parseInt(req.query.job_id) || null,
        status: req.query.status || null,
        updated_at: req.query.updated_at || null,
        duty_name: req.query.duty_name || null
    }
    const data = await Duty.getAllDuty(values);
    res.json(data);
}

const getAllDutyNotAssignedWithJobId = async(req, res) => {
    const jobId = parseInt(req.params.job_id);
    const data = await Duty.getAllDutyNotAssignedWithJobId(jobId);
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
}

const store = async(req, res) => {
    req.body.job_id = parseInt(req.body.job_id)
    await Duty.storeDuty(req.body);
    return res.status(201).json({ message: 'Duty created' });
}

const show = async(req, res) => {
    const paramId = parseInt(req.params.id);
    const data = await Duty.getDutyById(paramId);
    res.json(data);
}

const update = async(req, res) => {
    const values = {
        id: parseInt(req.params.id),
        name: req.body.name,
        description: req.body.description,
        duration_type: req.body.duration_type,
        status: req.body.status
    }
    await Duty.updateDuty(values);
    return res.status(201).json({ message: 'Duty updated' });
}

const getDutyAttendanceAndEmployeeById = async(req, res) => {
    const dutyId = parseInt(req.params.duty_id);
    const data = await Duty.getDutyAttendanceAndEmployeeById(dutyId);
    res.json(data);
}

const getAllJobs = async(req, res) => {
    const data = await Duty.getAllJobs();
    res.json(data);
}

export default {
    index,
    getAllDutyNotAssignedWithJobId,
    getDutyAttendanceAndEmployeeById,
    store,
    show,
    update,
    getAllJobs
}