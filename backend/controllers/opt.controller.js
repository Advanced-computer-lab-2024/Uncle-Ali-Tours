import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";
import { sendEmail } from "../util/email.js";
import { hash, compare } from "../util/hash.js";
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
    const hashedOTP = await hash(otp);
    const newOTP = new OTP({
      email: email,
      otp: hashedOTP,
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
    console.log(email);
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const otp = await sendOTP({ email, subject, message, duration });
    res.status(200).json({success:true, data: otp });
  } catch (error) {
    res.status(500).json({success:false, message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const userOTP = await OTP.findOne({ email });
        if (!email) {
            throw new Error("OTP request not found");
        }
        if (!userOTP) {
            throw new Error("OTP request not found");
        }
        const {expiry, otp: hashedOTP} = userOTP;
        const match = await compare(otp, hashedOTP);
        if (expiry < Date.now()) {
            OTP.deleteOne({ email });
            throw new Error("OTP expired");
        }
        if (!match) {
            throw new Error("Invalid OTP");
        }
        const isValid = compare(otp, hashedOTP);
        await OTP.deleteOne({ email });
        if (!isValid) {
            throw new Error("Invalid OTP");
        }
        res.status(200).json({ success: true, message: "OTP verified successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
