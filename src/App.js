import React, { useState } from 'react';
import logo from './logo.svg';
import header from './Header.svg';
import mobileHeader from './MobileHeader.svg';

import './App.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, where } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  // ... (same as before)
  apiKey: "AIzaSyDem_rULw0FIPlKV2xzV1WRlzcMVC-TSGc",
  authDomain: "kuubi-c55eb.firebaseapp.com",
  projectId: "kuubi-c55eb",
  storageBucket: "kuubi-c55eb.appspot.com",
  messagingSenderId: "597704750684",
  appId: "1:597704750684:web:d3597b97639ce46a9a9899",
  measurementId: "G-L3CZY4ZDJW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

function App() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isEmailValid = (email) => {
    // Use a regular expression to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (event) => {
    setEmail(event.target.value);
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      setSuccessMessage('');
      setErrorMessage('');
  
      // Check if the email is valid
      if (!isEmailValid(email)) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
  
      // Check if the email already exists in the database
      const querySnapshot = await getDocs(collection(database, 'emails'), where('email', '==', email));
      const existingEmail = querySnapshot.docs.find((doc) => doc.data().email === email);
  
      if (existingEmail) {
        setErrorMessage('This email address is already registered.');
        return;
      }
  
      // If the email is not already in the database, add it
      await addDoc(collection(database, 'emails'), {
        email: email,
        timestamp: serverTimestamp(),
      });
      setSuccessMessage('Thanks for joining the beta!');
      setEmail('');
    } catch (error) {
      console.error('Error adding document: ', error);
      setErrorMessage('Something went wrong! Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="App">
      {/* Top Section */}
      <div className="TopSection">
        <div className="HeroImage">
       <img
            src={window.innerWidth >= 768 ? header : mobileHeader}
            alt="Ayuhasca Hero"
          />
        </div>
        <div className="GradientOverlay" />
        <div className="GradientUnderlay" />
        <div className="ContentContainer">
          <div className="LogoAndName">
            <img src={logo} className="App-logo" alt="logo" />
            <span>AYUHASCA</span>
          </div>
          <div className="CelebrateMoments">Celebrate Moments!</div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="BottomSection">
        <div className="JoinBeta">Join BETA.</div>
        

        <input
          type="text"
          placeholder="Enter your email"
          className="EmailInput"
          value={email}
          onChange={handleInputChange}
          
        />
        <button className="SubmitButton" onClick={handleFormSubmit} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        {successMessage && <div className="SuccessMessage">{successMessage}</div>}
        {errorMessage && <div className="ErrorMessage">{errorMessage}</div>}
      </div>
    </div>
  );
}

export default App;
