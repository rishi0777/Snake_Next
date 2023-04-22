import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { HTML_TEMPLATE } from "./Template";

const sendEmail = async (username: string, userEmail: string) => {
  // const { FROM_EMAIL, GMAIL_APP_PASSWORD } = process.env;
  const FROM_EMAIL = "";
  const GMAIL_APP_PASSWORD = "";
  // const GMAIL_APP_PASSWORD = "testing";

  let config = {
    service: "gmail",
    auth: {
      user: FROM_EMAIL,
      pass: GMAIL_APP_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);

  let message = {
    from: FROM_EMAIL, // sender address
    to: FROM_EMAIL,
    userEmail, // list of receivers
    subject: `Contacted From ${userEmail}`,
    text: ``,
    html: HTML_TEMPLATE(username, userEmail),
    attachments: [
      {
        filename: "getInTouch.png",
        path: __dirname + "@public/assets/mail_template_images/getInTouch.png",
        cid: "getInTouch",
      },
      {
        filename: "youtube.png",
        path: __dirname + "@public/assets/mail_template_images/youtube.png",
        cid: "youtube",
      },
      {
        filename: "twitter.png",
        path: __dirname + "@public/assets/mail_template_images/twitter.png",
        cid: "twitter",
      },
      {
        filename: "instagram.png",
        path: __dirname + "@public/assets/mail_template_images/instagram.png",
        cid: "instagram",
      },
    ],
  };

  await transporter
    .sendMail(message)
    .then((res: any) => {
      // console.log("RESPONSE", res);
    })
    .catch((err: any) => {
      console.log("ERROR", err);
      throw Error;
    });
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, userEmail } = req.body;
  sendEmail(username, userEmail)
    .then(() => {
      res.status(200).json({ submitted: true });
    })
    .catch((err) => {
      res.status(404).json({ submitted: false });
    });
}
