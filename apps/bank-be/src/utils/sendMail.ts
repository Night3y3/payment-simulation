import nodemailer from "nodemailer";

const sendMail = async (email: string, verificationLink: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email as unknown as string,
      subject: "Verify your email address",
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email address.</p>`,
    });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export default sendMail;
