import {create} from 'zustand';
import { deleteUser } from '../../../backend/controllers/user.controller';


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
        userName: "dds",
        type: "tourist",
    }, 
    setUser: (user) => set({user}),
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
                body: JSON.stringify({"userName": newUser.userName, "password": newUser.password, "type": type}),
            });
            const body = await res.json();
            if (!body.success) {
                return body;
            }
            set({user: {"userName": body.data.userName, "type": body.data.type}});
        

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
    }
    
    
}));