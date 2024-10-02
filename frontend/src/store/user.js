import {create} from 'zustand';

const addTourGuide = async (newUser) => {
    const res = await fetch("/api/tourGuides", {
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
    const res = await fetch("/api/advertisers", {
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
    const res = await fetch("/api/sellers", {
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
    const res = await fetch("/api/tourists", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
    });
    const body = await res.json();
    return body;
};

export const useUserStore = create((set) => ({
    user: {
        userName: "",
        type: "",
    },
    setUser: (user) => set({user}),
    createUser: async (newUser) => {
        
        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"userName": newUser.userName, "password": newUser.password, "type": newUser.type}),
            });
            const body = await res.json();
            if (!body.success) {
                return body;
            }
            set({user: {"userName": body.data.userName, "type": body.type}});
        
        //     switch (newUser.type) {
        //     case "tour guide":
        //         delete newUser.type;
        //         await addTourGuide(newUser);
        //         break;

        //     case "advertiser":
        //         delete newUser.type;
        //         await addAdvertiser(newUser);
        //         break;

        //     case "seller":
        //         delete newUser.type;
        //         await addSeller(newUser);
        //         break;

        //     case "tourist":
        //         delete newUser.type;
        //         await addTourist(newUser);
        //         break;

        //     default:
        //         return{success: false, message: "Invalid user type."};
        // }

        } catch (error) {

            return{success: false, message: error.message};
            
        }

        

        return{success: true, message: "User created successfully."};
    },
}));