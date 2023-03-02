const mailWelcome = (name, username, password, code = 123) => {
    const hostVerify = `${process.env.HOST_URL}/auth/verify`;

    return `
        <h1>Welcome to my company</h1>
        <p>Hi <span style="font-weight: bold;">${name}</span>,</p>
        <p>Thank you for registering on our platform. Here are your login credentials:</p>
        <p>Username: ${username} <br /> Password: ${password}</p>
        <p>Use this button to verify your account: </p>
        <a href="${hostVerify}?code=${code}" style="text-decoration: none; color: #fff; background-color: #007bff; border-color: #007bff; padding: 0.375rem 0.75rem; font-size: 1rem; line-height: 1.5; border-radius: 0.25rem; display: inline-block; font-weight: 400; text-align: center; white-space: nowrap; vertical-align: middle; user-select: none; border: 1px solid transparent;">
            Verify
        </a>
        <p>Or use this link: <a href="${hostVerify}?code=${code}">${hostVerify}?code=${code}</a></p>
        <p>Best regards,</p>
        <span style="font-weight: bold;">WGS Absence</span>
    `;
};

export default mailWelcome;