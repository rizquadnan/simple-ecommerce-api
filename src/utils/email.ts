import nodemailer from "nodemailer";
import config from "config";
import pug from "pug";
import { convert } from "html-to-text";
import { Prisma } from "@prisma/client";
import { resolve } from "path";

const smtp = config.get<{
  host: string;
  port: number;
  user: string;
  pass: string;
}>("smtp");

export default class Email {
  #firstName: string;
  #to: string;
  #from: string;
  constructor(private user: Prisma.usersCreateInput, private url: string) {
    this.#firstName = user.name.split(" ")[0];
    this.#to = user.email;
    this.#from = `Simple ECommerce <admin@admin.com>`;
  }

  private newTransport() {
    return nodemailer.createTransport({
      ...smtp,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });
  }

  private async send(template: string, subject: string) {
    try {
      // Generate HTML template based on the template string
      const html = pug.renderFile(
        resolve(`${__dirname}/../views/${template}.pug`),
        {
          firstName: this.#firstName,
          subject,
          url: this.url,
        }
      );

      // Create mailOptions
      const mailOptions = {
        from: this.#from,
        to: this.#to,
        subject,
        text: convert(html),
        html,
      };

      // Send email
      const info = await this.newTransport().sendMail(mailOptions);
      console.log(nodemailer.getTestMessageUrl(info));
      return nodemailer.getTestMessageUrl(info);
    } catch (error) {
      console.error("Error during send mail :", error);
      return null;
    }
  }

  async sendVerificationCode() {
    return await this.send(
      "verificationCode",
      "Your account verification code"
    );
  }

  async sendPasswordResetToken() {
    await this.send(
      "resetPassword",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
}
