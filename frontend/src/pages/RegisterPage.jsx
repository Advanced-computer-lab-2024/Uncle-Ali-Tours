import React from 'react';
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
    const [acceptTerms, setAcceptTerms] = React.useState(false);  // New state for terms acceptance
    const [activeTab, setActiveTab] = React.useState('user');
    const [newUser, setNewUser] = React.useState({
        userName: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const [tourist, setTourist] = React.useState({
        userName: "",
        email: "",
        password: "",
        mobileNumber: "",
        nationality: "",
        dateOfBirth: "",
        occupation: "",
    });

    const {createUser} = useUserStore();
    const {getAdvertiser} = useAdvertiserstore();
    const {getGuide} = useGuideStore();
    const {getSeller} = useSellerStore();
    const {getTourist} = useTouristStore();

    const handleAddUser = async function(type) {
        const passedUser = newUser
        passedUser.type = type
        const {success, message} = await createUser(passedUser);
        success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
        if (success) {
            await new Promise(r => setTimeout(r, 2000));
            switch (type) {
                case "tour guide":
                    await getGuide({userName : newUser.userName}, {});
                    navigate("/TourGuideProfilePage");
                    break;
                case "advertiser":
                    await getAdvertiser({userName : newUser.userName}, {});
                    navigate("/advertiserProfile");
                    break;
                case "seller":
                    await getSeller({userName : newUser.userName}, {});
                    navigate("/sellerProfile");
                    break;
                default:
                    break;
            }
        }
    }

    const handleAddTourist = async function() {
        const passedTourist = tourist
        passedTourist.type = "tourist"
        const {success, message} = await createUser(passedTourist);
        success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
        if (success) {
            await new Promise(r => setTimeout(r, 2000));
            await getTourist({userName : tourist.userName}, {});
            navigate("/touristProfile");
        }
    }

    const types = ["tour guide", "advertiser", "seller"];
    
    const touristData = [
        { name: "userName", icon: FaUser, placeholder: "Username" },
        { name: "email", icon: FaEnvelope, placeholder: "Email" },
        { name: "password", icon: FaLock, placeholder: "Password" },
        { name: "mobileNumber", icon: FaPhone, placeholder: "Mobile Number" },
        { name: "nationality", icon: FaFlag, placeholder: "Nationality" },
        { name: "dateOfBirth", icon: FaBirthdayCake, placeholder: "Date of Birth" },
        { name: "occupation", icon: FaBriefcase, placeholder: "Occupation" },
    ];

    return (
        <div style={styles.container} className="relative">
            <Toaster />
            <div style={styles.backgroundOverlay} />
            <img src={egypt} className="fixed top-0 left-0 opacity-[0.3] w-[100vw] h-[100vh] bg-black opacity-200"/>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={styles.registerCard}
            >
                <h2 style={styles.title}>Join U A T</h2>
                <p style={styles.subtitle}>Start your journey with us</p>
                
                <div style={styles.tabContainer}>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={activeTab === 'user' ? styles.activeTab : styles.inactiveTab}
                        onClick={() => setActiveTab('user')}
                    >
                        User
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={activeTab === 'tourist' ? styles.activeTab : styles.inactiveTab}
                        onClick={() => setActiveTab('tourist')}
                    >
                        Tourist
                    </motion.button>
                </div>

                {activeTab === 'user' && (
                    <div style={styles.inputContainer}>
                        <div style={styles.inputWrapper}>
                            <FaUser style={styles.icon} />
                            <input 
                                style={styles.input}
                                name='userName'
                                value={newUser.userName}
                                onChange={(e) => setNewUser({ ...newUser, userName: e.target.value})}
                                placeholder='Username'
                                type='text'
                            />
                        </div>
                        <div style={styles.inputWrapper}>
                            <FaEnvelope style={styles.icon} />
                            <input 
                                style={styles.input}
                                name='email'
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value})}
                                placeholder='Email'
                                type='email'
                            />
                        </div>
                        <div style={styles.inputWrapper}>
                            <FaLock style={styles.icon} />
                            <input 
                                style={styles.input}
                                name='password'
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value})}
                                placeholder='Password'
                                type='password'
                            />
                        </div>
                        <p style={styles.registerAs}>Register as:</p>
                        <div style={styles.buttonContainer}>
                            {types.map((type) => (
                                <motion.button
                                    key={type}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={styles.registerButton}
                                    onClick={() => handleAddUser(type)}
                                    disabled={!acceptTerms}  // Disable button if terms are not accepted
                                >
                                    {type}
                                </motion.button>
                            ))}
                        </div>

                        {/* Terms Acceptance Section */}
                        <div style={styles.termsWrapper}>
                            <input 
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={() => setAcceptTerms(!acceptTerms)} 
                                style={styles.checkbox}
                            />
                            <span style={styles.termsText}>
                                I accept the 
                                <a href="/terms-and-conditions" style={styles.termsLink}> Terms and Conditions</a>
                            </span>
                        </div>
                    </div>
                )}

                {activeTab === 'tourist' && (
                    <div style={styles.inputContainer}>
                        {touristData.map((data) => (
                            <div key={data.name} style={styles.inputWrapper}>
                                <data.icon style={styles.icon} />
                                <input
                                    style={styles.input}
                                    name={data.name}
                                    value={tourist[data.name]}
                                    onChange={(e) => setTourist({ ...tourist, [e.target.name]: e.target.value })}
                                    placeholder={data.placeholder}
                                    type={data.name === 'password' ? 'password' : 'text'}
                                />
                            </div>
                        ))}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={styles.registerButton}
                            onClick={handleAddTourist}
                            disabled={!acceptTerms}  // Disable button if terms are not accepted
                        >
                            Register as Tourist
                        </motion.button>
                    </div>
                )}
            </motion.div>
            <footer style={styles.footer}>
                <p style={styles.footerText}>© {new Date().getFullYear()} All Rights Reserved</p>
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
    tabContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem',
    },
    activeTab: {
        padding: '0.5rem 1rem',
        backgroundColor: '#dc5809',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
        marginRight: '1rem',
    },
    inactiveTab: {
        padding: '0.5rem 1rem',
        backgroundColor: 'transparent',
        color: '#dc5809',
        border: '2px solid #dc5809',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
        marginRight: '1rem',
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
        padding: '1rem 1rem 1rem 3rem',
        border: '2px solid #ccc',
        borderRadius: '8px',
        fontSize: '1rem',
        transition: 'border-color 0.3s ease',
    },
    registerAs: {
        color: '#333',
        fontSize: '1rem',
        textAlign: 'center',
        marginBottom: '0.5rem',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
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
    },
    termsWrapper: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    checkbox: {
        marginRight: '0.5rem',
    },
    termsText: {
        fontSize: '0.9rem',
        color: '#333',
    },
    termsLink: {
        color: '#dc5809',
        textDecoration: 'underline',
    },
};

export default RegisterPage;
