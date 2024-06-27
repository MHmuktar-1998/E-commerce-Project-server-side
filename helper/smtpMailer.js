

const nodemailer = require("nodemailer");
const { smtpUserEmail, smtpUserPassword } = require("../secret");


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: smtpUserEmail,
    pass: smtpUserPassword,
  },
});

const smtpMailerSend=async(emailData)=>{
  try {
    const mailOptions ={
        from: smtpUserEmail, // sender address
        to: emailData.email, // list of receivers
        subject: emailData.subject, // Subject line
        html: emailData.html, // html body
       };
       const info = await transporter.sendMail(mailOptions);
       console.log('message sent : %s' , info.response);
  } catch (error) {
    console.error('failed sent mail',error);
    throw error;
  }
}

module.exports = smtpMailerSend;