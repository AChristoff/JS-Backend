const nodemailer = require("nodemailer");

module.exports = (req, res) => {

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
        subject: 'NodeMailer',
        html: "<b>Hello from Rest API?</b>",
    };


    transporter.sendMail(mailOptions)
        .then(() => {

            res.status(200).json({
                message: 'Mail successfully send!',
            });
        })
        .catch((error) => {

            res.status(400).json({
                message: 'Mail error!',
                error
            });
        });
};