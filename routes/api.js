import express from 'express';
import employeeController from '../controllers/employeeController.js';

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

// Auth
router.post('/login', employeeController.login);

// Employee API routes
router.get('/employee', employeeController.index);
router.post('/employee', employeeController.store);
router.get('/employee/:id', employeeController.show);
router.put('/employee/:id', employeeController.update);
router.delete('/employee/:id', employeeController.destroy);

export default router;