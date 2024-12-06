import React, { useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useUserStore } from '../store/user';
import itin from '../images/itin.png';
import Mus from '../images/mus.jpg';
import plane from '../images/planee.jpg';
import egypt from '../images/egypt.jpg';



function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any previous session's email info
    localStorage.removeItem('email');
  }, []);

  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    switch (user.type) {
      case 'tour guide':
        return <Navigate to='/TourGuideProfilePage' />;
      case 'advertiser':
        return <Navigate to='/advertiserProfile' />;
      case 'seller':
        return <Navigate to='/sellerProfile' />;
      case 'tourist':
        return <Navigate to='/touristProfile' />;
      case 'admin':
        return <Navigate to='/admin' />;
      case 'governor':
        return <Navigate to='/attraction' />;
      default:
        break;
    }
  }

  
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#C1BAA1', color: '#333' }}>
    {/* Hero Section */}
    <div
      style={{
        height: '70vh',
        backgroundColor: '#C1BAA1',
        position: 'relative',
        textAlign: 'center',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: `url(${egypt})`,  // Add background image here
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)', // Overlay effect
        }}
      ></div>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
        }}
      >
        <h1
          style={{
            fontSize: '6rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
          }}
        >
        Welcome to U A T
      </h1>
      <p
        style={{
          fontSize: '2rem',
          marginBottom: '2rem',
        }}
      >
        Explore unforgettable travel experiences.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
        <Link to='/login'>
          <button
            style={{
              padding: '14px 30px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              borderRadius: '30px',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              border: '2px solid #dc5809',
              color: 'white',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#d86c0a')}
            onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            Login
          </button>
        </Link>
        <Link to='/register'>
          <button
            style={{
              padding: '14px 30px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              borderRadius: '30px',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              border: '2px solid #dc5809',
              color: 'white',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#dc5809')}
            onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  </div>


      {/* Explore Section */}
      <div style={{ paddingTop: '4rem', paddingBottom: '4rem', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '5rem', fontWeight: '600', color: '#333' }}>Explore, Book, and Enjoy</h2>
          <p style={{ fontSize: '1.25rem', color: '#6b7280', marginTop: '1.5rem' }}>
            Browse through a wide variety of activities, flights, itineraries, and more!
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '3rem',
              marginTop: '3rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Activity Card */}
            <div
              style={{
                maxWidth: '300px',
                padding: '2rem',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
              }}
              onMouseOver={(e) => (e.target.style.transform = 'translateY(-10px)')}
              onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
            >
              <img
              src={Mus}
              alt='Activities'
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }}
              />
              <h3 style={{ fontSize: '1.75rem', fontWeight: '600' }}>Activities</h3>
              <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                Find exciting activities to do at your destination!
              </p>
              <Link to='/login'>
                <button
                  style={{
                    marginTop: '1.5rem',
                    padding: '12px 25px',
                    backgroundColor: '#dc5809',
                    color: 'white',
                    border: 'none',
                    borderRadius: '30px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#d86c0a')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '#dc5809')}
                >
                  Explore Activities
                </button>
              </Link>
            </div>

            {/* Flights Card */}
            <div
              style={{
                maxWidth: '300px',
                padding: '2rem',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
              }}
              onMouseOver={(e) => (e.target.style.transform = 'translateY(-10px)')}
              onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
            >
              <img
              src={plane}
              alt='Flights'
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }}
              />
              <h3 style={{ fontSize: '1.75rem', fontWeight: '600' }}>Flights</h3>
              <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                Book your flight for an unforgettable adventure.
              </p>
              <Link to='/login'>
                <button
                  style={{
                    marginTop: '1.5rem',
                    padding: '12px 25px',
                    backgroundColor: '#dc5809',
                    color: 'white',
                    border: 'none',
                    borderRadius: '30px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#d86c0a')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '#dc5809')}
                >
                  Find Flights
                </button>
              </Link>
            </div>

            {/* Itinerary Card */}
            <div
              style={{
                maxWidth: '300px',
                padding: '2rem',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
              }}
              onMouseOver={(e) => (e.target.style.transform = 'translateY(-10px)')}
              onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
            >
              <img
              src={itin}
              alt='Hotel'
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }}
              />
              <h3 style={{ fontSize: '1.75rem', fontWeight: '600' }}>Hotels</h3>
              <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                Booking your stay has never been easier.
              </p>
              <Link to='/login'>
                <button
                  style={{
                    marginTop: '1.5rem',
                    padding: '12px 25px',
                    backgroundColor: '#dc5809',
                    color: 'white',
                    border: 'none',
                    borderRadius: '30px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#d86c0a')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '#dc5809')}
                >
                  View Hotels
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: '#1a1a1a',
          color: '#fff',
          textAlign: 'center',
          padding: '3rem 0',
        }}
      >
        <p>&copy; 2024 U A T. All rights reserved.</p>
      </div>
    </div>
  );
}

export default HomePage;
