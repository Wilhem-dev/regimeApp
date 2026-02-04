import React, { useState } from 'react';

function SignupForm({ setUserId, switchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sexe, setSexe] = useState('homme');
  const [age, setAge] = useState('');
  const [poids, setPoids] = useState('');
  const [taille, setTaille] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    const tailleMeters = taille ? parseFloat(taille) / 100 : null;
    const res = await fetch('http://localhost:3001/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, sexe, age, poids, taille: tailleMeters })
    });
    const data = await res.json();
    if (data.success) setUserId(data.userId);
    else alert('Signup failed: ' + data.message);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #ffffffff 0%, #ffffffff 100%)',
      padding: '2rem 5%',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    wrapper: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '1000px',
      display: 'flex',
      minHeight: '600px',
    },
    sidebar: {
      flex: 1,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '50px 40px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    logo: {
      fontSize: '2.5rem',
      marginBottom: '20px',
      fontWeight: 'bold',
    },
    tagline: {
      fontSize: '1.1rem',
      lineHeight: 1.6,
      opacity: 0.9,
    },
    formsContainer: {
      flex: 1.5,
      padding: '50px 40px',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    headerTitle: {
      fontSize: '2rem',
      color: '#333',
      marginBottom: '10px',
    },
    headerSubtitle: {
      color: '#666',
      fontSize: '1rem',
    },
    form: {
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
    },
    formGroup: {
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      padding: '15px',
      border: '2px solid #e1e5e9',
      borderRadius: '10px',
      fontSize: '1rem',
      transition: 'all 0.3s',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    select: {
      width: '100%',
      padding: '15px',
      border: '2px solid #e1e5e9',
      borderRadius: '10px',
      fontSize: '1rem',
      transition: 'all 0.3s',
      background: 'white',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      cursor: 'pointer',
    },
    submitButton: {
      width: '100%',
      padding: '15px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s',
      marginTop: '10px',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    },
    switchContainer: {
      textAlign: 'center',
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: '1px solid #e1e5e9',
    },
    switchText: {
      color: '#666',
      marginBottom: '10px',
    },
    switchButton: {
      background: 'none',
      border: '2px solid #667eea',
      color: '#667eea',
      padding: '10px 30px',
      borderRadius: '25px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: '1rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
  };

  const handleSubmitHoverIn = (e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
  };

  const handleSubmitHoverOut = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
  };

  const handleSwitchHoverIn = (e) => {
    e.currentTarget.style.background = '#667eea';
    e.currentTarget.style.color = 'white';
  };

  const handleSwitchHoverOut = (e) => {
    e.currentTarget.style.background = 'none';
    e.currentTarget.style.color = '#667eea';
  };

  const handleInputFocus = (e) => {
    e.target.style.outline = 'none';
    e.target.style.borderColor = '#667eea';
    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#e1e5e9';
    e.target.style.boxShadow = 'none';
  };

  const handleSelectFocus = (e) => {
    e.target.style.outline = 'none';
    e.target.style.borderColor = '#667eea';
    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
  };

  const handleSelectBlur = (e) => {
    e.target.style.borderColor = '#e1e5e9';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @media (max-width: 768px) {
            .auth-wrapper {
              flex-direction: column !important;
            }
            .auth-sidebar {
              padding: 30px 20px !important;
            }
            .auth-forms-container {
              padding: 30px 20px !important;
            }
          }
          @media (max-width: 480px) {
            .auth-sidebar { display: none !important; }
            .auth-wrapper { flex-direction: column !important; }
            .auth-forms-container { padding: 18px !important; width: 100% !important; }
            form { max-width: 100% !important; padding: 0 !important; }
            input, select { padding: 12px !important; font-size: 1rem !important; }
            button { width: 100% !important; }
            .wrapper { box-shadow: none !important; border-radius: 12px !important; }
          }
        `}
      </style>
      
      <div style={styles.wrapper} className="auth-wrapper">
        {/* Sidebar */}
        <div style={styles.sidebar} className="auth-sidebar">
          <h1 style={styles.logo}>Régime App</h1>
          <p style={styles.tagline}>
            Commencez votre voyage vers une vie plus saine
          </p>
        </div>

        {/* Forms */}
        <div style={styles.formsContainer} className="auth-forms-container">
          <div style={styles.header}>
            <h2 style={styles.headerTitle}>Créez votre compte</h2>
            <p style={styles.headerSubtitle}>Rejoignez-nous en quelques secondes</p>
          </div>
          
          <form onSubmit={handleSignup} style={styles.form}>
            <div style={styles.formGroup}>
              <input 
                placeholder="Email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <input 
                placeholder="Mot de passe" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <select 
                value={sexe} 
                onChange={e => setSexe(e.target.value)}
                onFocus={handleSelectFocus}
                onBlur={handleSelectBlur}
                style={styles.select}
              >
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <input 
                placeholder="Âge" 
                type="number" 
                value={age} 
                onChange={e => setAge(e.target.value)} 
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                min="1"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <input
                placeholder="Taille (cm)"
                type="number"
                value={taille}
                onChange={e => setTaille(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                min="30"
                max="300"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <input 
                placeholder="Poids (kg)" 
                type="number" 
                value={poids} 
                onChange={e => setPoids(e.target.value)} 
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                min="1"
                required
                style={styles.input}
              />
            </div>
            <button 
              type="submit" 
              style={styles.submitButton}
              onMouseEnter={handleSubmitHoverIn}
              onMouseLeave={handleSubmitHoverOut}
            >
              Créer un compte
            </button>
            
            <div style={styles.switchContainer}>
              <p style={styles.switchText}>Déjà un compte ?</p>
              <button 
                type="button" 
                onClick={switchToLogin}
                style={styles.switchButton}
                onMouseEnter={handleSwitchHoverIn}
                onMouseLeave={handleSwitchHoverOut}
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;