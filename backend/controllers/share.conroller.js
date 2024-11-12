const { EMAIL } = process.env;
import { sendEmail } from "../util/email.js";
export const shareViaMail = async(req,res)=>{
    try {
        const { email, link, userName } = req.body;
        if(!email){
            return  res.status(400).json({success:false, message :"you must enter the email"});
        }
        if( !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ){
            return res.status(400).json({success:false, message: 'email format is wrong' });
        }
        const mailOptions = {
            from: EMAIL,
            to: email,
            subject:"shard link",
        html:`<h1>you have recived a link from ${userName}</h1><p>${link}</p>`,
      };
      const { success, message: emailMessage } = await sendEmail(mailOptions);
      if(success){
        return res.status(200).json({success:true, message : "Sent successfuly"});
    }
    return  res.status(500).json({success:false, message :"problem happend while sending the email"});
} catch (error) {
    return  res.status(500).json({success:false, message :"problem happend while sending the email"});
}
      
}