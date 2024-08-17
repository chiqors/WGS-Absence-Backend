import Employee from '../models/employeeModel.js';
import axios from 'axios';
import logger from '../utils/logger.js';
import { FRONTEND_URL } from '../config.js';
import jwt_decode from 'jwt-decode';

const login = async(req, res) => {
    const data = await Employee.checkAuth(req.body.username, req.body.password);
    if (data) {
        logger.saveLog({
            level: 'ACC',
            message: 'Login Success for username: ' + req.body.username,
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 200
        })
        res.status(200).json({ message: 'You are successfully logged in', token: data  });
    } else {
        logger.saveErrorLog({
            level: 'ERR',
            message: 'Username or password is incorrect',
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 404
        })
        res.status(404).json({ message: 'Username or password is incorrect' });
    }
}

const logout = async(req, res) => {
    logger.saveLog({
        level: 'ACC',
        message: 'Logout Success for username: ' + req.body.username,
        server: 'BACKEND',
        urlPath: req.originalUrl,
        lastHost: req.headers.host,
        method: req.method,
        status: 200
    })
    res.status(200).json({ message: 'You are successfully logged out' });
}

const googleOauth = async(req, res) => {
    let data = null;
    if (req.body.accessToken) {
        const accessToken = req.body.accessToken;
        const resp = await axios(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        data = await Employee.checkGoogleOauth(resp.data);
    }
    if (req.body.credential) {
        const credential = req.body.credential;
        const decoded = jwt_decode(credential);
        data = await Employee.checkGoogleOauth(decoded);
    }
    if (data) {
        logger.saveLog({
            level: 'ACC',
            message: 'Google Oauth Success',
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 200
        })
        res.status(200).json({ message: 'You are successfully logged in', token: data  });
    } else {
        logger.saveErrorLog({
            level: 'ERR',
            message: 'Google Oauth Failed',
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 404
        })
        res.status(404).json({ message: 'Google Oauth Failed' });
    }
}

const verifyEmail = async (req, res) => {
    const token = req.query.code;
    await Employee.verifyEmail(token).then(() => {
        logger.saveLog({
            level: 'ACC',
            message: 'Email Verification Success for token: ' + token,
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 200
        })
        res.redirect(`${FRONTEND_URL}/login`);
    }).catch((err) => {
        logger.saveErrorLog({
            level: 'ERR',
            isStackTrace: true,
            message: err.message,
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 500
        })
        res.status(500).json({ message: 'Internal Server Error' });
    });
}

const forgotPassword = async (req, res) => {
    const data = await Employee.forgotPassword(req.body.email);
    if (data) {
        logger.saveLog({
            level: 'ACC',
            message: 'Forgot Password Success for email: ' + req.body.email,
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 200
        })
        res.status(200).json({ message: 'Please check your email to reset your password' });
    } else {
        logger.saveErrorLog({
            level: 'ERR',
            message: 'Email is not registered',
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 404
        })
        res.status(404).json({ message: 'Email is not registered' });
    }
}

const resetPassword = async (req, res) => {
    const data = await Employee.resetPassword(req.body.token, req.body.password);
    if (data) {
        logger.saveLog({
            level: 'ACC',
            message: 'Reset Password Success for token: ' + req.body.token,
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 200
        })
        res.status(200).json({ message: 'Your password has been changed' });
    } else {
        logger.saveErrorLog({
            level: 'ERR',
            message: 'Token is invalid: ' + req.body.token,
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 404
        })
        res.status(404).json({ message: 'Token is invalid' });
    }
}

const googleOauthLink = async (req, res) => {
    const values = {
        employee_id: parseInt(req.body.employee_id),
        access_token: req.body.access_token
    }
    const resp = await axios(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
        headers: {
            Authorization: `Bearer ${values.access_token}`,
        },
    });
    values.email = resp.data.email;
    try {
        await Employee.googleOauthLink(values);
        logger.saveLog({
            level: 'ACC',
            message: 'Google Account has been linked for Employee ID: ' + values.employee_id,
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 200
        })
        res.status(200).json({ message: 'Google Account has been linked' });
    } catch (err) {
        logger.saveErrorLog({
            level: 'ERR',
            isStackTrace: true,
            message: err.message,
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 500
        })
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const googleOauthUnlink = async (req, res) => {
    try {
        await Employee.googleOauthUnlink(req.body.oauth_id);
        logger.saveLog({
            level: 'ACC',
            message: 'Google Account has been unlinked for Employee ID: ' + values.employee_id,
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 200
        })
        res.status(200).json({ message: 'Google Account has been unlinked' });
    } catch (err) {
        console.log(err.message);
        logger.saveErrorLog({
            level: 'ERR',
            message: 'Google Account Unlink Failed',
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 500
        })
        res.status(500).json({ message: 'Google Account Unlink Failed' });
    }
}

const googleOauthData = async (req, res) => {
    const values = {
        employee_id: parseInt(req.params.employee_id)
    }
    try {
        const data = await Employee.googleOauthData(values.employee_id);
        if (data) {
            res.status(200).json({ data });
        } else {
            logger.saveErrorLog({
                level: 'ERR',
                message: 'Oauth Data Not Found',
                server: 'BACKEND',
                urlPath: req.originalUrl,
                lastHost: req.headers.host,
                method: req.method,
                status: 500
            })
            res.status(200).json({ data: null });
        }
    } catch (err) {
        logger.saveErrorLog({
            level: 'ERR',
            isStackTrace: true,
            message: err.message,
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 500
        })
        res.status(200).json({ data: null });
    }
}

const getAuthById = async (req, res) => {
    const data = await Employee.getAuthById(req.params.id);
    if (data) {
        res.status(200).json({ data });
    } else {
        logger.saveErrorLog({
            level: 'ERR',
            message: 'Internal Server Error',
            server: 'BACKEND',
            urlPath: req.originalUrl,
            lastHost: req.headers.host,
            method: req.method,
            status: 500
        })
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default {
    login,
    logout,
    googleOauth,
    verifyEmail,
    forgotPassword,
    resetPassword,
    googleOauthLink,
    googleOauthUnlink,
    googleOauthData,
    getAuthById
}