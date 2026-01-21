import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';
import PageAccueil from './components/PageAccueil';
import './App.css';

function App() {
  const [userId, setUserId] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activeForm, setActiveForm] = useState('login'); 

  const handleLogout = () => {
    setUserId(null);
    setShowAuth(false);
  };

  const handleLoginClick = () => {
    setShowAuth(true);
    setActiveForm('login');
  };

  const switchToSignup = () => setActiveForm('signup');
  const switchToLogin = () => setActiveForm('login');

  return (
    <div className="app-container">
      {!userId ? (
        <>
          {!showAuth ? (
            // Page d'accueil
            <PageAccueil onLoginClick={handleLoginClick} />
          ) : (
            // Interface d'authentification
            <div className="auth-container">
              <div className="auth-wrapper">
                {/* Formulaires */}
                <div className="forms-container">
                  
                  
                  <div className="forms">
                    {activeForm === 'login' ? (
                      <LoginForm 
                        setUserId={setUserId} 
                        switchToSignup={switchToSignup}
                      />
                    ) : (
                      <SignupForm 
                        setUserId={setUserId} 
                        switchToLogin={switchToLogin}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        // Dashboard
        <Dashboard userId={userId} handleLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;