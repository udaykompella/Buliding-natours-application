const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

// new Email(user,url).sendWelcome()
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Uday Mani Kumar <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async send(template, subject) {
    //send the actual email
    //1) Render html based on pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    //2)Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    //3) Create a transport and send email

    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send("welcome", "Welcome to the Natours Family");
  }
};



