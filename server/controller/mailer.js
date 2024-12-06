// import nodemailer from "nodemailer";
// import Mailgen from "mailgen";

// import ENV from "../config.js";

const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const ENV = require("../config.js");

let nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: ENV.EMAIL,
    pass: ENV.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

let transporter = nodemailer.createTransport(nodeConfig);
let mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});
const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  // body of the email..
  var email = {
    body: {
      name: username,
      intro: text || "Email for OTP verification",
      outro: "Testing",
    },
  };

  var emailBody = mailGenerator.generate(email);

  let message = {
    from: ENV.EMAIL,
    to: [userEmail], // Ensure userEmail is an array
    subject: subject || "Signup Successful",
    html: emailBody,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(200)
        .send({ msg: "You should receive an email from us Soon" });
    })
    .catch((error) => {
      console.error("Error sending email:", error);
      return res.status(500).send({ error: "Failed to send email" });
    });
};

module.exports = { registerMail };
