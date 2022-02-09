const nodemailer = require("nodemailer");

const emailHelper = async (options)=>{
    // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'rohokalepranit@gmail.com', // sender address
    to: options.toEmail, // list of receivers
    subject: options.subject, // Subject line
    text: options.text, // plain text body
  });
}

module.exports = emailHelper