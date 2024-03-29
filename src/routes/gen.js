import express from 'express';
import generateController from '../controllers/generateController.js';

// Global variables
const router = express.Router();

router.get('/employee', generateController.generateEmployees);
router.get('/job', generateController.generateJobs);
router.get('/duty', generateController.generateDuties);
router.get('/attendance', generateController.generateAttendances);
router.get('/attendance/v2', generateController.generateAttendancesV2);
router.get('/all', generateController.generateAll);
router.get('/admin', generateController.generateAdmin);
router.get('/accesslog', generateController.generateAccessLog);
router.get('/errorlog', generateController.generateErrorLog);

export default router;