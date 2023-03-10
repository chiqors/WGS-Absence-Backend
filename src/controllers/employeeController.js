import { validationResult } from 'express-validator';
import Employee from '../models/employeeModel.js';
import logger from '../utils/logger.js';
import fs from 'fs';
import mailWelcome from '../templates/mailWelcome.js';
import mailUpdateEmail from '../templates/mailUpdateEmail.js';
import sendEmail from '../handler/mail.js';
import clientTwilio from '../handler/sms.js';

const index = async(req, res) => {
    // parse query string to get limit and offset
    const reqlimit = parseInt(req.query.limit) || 10;
    const reqoffset = parseInt(req.query.offset) || 0;
    const data = await Employee.getAllEmployeesWithLimitOffsetAndRelationWithJobs(reqlimit, reqoffset);
    const total = await Employee.countAllEmployees();
    const getTotalPage = Math.ceil(total / reqlimit);
    const response = {
        total_data: total,
        total_pages: getTotalPage,
        data: data
    }
    if (data.length > 0) {
        res.json(response);
    } else {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog('Employee not found', fullUrl, 'GET', 404);
        res.status(404).json({ message: 'Data not found' });
    }
};

const store = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog('Validation Error', fullUrl, 'POST', 422);
        return res.status(422).json({ errors: errors.array() });
    }
    if (req.file) {
        const fullPublicUrl = `${process.env.UPLOAD_FOLDER || '/uploads'}/${req.body.username}/${req.file.filename}`
        req.body.photo_url = fullPublicUrl
    }
    req.body.birthdate = new Date(req.body.birthdate);
    req.body.job_id = parseInt(req.body.job_id);
    const token = await Employee.storeEmployee(req.body).catch((err) => {
        console.log(err);
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog(err, fullUrl, 'POST', 500);
        return res.status(500).json({ message: 'Internal Server Error' });
    });
    const mailData = {
        to: req.body.email,
        subject: `Email Verification`,
        description: 'Welcome! This email is for your email verification.',
        body: mailWelcome(req.body.full_name, req.body.username, req.body.password, token)
    }
    await sendEmail(mailData);
    return res.status(201).json({ message: 'submitted' });
}

const show = async(req, res) => {
    const paramsId = parseInt(req.params.id);
    const data = await Employee.getEmployeeById(paramsId);
    if (data) {
        res.json(data);
    } else {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog('Employee not found', fullUrl, 'GET', 404);
        res.status(404).json({ message: 'Data not found' });
    }
}

const update = async(req, res) => {
    const paramsId = parseInt(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog('Validation Error', fullUrl, 'PUT', 422);
        return res.status(422).json({ errors: errors.array() });
    }
    const old_data = await Employee.getEmployeeById(paramsId);
    if (req.file) {
        if (req.body.username !== old_data.account.username) {
            // delete old avatar and folder
            if (fs.existsSync(`public/uploads/${old_data.account.username}`)) {
                fs.rm(`public/uploads/${old_data.account.username}`, { recursive: true });
                console.log('avatar and user folder has been deleted')
            }
        }
        const fullPublicUrl = `${process.env.UPLOAD_FOLDER || '/uploads'}/${req.body.username}/${req.file.filename}`
        req.body.photo_url = fullPublicUrl
    }
    if (req.body.email) {
        if (req.body.email !== old_data.account.email) {
            // send email verification for new email
            const token = await Employee.updateEmail(req.body.email, paramsId).catch((err) => {
                console.log(err);
                const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
                logger.saveErrorLog(err, fullUrl, 'PUT', 500);
                return res.status(500).json({ message: 'Internal Server Error' });
            });
            const mailData = {
                to: req.body.email,
                subject: `Request Email Change Verification`,
                description: 'Hi! This email is for your new email verification.',
                body: mailUpdateEmail(req.body.full_name, token)
            }
            await sendEmail(mailData);
        }
    }
    req.body.id = paramsId;
    req.body.birthdate = new Date(req.body.birthdate);
    req.body.job_id = parseInt(req.body.job_id);
    await Employee.updateEmployee(req.body).catch((err) => {
        console.log(err);
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog(err, fullUrl, 'POST', 500);
        return res.status(500).json({ message: 'Internal Server Error' });
    });
    return res.status(201).json({ message: 'updated' });
}

const destroy = async(req, res) => {
    const paramsId = parseInt(req.params.id);
    const data = await Employee.getEmployeeById(paramsId);
    if (data) {
        const username = data.account.username;
        if (fs.existsSync(`public/uploads/${username}`)) {
            fs.rm(`public/uploads/${username}`, { recursive: true });
            console.log('avatar and user folder has been deleted')
        }
        await Employee.deleteEmployee(paramsId).catch((err) => {
            console.log(err);
            const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
            logger.saveErrorLog(err, fullUrl, 'DELETE', 500);
            res.status(500).json({ message: 'Internal Server Error' });
        });
        return res.status(201).json({ message: 'deleted' });
    } else {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog('Employee not found', fullUrl, 'DELETE', 404);
        res.status(404).json({ message: 'Data not found' });
    }
}

const smsTest = async(req, res) => {
    try {
        const message = await clientTwilio.messages.create({
            to: '+6281223939528', // Replace with your phone number
            from: process.env.TWILIO_PHONE_NUMBER, // Replace with your Twilio number
            body: 'Hello Guest!'
        });
        console.log(message.sid);
        res.send('SMS message sent successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending SMS message.');
    }
}

export default {
    index,
    store,
    show,
    update,
    destroy,
    smsTest
};