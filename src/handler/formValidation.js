import { body } from 'express-validator';
import employeeModel from '../models/employeeModel.js';

export const validateCreateEmployee = [
    body('full_name').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('job_id').isInt().withMessage('Job must be selected'),
    body('gender').isString().withMessage('Gender must be selected'),
    body('phone')
        .exists().withMessage('Phone is required')
        .isLength({ min: 8 }).withMessage('Phone must be at least 8 characters long')
        .isMobilePhone().withMessage('Invalid phone number')
        .custom(async (value, { req }) => {
            try {
                const employee = await employeeModel.findPhone(value);
                if (employee) {
                    throw new Error('Phone already in use');
                }
                return true;
            } catch (error) {
                console.log(error);
                throw new Error("Internal server error");
            }
    }),
    body('email')
        .exists().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address')
        .custom(async (value, { req }) => {
            try {
                const employee = await employeeModel.findEmail(value);
                if (employee) {
                    throw new Error('Email already in use');
                }
                return true;
            } catch (error) {
                console.log(error);
                throw new Error("Internal server error");
            }
    }),
    body('address').isLength({ min: 3 }).withMessage('Address must be at least 3 characters long'),
    body('birthdate').isDate({format: 'YYYY-MM-DD'}).withMessage('Birthdate must be valid'),
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('confirm_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    body('photo_url').optional()
    // body('photo_url').custom((value, { req }) => {
    //     if (req.file === undefined) {
    //         throw new Error('Photo must be uploaded');
    //     }
    //     return true;
    // })
]

export const validateEditEmployee = [
    body('full_name').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('job_id').isInt().withMessage('Job must be selected'),
    body('gender').isString().withMessage('Gender must be selected'),
    body('phone').isLength({ min: 10 }).isMobilePhone().withMessage('Phone must be at least 10 characters long'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('address').isLength({ min: 3 }).withMessage('Address must be at least 3 characters long'),
    body('birthdate').isDate({format: 'YYYY-MM-DD'}).withMessage('Birthdate must be valid'),
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long').optional(),
    body('old_password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').optional(),
    body('new_password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').optional(),
    body('confirm_password').custom((value, { req }) => {
        if (req.body.new_password !== undefined) {
            if (value !== req.body.new_password) {
                throw new Error('Password confirmation does not match password');
            }
        }
        return true;
    }),
    // body('photo_url').custom((value, { req }) => {
    //     if (req.file === undefined) {
    //         if (req.body.photo_url === undefined) {
    //             throw new Error('Photo must be uploaded');
    //         }
    //     }
    //     return true;
    // })
    body('photo_url').optional()
]