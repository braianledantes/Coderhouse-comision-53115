const nodemailer = require('nodemailer')

const sendEmail = async ({ email, subject, text }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: process.env.GMAIL_ACCOUNT,
            pass: process.env.GMAIL_PASSWORD
        }
    })

    await transporter.sendMail({
        from: process.env.GMAIL_ACCOUNT,
        to: email,
        subject: subject,
        text: text
    })
}

module.exports = { sendEmail }