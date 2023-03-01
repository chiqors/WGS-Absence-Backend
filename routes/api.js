import express from 'express';
import express_jwt from "express-jwt";
import jwt from 'jsonwebtoken';

// Import Handler for API routes
import { validateCreateEmployee, validateEditEmployee } from '../handler/formValidation.js';
import { avatarUpload } from '../handler/fileUpload.js';

// Import Controllers for API routes
import employeeController from '../controllers/employeeController.js';
import jobController from '../controllers/jobController.js';
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

// Auth
router.post('/google-oauth', employeeController.googleOauth);
router.post('/login', employeeController.login);

// Employee API routes
router.get('/employee', employeeController.index);
router.post('/employee', avatarUpload.single('photo_url'), validateCreateEmployee, employeeController.store);
router.get('/employee/:id', employeeController.show);
router.put('/employee/:id', avatarUpload.single('photo_url'), validateEditEmployee, employeeController.update);
router.delete('/employee/:id', employeeController.destroy);

// Job API routes
router.get('/job', jobController.index);
router.post('/job', jobController.store);
router.get('/job/:id', jobController.show);
router.put('/job/:id', jobController.update);
router.delete('/job/:id', jobController.destroy);

// Attendance API routes
router.get('/attendance', attendanceController.index);
router.post('/attendance', attendanceController.store);
router.get('/attendance/:id', attendanceController.show);
router.get('/attendance/date/:date', attendanceController.showAllForSpecificDate);
router.get('/attendance/employee/:employee_id', attendanceController.showAllForSpecificEmployee);
router.put('/attendance/:id', attendanceController.update);
router.delete('/attendance/:id', attendanceController.destroy);

export default router;