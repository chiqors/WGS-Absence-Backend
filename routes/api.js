import express from 'express';
import employeeController from '../controllers/employeeController.js';

// Global variables
const router = express.Router();

router.get('/', (req, res) => {
    console.log('GET /api');
    res.send('GET /api');
});

router.get('/employee', employeeController.index);
router.get('/employee/create', employeeController.create);
router.post('/employee', employeeController.store);
router.get('/employee/show/:id', employeeController.show);
router.get('/employee/edit/:id', employeeController.edit);
router.put('/employee/:id', employeeController.update);
router.delete('/employee/:id', employeeController.destroy);

export default router;