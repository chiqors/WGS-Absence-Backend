import Employee from '../models/employeeModel.js';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const login = async(req, res) => {
    const data = await Employee.checkAuth(req.body.username, req.body.password);
    if (data) {
        res.status(200).json({ message: 'You are successfully logged in', token: data  });
    } else {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog('Username and Password are invalid', fullUrl, 'POST', 404);
        res.status(404).json({ message: 'Username and Password are invalid' });
    }
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
        res.status(200).json({ message: 'You are successfully logged in', token: data  });
    } else {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog('Your Google Account does not registered', fullUrl, 'POST', 404);
        res.status(404).json({ message: 'Your Google Account does not registered' });
    }
}

const verifyEmail = async (req, res) => {
    const token = req.params.token;
    await Employee.verifyEmail(token).then(() => {
        console.log('Email verified');
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`);
    }).catch((err) => {
        console.log(err);
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        logger.saveErrorLog(err, fullUrl, 'GET', 500);
        res.status(500).json({ message: 'Internal Server Error' });
    });
}

export default {
    login,
    googleOauth,
    verifyEmail
}