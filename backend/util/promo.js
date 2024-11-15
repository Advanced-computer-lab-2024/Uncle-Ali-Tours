import Tourist from "../models/tourist.model.js";
const { EMAIL } = process.env;
import { sendEmail } from "../util/email.js";

export const checkBD = async () => {
  const tourists = await Tourist.find().select("dateOfBirth email userName promoCodes");

  for (let tourist of tourists) {
    if (tourist.dateOfBirth) {
      const dob = new Date(tourist.dateOfBirth);
      const today = new Date();
      if (
        dob.getMonth() === today.getMonth() &&
        dob.getDay() === today.getDay()+1
      ) {
        const mailOptions = {
            from: EMAIL,
            to: tourist.email,
            subject:"Happy Birthday",
        html:`<h1>Happy Birthday</h1><p>Happy Birthday ${tourist.userName}, here is a little gift</p><p>BD Promo Code: <strong>BD2021</strong></p>`,
      };
        await sendEmail(mailOptions);
        tourist.promoCodes.push("BD2021");
        await tourist.save();
        console.log("first")
      }
    }
  }
};
