const nodemailer = require("nodemailer");
const i18n = require("i18n");

const { emailConfig, frontendUrl } = require("../../config/vars");

const transporterData = emailConfig.service
  ? {
      service: emailConfig.service
    }
  : {
      port: emailConfig.port,
      host: emailConfig.host,
      secure: false
    };

const transporter = nodemailer.createTransport({
  ...transporterData,
  auth: {
    user: emailConfig.username,
    pass: emailConfig.password
  }
});

// verify connection configuration
transporter.verify(error => {
  if (error) {
    console.log("error with email connection");
  }
});

const sendEmail = async (data, callback) => {
  const mailOptions = {
    from: `${emailConfig.fromName} <${emailConfig.from}>`,
    to: `${data.user.name} <${data.user.email}>`,
    subject: data.subject,
    html: data.htmlMessage
  };
  transporter.sendMail(mailOptions, err => {
    if (err) {
      return callback(false);
    }
    return callback(true);
  });
};

exports.sendRegistration = async (locale, user) => {
  i18n.setLocale(locale);
  const subject = i18n.__("registration.SUBJECT");
  const htmlMessage = i18n.__("registration.MESSAGE", user.name, frontendUrl);
  const data = {
    user,
    subject,
    htmlMessage
  };
  sendEmail(data, messageSent =>
    messageSent
      ? console.log(`Email SENT to: ${user.email}`)
      : console.log(`Email FAILED to: ${user.email}`)
  );
};

exports.sendPasswordReset = async (locale, user, passwordResetObject) => {
  i18n.setLocale(locale);
  const subject = i18n.__("forgotPassword.SUBJECT");
  const htmlMessage = i18n.__(
    "forgotPassword.MESSAGE",
    user.email,
    frontendUrl,
    passwordResetObject.verification
  );
  const data = {
    user,
    subject,
    htmlMessage
  };
  sendEmail(data, messageSent =>
    messageSent
      ? console.log(`Email SENT to: ${user.email}`)
      : console.log(`Email FAILED to: ${user.email}`)
  );
};
