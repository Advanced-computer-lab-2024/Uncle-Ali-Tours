import React from 'react'
import { useState, useEffect } from 'react'
import { useUserStore } from '../store/user'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useGuideStore } from "../store/tourGuide";
import { useSellerStore } from "../store/seller";
import { useTouristStore } from "../store/tourist";
import { useAdvertiserstore } from "../store/advertiser";
import ForgotPassword from '../components/ForgotPassword';
import VerifyOTP from '../components/VerifyOTP';
import { motion } from 'framer-motion';
import egypt from '../images/egypt.jpg';

import { FaPlane, FaHotel, FaUmbrellaBeach, FaPassport } from 'react-icons/fa';

function LoginPage() {
  const [credentials, setCredentials] = useState({
    userName: '',
    password: ''
  })
    const [email, setEmail] = useState('')
  const [forgotPassword, setForgotPassword] = useState(false)
  const [visVerify, setVisVerify] = useState(false)
  const {login, forgetPassword: forget} = useUserStore()
  const { getGuide } = useGuideStore();
  const { getSeller } = useSellerStore();
  const { getTourist } = useTouristStore();
  const { getAdvertiser } = useAdvertiserstore();
  const navigate = useNavigate()
  const hideTab = (n = 1) => {
    if (n === 1)
      setForgotPassword(false)
    else
      setVisVerify(false)
  }
  const redirect = async (type) => {
    switch (type) {
      case "tour guide":
        await getGuide({userName : credentials.userName},{});
        navigate("/TourGuideProfilePage");
        break;
      case "advertiser":
        await getAdvertiser({userName : credentials.userName},{});
        navigate("/advertiserProfile");
        break;
      case "seller":
        await getSeller({userName : credentials.userName},{});
        navigate("/sellerProfile");
        break;
      case "tourist":
        getTourist({userName : credentials.userName},{});
        navigate("/touristProfile");
        break;
      case "admin":
        navigate("/admin");
        break;

      case "governor":
        navigate("/attraction");
        break;
    
      default:
        break;
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };
  
  useEffect(() => {
    localStorage.removeItem('email')
    document.addEventListener("keydown", handleKeyPress, false);
    return () => {
      document.removeEventListener("keydown", handleKeyPress, false);
    };
  }, [handleKeyPress]);

  const handleSignUp = () => {
    navigate('/register');
  };
  const handleSubmit = async () => {
    const {success, message, type} =  await login(credentials)
    if (success) {
      
      redirect(type);
    }
    else{
      toast.error(message, {className: "text-white bg-gray-800"})

    }
  }

  const verify = (email = "") => {
    setEmail(email)
    setVisVerify(true)
  }

  const handleForgetPassword = () => {
    setForgotPassword(true)
  }
  return (
    <div style={styles.container} className="relative">
      <Toaster />
      <div style={styles.backgroundOverlay} />
      <img src={egypt} className="absolute top-0 left-0 opacity-[0.3] w-[100vw] h-[100vh] bg-black opacity-200"/>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={styles.loginCard}
      >
        <h2 style={styles.title}>Welcome to U A T</h2>
        <p style={styles.subtitle}>Explore unforgettable travel experiences</p>
        <div style={styles.iconContainer}>
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
            <FaPlane size={30} color="#dc5809" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
            <FaHotel size={30} color="#dc5809" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
            <FaUmbrellaBeach size={30} color="#dc5809" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
            <FaPassport size={30} color="#dc5809" />
          </motion.div>
        </div>
        <div style={styles.inputContainer}>
          <input 
            style={styles.input}
            value={credentials.userName}
            onChange={(e) => setCredentials({...credentials, userName: e.target.value})}
            type='text'
            placeholder='Username'
          />
          <input 
            style={styles.input}
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            type='password'
            placeholder='Password'
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleForgetPassword}
            style={styles.forgotPassword}
          >
            Forgot password?
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            style={styles.loginButton}
          >
            Login
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignUp}
            style={styles.signUpButton}
          >
            Sign Up
          </motion.button>
        </div>
        <ForgotPassword visable={forgotPassword} hide={hideTab} verify={verify}/>
        <VerifyOTP visable={visVerify} hide={hideTab} email={email}/>
        </motion.div>
          {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>© {new Date().getFullYear()} All Rights Reserved</p>
      </footer>
    </div>
  );

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
  loginCard: {
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
  },signUpButton: {
    padding: '1rem',
    backgroundColor: 'transparent',
    color: '#dc5809',
    border: '2px solid #dc5809',
    borderRadius: '8px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '2rem',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  input: {
    padding: '1rem',
    border: '2px solid #ccc',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
  },
  forgotPassword: {
    color: '#dc5809',
    background: 'none',
    border: 'none',
    textAlign: 'right',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  loginButton: {
    padding: '1rem',
    backgroundColor: '#dc5809',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.2rem',
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
    zIndex: 1000, // ensure the footer stays at the bottom
  },
  footerText: {
    margin: 0,
  }
};

export default LoginPage;