const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");
const Transport = require("nodemailer-brevo-transport");

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
      // console.log(process.env.BREVO_USERNAME);
      // return nodemailer.createTransport({
      //   service:'SendinBlue',
      //   auth:{
      //     user: process.env.BREVO_USERNAME,
      //     pass:process.env.BREVO_PASSWORD
      //   }
      // })
      const transporter = nodemailer.createTransport(
        new Transport({ apiKey: process.env.BREVO_PASSWORD })
      );
      return transporter;
    }
  }
  async send(template, subject) {
    //send the actual email
    //1) Render html based on pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    // console.log(html);

    //2)Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    //3) Create a transport and send email

    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send("welcome", "Welcome to the Natours Family");
  }
  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token valid for only 10 minutes"
    );
  }
};



