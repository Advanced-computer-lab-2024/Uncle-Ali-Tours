import React, { useState } from 'react';

const SellerProfilePage = () => {
    const [name, setName] = useState('John Doe'); // Hardcoded name
    const [description, setDescription] = useState('I am a verified Seller'); // Default description
    const [isEditing, setIsEditing] = useState(false); // State to track editing

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const toggleEditProfile = () => {
        setIsEditing(!isEditing); // Toggle editing state
    };

    const handleDeleteProfile = () => {
        console.log('Delete Profile clicked');
    };

    // Inline styles
    const styles = {
        container: {
            padding: '40px',
            maxWidth: '800px',
            margin: '20px auto 0',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            backgroundColor: '#161821f0',
            fontFamily: 'Arial, sans-serif',
            color: '#fff',
        },
        profileHeader: {
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #ccc',
            paddingBottom: '20px',
            marginBottom: '20px',
        },
        profilePicture: {
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            marginRight: '20px',
            backgroundColor: '#1A191F',
        },
        title: {
            color: '#fff',
            margin: '0',
        },
        subtitle: {
            color: '#ccc',
            margin: '0',
        },
        descriptionBox: {
            padding: '20px',
            borderRadius: '5px',
            backgroundColor: '#161821f0',
            marginTop: '20px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        },
        textArea: {
            width: '100%',
            borderRadius: '5px',
            padding: '5px',
            borderColor: '#ccc',
            backgroundColor: '#161821f0', // Set background color to black
            color: '#fff', // Set text color to white for visibility
        },
        button: {
            padding: '12px 20px',
            margin: '5px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#007bff',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        },
        buttonDelete: {
            backgroundColor: '#dc3545',
        },
        descriptionText: {
            color: 'white',
            fontSize: '18px',
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.profileHeader}>
                <div style={styles.profilePicture}></div> {/* Placeholder for profile picture */}
                <div>
                    <h1 style={styles.title}>{name}</h1>
                    <h2 style={styles.subtitle}>Seller</h2>
                </div>
            </div>
            <div style={styles.descriptionBox}>
                <h3 style={{ marginBottom: '10px', color: '#fff' }}>About</h3>
                {isEditing ? (
                    <div>
                        <textarea
                            value={description}
                            onChange={handleDescriptionChange}
                            rows="4"
                            style={styles.textArea} // Apply textArea styles
                        />
                    </div>
                ) : (
                    <p style={styles.descriptionText}>{description}</p>
                )}
            </div>
            <div style={styles.buttonContainer}>
                <button style={styles.button} onClick={toggleEditProfile}>
                    {isEditing ? 'Save' : 'Edit Profile'}
                </button> {/* Toggle between Edit Profile and Save */}
                <button style={{ ...styles.button, ...styles.buttonDelete }} onClick={handleDeleteProfile}>
                    Delete Profile
                </button>
            </div>
        </div>
    );
};

export default SellerProfilePage;