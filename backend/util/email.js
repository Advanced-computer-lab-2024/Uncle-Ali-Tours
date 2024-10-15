import nodemailer from 'nodemailer';
const {EMAIL, EMAIL_PASSWORD} = process.env;
console.log(EMAIL, EMAIL_PASSWORD);
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },

});

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take messages");
        console.log(success);
    }
});

export const sendEmail = async (mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        return {success: true, message: "Email sent successfully"};
    } catch (error) {
        return {success: false, message: error.message};
    }
};