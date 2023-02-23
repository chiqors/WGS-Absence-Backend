import express from 'express';

// Import Handler for API routes
import { validateCreateEmployee, validateEditEmployee } from '../handler/formValidation.js';
import { avatarUpload } from '../handler/fileUpload.js';

// Import Controllers for API routes
import employeeController from '../controllers/employeeController.js';
import jobController from '../controllers/jobController.js';

// Global variables
const router = express.Router();

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

// Auth
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

export default router;