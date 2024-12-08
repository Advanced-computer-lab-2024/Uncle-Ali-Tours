import React, { useEffect } from 'react';
import { useUserStore } from '../store/user';
import { toCamelCase } from '../lib/util';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAdvertiserstore } from '../store/advertiser';
import { useGuideStore } from '../store/tourGuide';
import { useSellerStore } from '../store/seller';
import { useTouristStore } from '../store/tourist';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaFlag, FaBirthdayCake, FaBriefcase } from 'react-icons/fa';
import egypt from '../images/egypt.jpg';

function RegisterPage() {
    const [selectedType, setSelectedType] = React.useState(""); // No pre-selected value
    const [newUser, setNewUser] = React.useState({
        userName: "",
        email: "",
        password: "",
    });
    const [tourist, setTourist] = React.useState({
        userName: "",
        email: "",
        password: "",
        mobileNumber: "",
        nationality: "",
        dateOfBirth: "",
        occupation: "",
    });
    const navigate = useNavigate();

    const { createUser } = useUserStore();
    const { getAdvertiser } = useAdvertiserstore();
    const { getGuide } = useGuideStore();
    const { getSeller } = useSellerStore();
    const { getTourist } = useTouristStore();

    const types = ["tour guide", "advertiser", "seller", "tourist"];

    // Populate newUser with empty fields on mount (default to "tour guide")
    useEffect(() => {
        setNewUser({
            userName: "",
            email: "",
            password: "",
        });
    }, []);

    const handleRegister = async () => {
        let userType = selectedType;
        if (selectedType === "") {
            userType = "tour guide"; // Default type when no selection
        }

        if (userType === "tourist") {
            // Validate tourist fields if necessary
            const { userName, email, password, mobileNumber, nationality, dateOfBirth, occupation } = tourist;
            if (!userName || !email || !password || !mobileNumber || !nationality || !dateOfBirth || !occupation) {
                toast.error("Please fill out all fields for Tourist.", { className: "text-white bg-gray-800" });
                return;
            }

            const passedTourist = { ...tourist, type: "tourist" };
            const { success, message } = await createUser(passedTourist);
            success 
                ? toast.success(message, { className: "text-white bg-gray-800" }) 
                : toast.error(message, { className: "text-white bg-gray-800" });
            
            if (success) {
                await new Promise(r => setTimeout(r, 2000));
                await getTourist({ userName: tourist.userName }, {});
                navigate("/touristProfile");
            }
        } else {
            // Validate newUser fields if necessary
            const { userName, email, password } = newUser;
            if (!userName || !email || !password) {
                toast.error("Please fill out all fields.", { className: "text-white bg-gray-800" });
                return;
            }

            const passedUser = { ...newUser, type: userType };
            const { success, message } = await createUser(passedUser);
            success 
                ? toast.success(message, { className: "text-white bg-gray-800" }) 
                : toast.error(message, { className: "text-white bg-gray-800" });
            
            if (success) {
                await new Promise(r => setTimeout(r, 2000));
                switch (userType) {
                    case "tour guide":
                        await getGuide({ userName: newUser.userName }, {});
                        navigate("/TourGuideProfilePage");
                        break;
                    case "advertiser":
                        await getAdvertiser({ userName: newUser.userName }, {});
                        navigate("/advertiserProfile");
                        break;
                    case "seller":
                        await getSeller({ userName: newUser.userName }, {});
                        navigate("/sellerProfile");
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const touristData = [
        { name: "userName", icon: FaUser, placeholder: "Username" },
        { name: "email", icon: FaEnvelope, placeholder: "Email" },
        { name: "password", icon: FaLock, placeholder: "Password" },
        { name: "mobileNumber", icon: FaPhone, placeholder: "Mobile Number" },
        { name: "nationality", icon: FaFlag, placeholder: "Nationality" },
        { name: "dateOfBirth", icon: FaBirthdayCake, placeholder: "Date of Birth" },
        { name: "occupation", icon: FaBriefcase, placeholder: "Occupation" },
    ];

    const userData = [
        { name: "userName", icon: FaUser, placeholder: "Username" },
        { name: "email", icon: FaEnvelope, placeholder: "Email" },
        { name: "password", icon: FaLock, placeholder: "Password" },
    ];

    return (
        <div style={styles.container} className="relative">
            <Toaster />
            <div style={styles.backgroundOverlay} />
            <img src={egypt} className="fixed top-0 left-0 opacity-[0.3] w-[100vw] h-[100vh] bg-black opacity-200" alt="Background" />
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={styles.registerCard}
            >
                <h2 style={styles.title}>Join U A T</h2>
                <p style={styles.subtitle}>Start your journey with us</p>
                
                {/* Dropdown for selecting user type */}
                <div style={styles.dropdownContainer}>
                    <label htmlFor="userType" style={styles.registerAs}>Register as:</label>
                    <select
                        id="userType"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        style={styles.select}
                        aria-label="Select user type"
                    >
                        <option value="" disabled>Select user type</option> {/* Placeholder option */}
                        {types.map((type) => (
                            <option key={type} value={type}>
                                {toCamelCase(type)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Conditionally render input fields based on selectedType */}
                <div style={styles.inputContainer}>
                    {selectedType === "tourist" ? (
                        touristData.map((data) => (
                            <div key={data.name} style={styles.inputWrapper}>
                                <data.icon style={styles.icon} />
                                <input
                                    style={styles.input}
                                    name={data.name}
                                    value={tourist[data.name]}
                                    onChange={(e) => setTourist({ ...tourist, [e.target.name]: e.target.value })}
                                    placeholder={data.placeholder}
                                    type={data.name === 'password' ? 'password' : (data.name === 'dateOfBirth' ? 'date' : 'text')}
                                />
                            </div>
                        ))
                    ) : (
                        userData.map((data) => (
                            <div key={data.name} style={styles.inputWrapper}>
                                <data.icon style={styles.icon} />
                                <input
                                    style={styles.input}
                                    name={data.name}
                                    value={newUser[data.name]}
                                    onChange={(e) => setNewUser({ ...newUser, [e.target.name]: e.target.value })}
                                    placeholder={data.placeholder}
                                    type={data.name === 'password' ? 'password' : 'text'}
                                />
                            </div>
                        ))
                    )}

                    {/* Sign Up Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={styles.registerButton}
                        onClick={handleRegister}
                    >
                        {selectedType === "tourist" || selectedType === "" ? "Register " : "Register"}
                    </motion.button>
                </div>
            </motion.div>
            <footer style={styles.footer}>
                <p style={styles.footerText}>© {new Date().getFullYear()} U A T. All rights reserved.</p>
            </footer>
        </div>
    )
}

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
    },
    backgroundOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    registerCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '3rem',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '500px',
        zIndex: 1,
    },
    title: {
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
        textAlign: 'center',
        color: '#333',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
    },
    subtitle: {
        fontSize: '1.2rem',
        textAlign: 'center',
        color: '#666',
        marginBottom: '2rem',
    },
    dropdownContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    registerAs: {
        color: '#333',
        fontSize: '1rem',
        marginBottom: '0.5rem',
    },
    select: {
        width: '100%',
        padding: '0.75rem',
        border: '2px solid #ccc',
        borderRadius: '8px',
        fontSize: '1rem',
        appearance: 'none',
        backgroundColor: '#fff',
        backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'%23666\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 1rem center',
        backgroundSize: '1rem',
        cursor: 'pointer',
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        position: 'absolute',
        left: '1rem',
        color: '#666',
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem 0.75rem 3rem',
        border: '2px solid #ccc',
        borderRadius: '8px',
        fontSize: '1rem',
        transition: 'border-color 0.3s ease',
    },
    registerButton: {
        padding: '1rem',
        backgroundColor: '#dc5809',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#000',
        color: '#fff',
        textAlign: 'center',
        padding: '10px',
        fontSize: '14px',
        zIndex: 1000,
    },
    footerText: {
        margin: 0,
    }
};

export default RegisterPage;
