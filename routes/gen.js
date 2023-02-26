import express from 'express';
import generateController from '../controllers/generateController.js';

// Global variables
const router = express.Router();

router.get('/employee', generateController.generateEmployees);
router.get('/job', generateController.generateJobs);
router.get('/duty', generateController.generateDuties);
router.get('/attendance', generateController.generateAttendances);

export default router;