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

export default {
    index,
    getAllDutyNotAssignedWithJobId,
}