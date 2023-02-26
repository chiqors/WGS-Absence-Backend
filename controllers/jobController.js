import Job from '../models/jobModel.js';

const index = async(req, res) => {
    const data = await Job.getAllJobs();
    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
}

const store = async(req, res) => {
    await Job.storeJob(req.body);
}

const show = async(req, res) => {
    const data = await Job.getJobById(req.params.id);
    if (data.rows.length > 0) {
        res.json(data.rows);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
}

const update = async(req, res) => {
    await Job.updateJob(req.body);
}

const destroy = async(req, res) => {
    await Job.deleteJob(req.params.id);
}

export default {
    index,
    store,
    show,
    update,
    destroy
};