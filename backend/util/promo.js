import Tourist from "../models/tourist.model.js";
import Notification from "../models/notification.model.js";
import Promo from "../models/promo.model.js";
const { EMAIL } = process.env;
import { sendEmail } from "../util/email.js";

export const checkBD = async () => {
  const tourists = await Tourist.find({userName: "todaysuser"}).select(
    "dateOfBirth email userName promoCodes"
  );

	console.log(tourists);

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
						if (!tourist.notifications) {
							tourist.notifications = [];
						}
						const notification = new Notification({
							userName: tourist.userName,
							title: "Birthday Promo",
							message: "You have received a birthday promo code, check it out!",
							link: "/" // link to promo page
						});
						await notification.save();
						tourist.notifications.push(notification._id);
            await sendEmail(mailOptions);
            await tourist.save();
          console.log("added existing promo");
          }
        }
      }
    }
  }
};
