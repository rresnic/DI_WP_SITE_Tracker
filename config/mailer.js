const nodemailer = require('nodemailer');
require("dotenv").config();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // Or another SMTP server
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", 
  auth: {
    user: process.env.SMTP_USERNAME, 
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
    }
});

module.exports = transporter;