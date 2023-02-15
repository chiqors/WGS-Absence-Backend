import express from 'express';
import generateController from '../controllers/generateController.js';

// Global variables
const router = express.Router();

router.get('/employee', generateController.generateEmployees);

export default router;