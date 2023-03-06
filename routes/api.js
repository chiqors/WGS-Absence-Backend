import express from 'express';
import express_jwt from "express-jwt";
import jwt from 'jsonwebtoken';

// Import Handler for API routes
import { validateCreateEmployee, validateEditEmployee } from '../handler/formValidation.js';
import { avatarUpload } from '../handler/fileUpload.js';
import sendMail from '../handler/mail.js';

// Import Controllers for API routes
import employeeController from '../controllers/employeeController.js';
import jobController from '../controllers/jobController.js';
import dutyController from '../controllers/dutyController.js';
import attendanceController from '../controllers/attendanceController.js';

// Global variables
const router = express.Router();
const { expressjwt, ExpressJwtRequest } = express_jwt;

// Testing API routes
router.get('/', (req, res) => {
    console.log('GET /api');
    res.send('GET /api');
});
router.post('/', (req, res) => {
    console.log('POST /api');
    res.send('POST /api');
});
router.put('/', (req, res) => {
    console.log('PUT /api');
    res.send('PUT /api');
});
router.delete('/', (req, res) => {
    console.log('DELETE /api');
    res.send('DELETE /api');
});

// test upload
router.post('/upload', avatarUpload.single('uploaded_file'), function (req, res) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    console.log(req.file, req.body)
});

// test mail
router.post('/testMail', (req, res) => {
    let mailOptions = {
        to: req.body.to,
        subject: req.body.subject,
        body: req.body.body
    };
    console.log(mailOptions);
    
    sendMail(mailOptions.to, mailOptions.subject, mailOptions.content).then((response) => {
        res.status(250).send(response);
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
});

// test jwt
router.get('/jwt', expressjwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), (req, res) => {
    console.log('GET /api/jwt with token');
    res.send('GET /api/jwt with token');
});
router.get('/jwt/get', (req, res) => {
    const payload = {
        id: 1,
        username: 'admin',
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    // localStorage.setItem('token', token);
    res.send(token);
});
router.get('/jwt/decode', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.send(decoded);
});
router.get('/jwt/delete', (req, res) => {
    // localStorage.removeItem('token');
    res.send('token deleted');
});


router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...');
    } else {
        next();
    }
});

// Employee API routes
router.get('/employee', employeeController.index);
router.post('/employee', avatarUpload.single('photo_file'), validateCreateEmployee, employeeController.store);
router.get('/employee/:id', employeeController.show);
router.put('/employee/:id', avatarUpload.single('photo_file'), validateEditEmployee, employeeController.update);
router.delete('/employee/:id', employeeController.destroy);

// Job API routes
router.get('/job', jobController.index);
router.post('/job', jobController.store);
router.get('/job/:id', jobController.show);
router.put('/job/:id', jobController.update);
router.delete('/job/:id', jobController.destroy);

// Duty API routes
router.get('/duty', dutyController.index);
router.get('/duty/getAllDutyNotAssignedWithJobId/:job_id', dutyController.getAllDutyNotAssignedWithJobId);

// Attendance API routes
router.get('/attendance', attendanceController.index);
router.get('/attendance/latest')
router.post('/attendance/checkin/status', attendanceController.checkInStatus);
router.post('/attendance/checkin', attendanceController.checkIn);
router.put('/attendance/checkout', attendanceController.checkOut);
router.get('/attendance/prevlist/employee/:employee_id', attendanceController.showAllForSpecificEmployeePrevList);
router.get('/attendance/:id', attendanceController.show);
router.get('/attendance/date/:date', attendanceController.showAllForSpecificDate);
router.get('/attendance/employee/:employee_id', attendanceController.showAllForSpecificEmployee);


export default router;