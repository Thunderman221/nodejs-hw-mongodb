import nodemailer from 'nodemailer';
import { SMTP } from '../constants/index.js';

const sendMail = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    host: SMTP.SMTP_HOST,
    port: SMTP.SMTP_PORT,
    auth: {
      user: SMTP.SMTP_USER,
      pass: SMTP.SMTP_PASSWORD,
    },
  });

  return transporter.sendMail(mailOptions);
};

export default sendMail;
