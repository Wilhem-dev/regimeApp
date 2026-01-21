import React from 'react';

export default function PageAccueil({ onLoginClick }) {
  const styles = {
    container: {
      margin: 0,
      padding: 0,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      overflowX: 'hidden',
      width: '100%',
      boxSizing: 'border-box',
    },
    header: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      padding: '1rem 5%',
      boxSizing: 'border-box',
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
    },
    logo: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    btnConnexion: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '0.8rem 2rem',
      border: 'none',
      borderRadius: '50px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    },
    hero: {
      marginTop: '80px',
      minHeight: '90vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      padding: '2rem 5%',
    },
    heroContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '4rem',
      alignItems: 'center',
      position: 'relative',
      zIndex: 1,
    },
    heroText: {
      color: 'white',
    },
    heroTitle: {
      fontSize: '3.5rem',
      color: 'white',
      marginBottom: '1.5rem',
      lineHeight: 1.2,
    },
    heroDescription: {
      fontSize: '1.3rem',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '2rem',
      lineHeight: 1.6,
    },
    btnPrimary: {
      background: 'white',
      color: '#667eea',
      padding: '1rem 2.5rem',
      border: 'none',
      borderRadius: '50px',
      fontSize: '1.1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    },
    heroImage: {
      position: 'relative',
    },
    mockup: {
      background: 'white',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      animation: 'floatMockup 3s ease-in-out infinite',
    },
    mockupHeader: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '1.5rem',
    },
    dot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: '#ddd',
    },
    chartPreview: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      height: '200px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      padding: '1rem',
    },
    bar: {
      width: '40px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '5px 5px 0 0',
    },
    features: {
      padding: '5rem 5%',
      background: '#f8f9fa',
    },
    featuresContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    sectionTitle: {
      textAlign: 'center',
      fontSize: '2.5rem',
      marginBottom: '3rem',
      color: '#333',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
    },
    featureCard: {
      background: 'white',
      padding: '2rem',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s ease',
    },
    featureIcon: {
      width: '60px',
      height: '60px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      marginBottom: '1rem',
    },
    featureTitle: {
      fontSize: '1.5rem',
      marginBottom: '1rem',
      color: '#333',
    },
    featureDescription: {
      color: '#666',
      lineHeight: 1.6,
    },
    cta: {
      padding: '5rem 5%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textAlign: 'center',
    },
    ctaTitle: {
      fontSize: '2.5rem',
      color: 'white',
      marginBottom: '1.5rem',
    },
    ctaDescription: {
      fontSize: '1.2rem',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '2rem',
    },
    footer: {
      background: '#2d3748',
      color: 'white',
      padding: '2rem 5%',
      textAlign: 'center',
    },
  };

  const handleHoverIn = (e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
  };

  const handleHoverOut = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
  };

  const handleBtnPrimaryHoverIn = (e) => {
    e.currentTarget.style.transform = 'translateY(-3px)';
    e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.3)';
  };

  const handleBtnPrimaryHoverOut = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
  };

  const handleCardHoverIn = (e) => {
    e.currentTarget.style.transform = 'translateY(-10px)';
    e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.2)';
  };

  const handleCardHoverOut = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.08)';
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            overflow-x: hidden;
          }
          @keyframes floatMockup {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          @media (max-width: 768px) {
            .hero-content {
              grid-template-columns: 1fr !important;
              text-align: center;
            }
            .hero-title {
              font-size: 2.5rem !important;
            }
            .hero-image {
              order: -1;
            }
          }
        `}
      </style>

      {/* Header */}
      <header style={styles.header}>
        <nav style={styles.nav}>
          <div style={styles.logo}>🏃 Regime App</div>
          <button 
            style={styles.btnConnexion}
            onMouseEnter={handleHoverIn}
            onMouseLeave={handleHoverOut}
            onClick={onLoginClick}
          >
            Connexion
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent} className="hero-content">
          <div style={styles.heroText}>
            <h1 style={styles.heroTitle} className="hero-title">
              Suivez votre poids, atteignez vos objectifs
            </h1>
            <p style={styles.heroDescription}>
              Enregistrez votre poids quotidiennement, calculez votre IMC et visualisez vos progrès avec des graphiques détaillés.
            </p>
            <button 
              style={styles.btnPrimary}
              onMouseEnter={handleBtnPrimaryHoverIn}
              onMouseLeave={handleBtnPrimaryHoverOut}
              onClick={onLoginClick}
            >
              Commencer !
            </button>
          </div>
          <div style={styles.heroImage} className="hero-image">
            <div style={styles.mockup}>
              <div style={styles.mockupHeader}>
                <div style={styles.dot}></div>
                <div style={styles.dot}></div>
                <div style={styles.dot}></div>
              </div>
              <div style={styles.chartPreview}>
                <div style={{...styles.bar, height: '60%'}}></div>
                <div style={{...styles.bar, height: '80%'}}></div>
                <div style={{...styles.bar, height: '70%'}}></div>
                <div style={{...styles.bar, height: '90%'}}></div>
                <div style={{...styles.bar, height: '75%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.featuresContainer}>
          <h2 style={styles.sectionTitle}>Fonctionnalités puissantes</h2>
          <div style={styles.featuresGrid}>
            <div 
              style={styles.featureCard}
              onMouseEnter={handleCardHoverIn}
              onMouseLeave={handleCardHoverOut}
            >
              <div style={styles.featureIcon}>⚖️</div>
              <h3 style={styles.featureTitle}>Suivi quotidien</h3>
              <p style={styles.featureDescription}>
                Enregistrez votre poids chaque jour en quelques secondes et suivez votre évolution dans le temps.
              </p>
            </div>
            <div 
              style={styles.featureCard}
              onMouseEnter={handleCardHoverIn}
              onMouseLeave={handleCardHoverOut}
            >
              <div style={styles.featureIcon}>📊</div>
              <h3 style={styles.featureTitle}>Calcul d'IMC</h3>
              <p style={styles.featureDescription}>
                Calculez automatiquement votre Indice de Masse Corporelle et comprenez votre état de santé.
              </p>
            </div>
            <div 
              style={styles.featureCard}
              onMouseEnter={handleCardHoverIn}
              onMouseLeave={handleCardHoverOut}
            >
              <div style={styles.featureIcon}>📈</div>
              <h3 style={styles.featureTitle}>Graphiques détaillés</h3>
              <p style={styles.featureDescription}>
                Visualisez vos progrès avec des graphiques interactifs et des tableaux complets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Prêt à transformer votre vie ?</h2>
        <p style={styles.ctaDescription}>
          Rejoignez des milliers d'utilisateurs qui ont atteint leurs objectifs
        </p>
        <button 
          style={styles.btnPrimary}
          onMouseEnter={handleBtnPrimaryHoverIn}
          onMouseLeave={handleBtnPrimaryHoverOut}
          onClick={onLoginClick}
        >
          Créer un compte
        </button>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>&copy; 2026 FitTrack. Tous droits réservés.Auteur:Wilhem</p>
      </footer>
    </div>
  );
}