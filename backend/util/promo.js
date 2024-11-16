import Tourist from "../models/tourist.model.js";
import Promo from "../models/promo.model.js";
const { EMAIL } = process.env;
import { sendEmail } from "../util/email.js";

export const checkBD = async () => {
  const tourists = await Tourist.find().select(
    "dateOfBirth email userName promoCodes"
  );

  for (let tourist of tourists) {
    if (tourist.dateOfBirth) {
      const dob = new Date(tourist.dateOfBirth);
      const today = new Date()
    //   console.log(dob, dob.getDate(), today, today.getDate());
      if (
        dob.getMonth() === today.getMonth() &&
        dob.getDate() === today.getDate()
      ) {
        const mailOptions = {
          from: EMAIL,
          to: tourist.email,
          subject: "Happy Birthday",
          html: `<h1>Happy Birthday</h1><p>Happy Birthday ${tourist.userName}, here is a little gift</p><p>BD Promo Code: <strong>BD20</strong></p>`,
        };
        if (!tourist.promoCodes) {
            tourist.promoCodes = [];
        }
        const promo = await Promo.findOne({ code: "BD20" }).select("_id");
        if (!promo) {
            const newPromo = new Promo({
                code: "BD20",
                discount: 20,
            });
            await newPromo.save();
            tourist.promoCodes.push(newPromo._id);
            await tourist.save();
            await sendEmail(mailOptions);
          console.log("added new promo");
        } else {
          if (!tourist.promoCodes.includes(promo._id)){
            tourist.promoCodes.push(promo._id);
            await sendEmail(mailOptions);
            await tourist.save();
          console.log("added existing promo");
          }
        }
      }
    }
  }
};
