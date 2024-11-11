import {create} from 'zustand';
import { deleteUser } from '../../../backend/controllers/user.controller';
import ChangePassword from '../pages/ChangePassword';


export const fetchComplaints = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/complaint');
        const result = await response.json();
        
        if (response.ok) {
            console.log("Fetched complaints from API:", result.data); // Log to verify data structure
            return result.data; // Ensure the structure matches expected data
        } else {
            console.error("Error fetching complaints:", result.message);
            return [];
        }
    } catch (error) {
        console.error("Error fetching complaints:", error);
        return [];
    }
};


const addTourGuide = async (newUser) => {
    const res = await fetch("/api/tourGuide", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
    });
    const body = await res.json();
    return body;
};

const addAdvertiser = async (newUser) => {
    const res = await fetch("/api/advertiser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
    });
    const body = await res.json();
    return body;
};

const addSeller = async (newUser) => {
    const res = await fetch("/api/seller", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
    });
    const body = await res.json();
    return body;
};


const addTourist = async (newUser) => {
    const res = await fetch("/api/tourist", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
    });
    const body = await res.json();
    return body;
};


const deleteTourGuide = async (userName) => {
    console.log(userName);
    const res = await fetch("/api/tourGuide", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({userName}),
    });
    const body = await res.json();
    return body;
}

const deleteAdvertiser = async (userName) => {
    const res = await fetch("/api/advertiser", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({userName}),
    });
    const body = await res.json();
    return body;
}

const deleteSeller = async (userName) => {
    const res = await fetch("/api/seller", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({userName}),
    });
    const body = await res.json();
    return body;
}

const deleteTourist = async (userName) => {
    const res = await fetch("/api/tourist", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({userName}),
    });
    const body = await res.json();
    return body;
}

export const useUserStore = create((set) => ({
    user: {
        userName: "",
        type: "",
        chosenCurrency:"",
        currencyRate:1,
    }, 
    setUser: (user) => set({user:user}),
    createUser: async (newUser = {}) => {
        let typeRes;
        const type = newUser.type;
        delete newUser.type;
        switch (type) {
                case "tour guide":
                    delete newUser.type;
                    typeRes = await addTourGuide(newUser);
                    break;
    
                case "advertiser":
                    typeRes = await addAdvertiser(newUser);
                    break;
    
                case "seller":
                    typeRes = await addSeller(newUser);
                    break;
    
                case "tourist":
                    typeRes = await addTourist(newUser);
                    break;

                case "admin":
                    typeRes = {success: true};
                    break;
                 case "governor":
                    typeRes = {success: true};
                    break;
    
                default:
                    return{success: false, message: "Invalid user type."};
            }

            if (!typeRes.success) {
                return typeRes;
            }
        
        try {
            const res = await fetch("/api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"userName": newUser.userName, "password": newUser.password, "type": type, "email": newUser.email}),
            });
            const body = await res.json();
            if (!body.success) {
                return body;
            }
            localStorage.setItem("user", JSON.stringify({"userName": body.data.userName, "type": body.data.type ,"chosenCurrency":"EGP" ,"currencyRate":1}));
            set({user: {"userName": body.data.userName, "type": body.data.type , "chosenCurrency":"EGP" ,"currencyRate":1 }});

        } catch (error) {

            return{success: false, message: error.message};
            
        }

        
        return{success: true, message: "User created successfully."};
    },
    deleteUser: async (userName, type) => {
        let typeRes;
      try{
            
            switch (type) {
                case "tour guide":
                    typeRes = await deleteTourGuide(userName);
                    break;
                case "advertiser":
                    typeRes = await deleteAdvertiser(userName);
    break;
                case "seller":
                    typeRes = await deleteSeller(userName);
    break;
                case "tourist":
                    typeRes = await deleteTourist(userName);
                    break;
                default:
                    break;
            }
            if(!typeRes.success){
                return typeRes;
            }
            const res = await fetch('/api/user',{
                method : "DELETE",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({userName:userName})
            });

            const body = await res.json();
            if (!body.successs) {
                return body;
            }

            return { success: true, message: "User deleted successfully" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },
    login:  async (credentials = {}) => {
        try {
            const res = await fetch("/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });
            const body = await res.json();
            if (!body.success) {
                return body;
            }
            console.log(body.data[0]);
            set({user: {"userName": body.data[0].userName, "type": body.data[0].type , "chosenCurrency": body.data[0].chosenCurrency || "EGP", "currencyRate": body.data[0].currencyRate || 1 }});
            localStorage.setItem("user", JSON.stringify({"userName": body.data[0].userName, "type": body.data[0].type , "chosenCurrency": body.data[0].chosenCurrency || "EGP", "currencyRate": body.data[0].currencyRate || 1}));
            return {success: true, message: "Login successful.", type: body.data[0].type};
        } catch (error) {
            return {success: false, message: error.message};
        }
    },
    logout: () => {
        set({user: {userName: "", type: ""}});
        localStorage.removeItem("user");
    },

    changePassword: async ({userName = "",oldPassword = "", newPassword = "", forgot = false, email = ""}) => {
        console.log(forgot);
        try {
            const res = await fetch("/api/user/changePassword", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({userName: userName, oldPassword:oldPassword, newPassword:newPassword, forgot:forgot, email:email}),
            });
            const body = await res.json();
            return body;
        } catch (error) {
            return {success: false, message: error.message};
        }
    },

    forgetPassword: async (email) => {
        try {
            const res = await fetch("/api/otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email: email, subject: "Password Reset", message: "Your OTP is: "}),
            });
            const body = await res.json();
            if (!body.success) {
                return body;
            }
            return {success: true, message: "OTP sent successfully."};
        } catch (error) {
            return {success: false, message: error.message};
        }
    },

    

    verifyOTP: async (email, otp) => {
        try {
            const res = await fetch("/api/otp/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email: email, otp: otp}),
            });
            const body = await res.json();
            return body;
        } catch (error) {
            return {success: false, message: error.message};
        }
    },
    
    
}));