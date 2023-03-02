// import necessary libraries
import nodemailer from 'nodemailer';

const sendEmail = async (data) => {
  try {
    // set up transporter object
    // use MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS from .env file
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER, // generated ethereal user
        pass: process.env.MAIL_PASS // generated ethereal password
      }
    });

    // send email
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: data.to,
      subject: data.subject,
      html: data.body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent`);
    return info.response;

  } catch (error) {
    console.error(error);
    return error;
  }
}

export default sendEmail;