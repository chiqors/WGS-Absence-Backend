import Job from '../models/jobModel.js';

const index = async(req, res) => {
    const values = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 5
    }
    const data = await Job.getAllJobsPaginated(values.page, values.limit);
    res.json(data);
}

const store = async(req, res) => {
    await Job.storeJob(req.body);
    return res.status(201).json({ message: 'Job created' });
}

const show = async(req, res) => {
    const paramId = parseInt(req.params.id);
    const data = await Job.getJobById(paramId);
    res.json(data);
}

const update = async(req, res) => {
    await Job.updateJob(req.body);
    return res.status(201).json({ message: 'Job updated' });
}

const destroy = async(req, res) => {
    await Job.deleteJob(req.params.id);
}

const showDutyAttendanceEmployee = async(req, res) => {
    const paramJobId = parseInt(req.params.job_id);
    const data = await Job.getDutyAttendanceEmployee(paramJobId);
    res.json(data);
}

export default {
    index,
    store,
    show,
    update,
    destroy,
    showDutyAttendanceEmployee
};