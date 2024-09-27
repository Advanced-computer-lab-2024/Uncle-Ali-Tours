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

export const useUserStore = create((set) => ({
    user: {
        userName: "",
        type: "",
    },
    setUser: (user) => set({user}),
    createUser: async (newUser) => {
        if(!newUser.userName || !newUser.email || !newUser.password) {
            return{success: false, message: "Please fill all fields."};
        }
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
                return{success: false, message: body.message};
            }
            set({user: {"userName": body.data.userName, "type": body.type}});

            // switch (newUser.type) {
        //     case "tour guide":
        //         await addTourGuide(newUser);
        //         break;

        //     case "advertiser":
        //         await addAdvertiser(newUser);
        //         break;

        //     case "seller":
        //         await addSeller(newUser);
        //         break;

        //     default:
        //         return{success: false, message: "Invalid user type."};
        // }

        } catch (error) {

            return{success: false, message: "error.message"};
            
        }

        

        return{success: true, message: "User created successfully."};
    },
}));