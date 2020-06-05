const nodemailer = require("nodemailer");

module.exports = (req, res, to, resetLink) => {

    let transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
            user: process.env.MAIL_NAME,
            pass: process.env.MAIL_PASSWORD,
        }
    });

    let mailOptions = {
        from: process.env.MAIL_NAME,
        to,
        subject: 'Reset your Rest API password',
        html: `<p style="font-size:26px;
                   font-weight:600;
                   font-family:Helvetica, Arial;
                   color:#374957;
                   margin:0;
                   padding:0;
                   line-height:150.0%;
                   text-align:left;">
                   Forgot your password?
               </p>
               
               <p style="font-size:22px;
                  color:#374957;
                  font-family:Helvetica, Arial;
                  margin: 4px 0 0 0;
                  text-align:left;">
                  Don't worry, I got you covered!
               </p>
               
               <p style="margin:24px 0;
                  text-align:left;
                  padding:0;
                  color:#5f7d95;
                  font-family:Helvetica, Arial;
                  font-size:16px;
                  line-height:150.0%;">
                  
                   <a  href="${resetLink}"
                       style="background-color:#4ad295;
                       color:#ffffff;
                       font-family:Helvetica, Arial;
                       text-decoration:none;
                       height:44px;
                       line-height:44px;
                       display:inline-block;
                       padding:0 15px;
                       border-radius:3px;
                       font-weight:600;" 
                       target="_blank">
                       Reset my password
                   </a>
                   
               </p>

               <p style="font-size: 17px;color:#374957;margin:10px 0;text-align:left;">
                  This link will be active for the next 24h.
               </p>`,
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