const nodemailer = require("nodemailer");

module.exports = () => {

    let transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
            user: process.env.MAIL_NAME,
            pass: process.env.MAIL_PASSWORD,
        }
    });

    let mailOptions = {
        from: process.env.MAIL_NAME,
        to: process.env.MAIL_NAME,
        subject: 'Mailer',
        html: "<b>Hello from Rest API?</b>",
    };


    transporter.sendMail(mailOptions)
        .then(() => {
            console.log('Mail send!');
        })
        .catch((err) => {
            console.error(err);
        });
};