import { BACKEND_URL, APP_NAME } from "../config.js";

const mailWelcome = (name, username, password, code = 123) => {
    const hostVerify = `${BACKEND_URL}/auth/verify`;
    const host = `${APP_NAME}`;

    return `
        <h1>Welcome to ${host}</h1>
        <p>Hi <span style="font-weight: bold;">${name}</span>,</p>
        <p>Thank you for the cooperation. Here are your login credentials:</p>
        <p>Username: ${username} <br /> Password: ${password}</p>
        <p>Use this button to verify your account: </p>
        <a href='${hostVerify}?code=${code}' style="text-decoration: none; color: #fff; background-color: #007bff; border-color: #007bff; padding: 0.375rem 0.75rem; font-size: 1rem; line-height: 1.5; border-radius: 0.25rem; display: inline-block; font-weight: 400; text-align: center; white-space: nowrap; vertical-align: middle; border: 1px solid transparent; cursor: pointer;">
            Verify
        </a>
        <p>Or use this link: <a href='${hostVerify}?code=${code}'>${hostVerify}?code=${code}</a></p>
        <p>Best regards,</p>
        <span style="font-weight: bold;">WGS Absence</span>
    `;
};

export default mailWelcome;