import Duty from '../models/dutyModel.js';

const index = async(req, res) => {
    const data = await Duty.getAllDuties();
    if (data.rows.length > 0) {
        res.json(data.rows);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
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

export default {
    index,
    getAllDutyNotAssignedWithJobId,
    store,
    show,
    update
}