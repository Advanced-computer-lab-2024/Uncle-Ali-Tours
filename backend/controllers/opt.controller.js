import OTP from "../models/otp.model.js";
import { sendEmail } from "../util/email.js";
const { EMAIL } = process.env;
const generateOTP = () => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  } catch (error) {
    console.log(error);
  }
};

const sendOTP = async ({ email, subject, message, duration = 1 }) => {
  try {
    if (!email || !subject || !message) {
      throw new Error("Please provide all the required fields");
    }
    await OTP.deleteOne({ email });

    const otp = generateOTP();

    const mailOptions = {
      from: EMAIL,
      to: email,
      subject,
      html:`<p>${message}</p><h1>${otp}</h1>`,
    };
    const { success, message: emailMessage } = await sendEmail(mailOptions);
    if (!success) {
      throw new Error(emailMessage);
    }
    const newOTP = new OTP({
      email,
      otp,
      expiry: Date.now() + duration * 3600000,
    });
    const createdOTP = await newOTP.save();
    return createdOTP;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const handleOTP = async (req, res) => {
  try {
    const { email, subject, message, duration } = req.body;
    const otp = await sendOTP({ email, subject, message, duration });
    res.status(200).json({success:true, data: otp });
  } catch (error) {
    res.status(500).json({success:false, message: error.message });
  }
};
