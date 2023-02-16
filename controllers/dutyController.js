import Duty from '../models/dutyModel.js';

const index = async(req, res) => {
    const data = await Duty.getAllDuties();
    if (data.rows.length > 0) {
        res.json(data.rows);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
}

const store = async(req, res) => {
    await Duty.storeDuty(req.body);
}

const show = async(req, res) => {
    const data = await Duty.getDutyById(req.params.id);
    if (data.rows.length > 0) {
        res.json(data.rows);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
}

const update = async(req, res) => {
    await Duty.updateDuty(req.body);
}

const destroy = async(req, res) => {
    await Duty.deleteDuty(req.params.id);
}

export default {
    index,
    store,
    show,
    update,
    destroy
};