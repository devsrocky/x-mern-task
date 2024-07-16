
const nodemailer = require('nodemailer')
const SendEmailUtility = async (MailTo, Subject, Text) => {
    let transporter = nodemailer.createTransport({
        host: 'mail.wp-codestudio.com',
        port: 465,
        secure: true,
        auth: {
            user: 'email@wp-codestudio.com',
            pass: '$yM.ANKa;6fz'
        },tls: {
            rejectUnauthorized: false
        }
    })
    let EmailOtpion = {
        from: 'Task Manager <email@wp-codestudio.com>',
        to: MailTo,
        subject: Subject,
        text: Text
    }

    return await transporter.sendMail(EmailOtpion)
}
module.exports = SendEmailUtility