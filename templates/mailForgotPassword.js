const mailForgotPassword = (token) => {
    const hostVerify = `${process.env.HOST_URL}/auth/verify`;
    const host = `${process.env.APP_NAME}`;

    return `
    <div style="background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: #fff; padding: 20px; border-radius: 5px;">
            <h1 style="text-align: center; color: #2c3e50;">${host}</h1>
            <p style="text-align: center; color: #2c3e50;">Hi,</p>
            <p style="text-align: center; color: #2c3e50;">You have requested to reset your password. Please click the button below to reset your password.</p>
            <div style="text-align: center;">
                <a href="${hostVerify}?code=${token}" style="background-color: #2c3e50; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Reset Password</a>
            </div>
            <p style="text-align: center; color: #2c3e50;">If you did not request to reset your password, please ignore this email.</p>
            <p style="text-align: center; color: #2c3e50;">Thank you.</p>
        </div>
    </div>
    `
}
    