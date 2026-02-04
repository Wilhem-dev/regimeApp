import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Enregistrer les composants de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Dashboard({ userId, handleLogout }) {
  const [weights, setWeights] = useState([]);
  const [poids, setPoids] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedDataType, setSelectedDataType] = useState('poids'); // 'poids' ou 'imc'
  const [selectedHistoryPeriod, setSelectedHistoryPeriod] = useState('Tout');
  const [historySortOrder, setHistorySortOrder] = useState('desc'); // 'desc' = récent au plus ancien, 'asc' = ancien au plus récent
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    currentWeight: 0,
    weightChange: 0,
    bmi: 0,
    bmiStatus: 'Normal',
    totalMeasurements: 0
  });

  useEffect(() => {
    fetchWeights();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`http://localhost:3001/users/${userId}`);
        const data = await res.json();
        setUserInfo(data);
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };
    fetchUserInfo();
  }, [userId]);

  useEffect(() => {
    if (weights.length > 0) {
      calculateStats();
    }
  }, [weights, userInfo]);

  const fetchWeights = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/weights/${userId}`);
      const data = await res.json();
      setWeights(data);
    } catch (error) {
      console.error('Error fetching weights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    if (weights.length === 0) return;

    const sortedWeights = [...weights].sort((a, b) => 
      new Date(a.date_mesure) - new Date(b.date_mesure)
    );
    
    const currentWeight = sortedWeights[sortedWeights.length - 1].poids;
    const firstWeight = sortedWeights[0].poids;
    const weightChange = currentWeight - firstWeight;
    
    // Utiliser la taille de l'utilisateur si disponible, sinon 1.75m par défaut
    const height = userInfo?.taille || 1.75;
    const bmi = (currentWeight / (height * height)).toFixed(1);
    
    let bmiStatus = 'Normal';
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) bmiStatus = 'Maigreur';
    else if (bmiNum < 25) bmiStatus = 'Normal';
    else if (bmiNum < 30) bmiStatus = 'Surpoids';
    else bmiStatus = 'Obésité';

    setStats({
      currentWeight,
      weightChange,
      bmi,
      bmiStatus,
      totalMeasurements: weights.length
    });
  };

  const handleAddWeight = async () => {
    if (!poids) {
      alert('Veuillez entrer un poids');
      return;
    }

    try {
      await fetch('http://localhost:3001/weights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, poids: parseFloat(poids) })
      });
      
      await fetchWeights();
      setPoids('');
    } catch (error) {
      console.error('Error adding weight:', error);
      alert('Erreur lors de l\'ajout du poids');
    }
  };

  const handleDeleteWeight = async (id) => {
    if (!window.confirm('Confirmer la suppression de cette mesure ?')) return;

    try {
      await fetch(`http://localhost:3001/weights/${id}`, {
        method: 'DELETE'
      });
      await fetchWeights();
    } catch (error) {
      console.error('Error deleting weight:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const getFilteredHistoryWeights = () => {
    let sortedWeights = [...weights].sort((a, b) => 
      new Date(b.date_mesure) - new Date(a.date_mesure)
    );

    if (selectedHistoryPeriod === '7d') {
      sortedWeights = sortedWeights.slice(0, 7);
    } else if (selectedHistoryPeriod === '30d') {
      sortedWeights = sortedWeights.slice(0, 30);
    }

    // Appliquer l'ordre de tri
    if (historySortOrder === 'asc') {
      sortedWeights = sortedWeights.reverse();
    }

    return sortedWeights;
  };

  const getWeightDifference = (weight, allWeights) => {
    // Trouver tous les poids triés par date (du plus ancien au plus récent)
    const sortedByDate = [...allWeights].sort((a, b) => 
      new Date(a.date_mesure) - new Date(b.date_mesure)
    );

    // Trouver l'index du poids actuel
    const currentIndex = sortedByDate.findIndex(w => w.id === weight.id);
    
    // Si c'est le premier poids (plus ancien), pas de différence
    if (currentIndex === 0) {
      return null;
    }
    
    // Calculer la différence avec le poids précédent (temporellement)
    const previousWeight = sortedByDate[currentIndex - 1].poids;
    const difference = weight.poids - previousWeight;
    
    return difference;
  };

  const getChartData = () => {
    const sortedWeights = [...weights].sort((a, b) => 
      new Date(a.date_mesure) - new Date(b.date_mesure)
    );

    const filteredWeights = selectedPeriod === '7d' 
      ? sortedWeights.slice(-7)
      : selectedPeriod === '30d'
      ? sortedWeights.slice(-30)
      : sortedWeights;

    const labels = filteredWeights.map(w => {
      const date = new Date(w.date_mesure);
      return date.toLocaleDateString('fr-FR', { 
        month: 'short', 
        day: 'numeric' 
      });
    });

    // Calculer l'IMC pour chaque mesure si ce n'est pas déjà fait
    const height = userInfo?.taille || 1.70;
    const dataPoints = filteredWeights.map(w => {
      if (selectedDataType === 'poids') {
        return w.poids;
      } else {
        // Calculer l'IMC
        return (w.poids / (height * height)).toFixed(1);
      }
    });

    const colors = {
      poids: {
        border: 'rgb(102, 126, 234)',
        background: 'rgba(102, 126, 234, 0.1)',
        pointBorder: 'rgb(102, 126, 234)'
      },
      imc: {
        border: 'rgb(66, 153, 225)',
        background: 'rgba(66, 153, 225, 0.1)',
        pointBorder: 'rgb(66, 153, 225)'
      }
    };

    const currentColors = colors[selectedDataType];

    return {
      labels,
      datasets: [
        {
          label: selectedDataType === 'poids' ? 'Poids (kg)' : 'IMC',
          data: dataPoints,
          borderColor: currentColors.border,
          backgroundColor: currentColors.background,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(255, 255, 255)',
          pointBorderColor: currentColors.pointBorder,
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  };

  const getChartOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: "'Segoe UI', sans-serif"
          },
          color: '#2d3748'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#2d3748',
        bodyColor: '#4a5568',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        boxPadding: 6,
        displayColors: false,
        callbacks: {
          label: function(context) {
            if (selectedDataType === 'poids') {
              return `Poids: ${context.parsed.y} kg`;
            } else {
              const bmiValue = context.parsed.y;
              let bmiCategory = '';
              if (bmiValue < 18.5) bmiCategory = ' (Maigreur)';
              else if (bmiValue < 25) bmiCategory = ' (Normal)';
              else if (bmiValue < 30) bmiCategory = ' (Surpoids)';
              else bmiCategory = ' (Obésité)';
              return `IMC: ${bmiValue}${bmiCategory}`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#718096',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(226, 232, 240, 0.6)'
        },
        ticks: {
          color: '#718096',
          font: {
            size: 12
          },
          callback: function(value) {
            return selectedDataType === 'poids' ? `${value} kg` : value;
          }
        },
        ...(selectedDataType === 'imc' && {
          suggestedMin: 15,
          suggestedMax: 35
        })
      }
    }
  });

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    navbar: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 20px rgba(0, 0, 0, 0.08)',
      padding: '1.5rem 5%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    },
    navContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    logo: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: 0,
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    userName: {
      fontSize: '1rem',
      color: '#4a5568',
      fontWeight: 600,
    },
    logoutBtn: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '0.6rem 1.5rem',
      border: 'none',
      borderRadius: '25px',
      fontSize: '0.9rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    },
    mainContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem 5%',
    },
    welcomeSection: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      padding: '2.5rem',
      color: 'white',
      marginBottom: '2rem',
      boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
    },
    welcomeTitle: {
      fontSize: '2rem',
      marginBottom: '0.5rem',
      fontWeight: 'bold',
    },
    welcomeSubtitle: {
      fontSize: '1.1rem',
      opacity: 0.9,
      marginBottom: '1.5rem',
    },
    userStats: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
      marginTop: '1rem',
    },
    userStatItem: {
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '0.5rem 1rem',
      borderRadius: '10px',
      fontSize: '0.9rem',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    statCard: {
      background: 'white',
      borderRadius: '15px',
      padding: '1.5rem',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
    },
    statHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    statTitle: {
      fontSize: '0.9rem',
      color: '#718096',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    statIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#2d3748',
      marginBottom: '0.5rem',
    },
    statChange: {
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    chartSection: {
      background: 'white',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
      marginBottom: '2rem',
    },
    chartHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    chartTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#2d3748',
      margin: 0,
    },
    chartControls: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    dataTypeSelector: {
      display: 'flex',
      gap: '0.5rem',
      background: '#f1f5f9',
      padding: '0.3rem',
      borderRadius: '10px',
    },
    dataTypeButton: {
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '8px',
      background: 'transparent',
      color: '#718096',
      fontSize: '0.9rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    activeDataType: {
      background: 'white',
      color: '#667eea',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    periodSelector: {
      display: 'flex',
      gap: '0.5rem',
      background: '#f1f5f9',
      padding: '0.3rem',
      borderRadius: '10px',
    },
    periodButton: {
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '8px',
      background: 'transparent',
      color: '#718096',
      fontSize: '0.9rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    activePeriod: {
      background: 'white',
      color: '#667eea',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    chartContainer: {
      height: '400px',
      position: 'relative',
    },
    bmiInfo: {
      marginTop: '1rem',
      padding: '1rem',
      background: '#f8fafc',
      borderRadius: '10px',
      fontSize: '0.9rem',
      color: '#4a5568',
    },
    bmiLegend: {
      display: 'flex',
      justifyContent: 'space-around',
      marginTop: '0.5rem',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    bmiCategory: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
    },
    bmiColor: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
    },
    addWeightSection: {
      background: 'white',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
      marginBottom: '2rem',
    },
    addWeightTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#2d3748',
      marginBottom: '1.5rem',
    },
    addWeightForm: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
    },
    weightInput: {
      flex: 1,
      padding: '1rem 1.5rem',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      fontFamily: "'Segoe UI', sans-serif",
    },
    addButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1rem 2rem',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
      whiteSpace: 'nowrap',
    },
    deleteButton: {
      background: 'linear-gradient(135deg, #f56565 0%, #c53030 100%)',
      color: 'white',
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.85rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 3px 10px rgba(245, 101, 101, 0.25)',
    },
    weightListSection: {
      background: 'white',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
    },
    listTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#2d3748',
      marginBottom: '1.5rem',
    },
    weightList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    weightItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 1.5rem',
      borderBottom: '1px solid #f1f5f9',
      transition: 'all 0.3s ease',
    },
    weightItemHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 1.5rem',
      background: '#f8fafc',
      borderRadius: '10px 10px 0 0',
      borderBottom: '2px solid #e2e8f0',
      fontWeight: 'bold',
      color: '#4a5568',
    },
    weightValue: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      color: '#2d3748',
    },
    weightDate: {
      color: '#718096',
      fontSize: '0.9rem',
    },
    weightBmi: {
      fontWeight: 600,
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
    },
    loadingSpinner: {
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #667eea',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 1s linear infinite',
    },
  };

  // Fonction pour obtenir la couleur de l'IMC basé sur la valeur
  const getBMIColorFromValue = (bmiValue) => {
    if (!bmiValue) return '#718096';
    const value = parseFloat(bmiValue);
    if (value < 18.5) return '#4299e1'; // Maigreur
    if (value < 25) return '#48bb78';   // Normal
    if (value < 30) return '#ed8936';   // Surpoids
    return '#f56565';                   // Obésité
  };

  // Effets de survol
  const handleLogoutHover = (e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
  };

  const handleLogoutLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
  };

  const handleAddHover = (e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
  };

  const handleAddLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
  };

  const handleInputFocus = (e) => {
    e.target.style.outline = 'none';
    e.target.style.borderColor = '#667eea';
    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#e2e8f0';
    e.target.style.boxShadow = 'none';
  };

  const handleCardHover = (e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
  };

  const handleCardLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
  };

  const handleItemHover = (e) => {
    e.currentTarget.style.background = '#f8fafc';
  };

  const handleItemLeave = (e) => {
    e.currentTarget.style.background = 'white';
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @media (max-width: 768px) {
            .main-content {
              padding: 1rem !important;
            }
            .stats-grid {
              grid-template-columns: 1fr !important;
            }
            .add-weight-form {
              flex-direction: column !important;
            }
            .add-weight-form button {
              width: 100%;
            }
            .chart-header {
              flex-direction: column !important;
              align-items: flex-start !important;
            }
            .chart-controls {
              width: 100%;
              justify-content: space-between;
            }
            .bmi-legend {
              justify-content: flex-start !important;
            }
          }
          @media (max-width: 480px) {
            .main-content {
              padding: 0.75rem !important;
            }
            nav {
              padding: 1rem !important;
            }
            .stats-grid {
              gap: 1rem !important;
            }
            .statCard, .stat-card {
              padding: 1rem !important;
            }
            .chart-container, .chartContainer {
              height: 300px !important;
            }
            .add-weight-form {
              gap: 0.5rem !important;
            }
            .weightItem, .weight-item, li {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 0.5rem;
            }
            .weightItem button, .delete-button {
              align-self: flex-end !important;
            }
            input[type="number"] {
              font-size: 1rem !important;
              padding: 0.9rem !important;
            }
            button {
              font-size: 0.95rem !important;
            }
            /* Masquer l'entête de la liste sur petits écrans */
            .weight-item-header {
              display: none !important;
            }
            /* Espacement vertical pour chaque champ dans l'historique */
            .weight-item {
              width: 100% !important;
              padding: 0.75rem 0.5rem !important;
            }
          }
        `}
      </style>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <h1 style={styles.logo}>Régime App</h1>
          <div style={styles.userInfo}>
            <button
              style={styles.logoutBtn}
              onClick={handleLogout}
              onMouseEnter={handleLogoutHover}
              onMouseLeave={handleLogoutLeave}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main style={styles.mainContent} className="main-content">
        {/* Section de bienvenue */}
        <div style={styles.welcomeSection}>
          <h2 style={styles.welcomeTitle}>
            Bienvenue !
          </h2>
          <p style={styles.welcomeSubtitle}>
            Suivez votre évolution et atteignez vos objectifs santé
          </p>
          <div style={styles.userStats}>
            
            {userInfo?.poids && (
              <span style={styles.userStatItem}>Poids initial: {userInfo.poids} kg</span>
            )}
            {userInfo?.taille && (
              <span style={styles.userStatItem}>Taille: {userInfo.taille} m</span>
            )}
          </div>
        </div>

        {isLoading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
          </div>
        ) : (
          <>
            {/* Statistiques */}
            <div style={styles.statsGrid} className="stats-grid">
              <div 
                style={styles.statCard}
                onMouseEnter={handleCardHover}
                onMouseLeave={handleCardLeave}
              >
                <div style={styles.statHeader}>
                  <span style={styles.statTitle}>Poids Actuel</span>
                  <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                    ⚖️
                  </div>
                </div>
                <div style={styles.statValue}>{stats.currentWeight} kg</div>
                <div style={styles.statChange}>
                  {stats.weightChange !== 0 && (
                    <>
                      <span style={{color: stats.weightChange > 0 ? '#f56565' : '#48bb78'}}>
                        {stats.weightChange > 0 ? '↑' : '↓'} {Math.abs(stats.weightChange).toFixed(1)} kg
                      </span>
                      <span style={{color: '#a0aec0'}}>
                        depuis le début
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div 
                style={styles.statCard}
                onMouseEnter={handleCardHover}
                onMouseLeave={handleCardLeave}
              >
                <div style={styles.statHeader}>
                  <span style={styles.statTitle}>IMC Actuel</span>
                  <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'}}>
                    📊
                  </div>
                </div>
                <div style={styles.statValue}>{stats.bmi}</div>
                <div style={{...styles.statChange, color: getBMIColor(stats.bmiStatus)}}>
                  {stats.bmiStatus}
                </div>
              </div>

              <div 
                style={styles.statCard}
                onMouseEnter={handleCardHover}
                onMouseLeave={handleCardLeave}
              >
                <div style={styles.statHeader}>
                  <span style={styles.statTitle}>Mesures</span>
                  <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)'}}>
                    📈
                  </div>
                </div>
                <div style={styles.statValue}>{stats.totalMeasurements}</div>
                <div style={styles.statChange}>
                  <span style={{color: '#a0aec0'}}>mesures enregistrées</span>
                </div>
              </div>
            </div>
{/* Ajouter un poids */}
            <div style={styles.addWeightSection}>
              <h3 style={styles.addWeightTitle}>Ajouter une mesure</h3>
              <div style={styles.addWeightForm} className="add-weight-form">
                <input
                  type="number"
                  placeholder="Entrez votre poids en kg"
                  value={poids}
                  onChange={e => setPoids(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  step="0.1"
                  min="0"
                  style={styles.weightInput}
                />
                <button
                  onClick={handleAddWeight}
                  onMouseEnter={handleAddHover}
                  onMouseLeave={handleAddLeave}
                  style={styles.addButton}
                >
                  Ajouter le poids
                </button>
              </div>
            </div>


            {/* Graphique */}
            <div style={styles.chartSection}>
              <div style={styles.chartHeader} className="chart-header">
                <h3 style={styles.chartTitle}>
                  Évolution {selectedDataType === 'poids' ? 'du Poids' : 'de l\'IMC'}
                </h3>
                <div style={styles.chartControls} className="chart-controls">
                  <div style={styles.dataTypeSelector}>
                    <button
                      style={{
                        ...styles.dataTypeButton,
                        ...(selectedDataType === 'poids' ? styles.activeDataType : {})
                      }}
                      onClick={() => setSelectedDataType('poids')}
                    >
                      Poids
                    </button>
                    <button
                      style={{
                        ...styles.dataTypeButton,
                        ...(selectedDataType === 'imc' ? styles.activeDataType : {})
                      }}
                      onClick={() => setSelectedDataType('imc')}
                    >
                      IMC
                    </button>
                  </div>
                  <div style={styles.periodSelector}>
                    {['7d', '30d', 'Tout'].map((period) => (
                      <button
                        key={period}
                        style={{
                          ...styles.periodButton,
                          ...(selectedPeriod === period ? styles.activePeriod : {})
                        }}
                        onClick={() => setSelectedPeriod(period)}
                      >
                        {period === '7d' ? '7j' : period === '30d' ? '30j' : 'Tout'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={styles.chartContainer}>
                {weights.length > 0 ? (
                  <>
                    <Line data={getChartData()} options={getChartOptions()} />
                    {selectedDataType === 'imc' && (
                      <div style={styles.bmiInfo}>
                        <p>Légende IMC :</p>
                        <div style={styles.bmiLegend} className="bmi-legend">
                          <div style={styles.bmiCategory}>
                            <div style={{...styles.bmiColor, background: '#4299e1'}}></div>
                            <span>Maigreur (&lt; 18.5)</span>
                          </div>
                          <div style={styles.bmiCategory}>
                            <div style={{...styles.bmiColor, background: '#48bb78'}}></div>
                            <span>Normal (18.5 - 25)</span>
                          </div>
                          <div style={styles.bmiCategory}>
                            <div style={{...styles.bmiColor, background: '#ed8936'}}></div>
                            <span>Surpoids (25 - 30)</span>
                          </div>
                          <div style={styles.bmiCategory}>
                            <div style={{...styles.bmiColor, background: '#f56565'}}></div>
                            <span>Obésité (≥ 30)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#a0aec0' }}>
                    <p>Aucune donnée disponible</p>
                    <p>Ajoutez votre premier poids pour voir le graphique</p>
                  </div>
                )}
              </div>
            </div>

            

            {/* Historique des poids */}
            <div style={styles.weightListSection}>
              <div style={styles.chartHeader} className="chart-header">
                <h3 style={styles.listTitle}>Historique des Mesures</h3>
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap'}}>
                  <div style={styles.periodSelector}>
                    {['7d', '30d', 'Tout'].map((period) => (
                      <button
                        key={period}
                        style={{
                          ...styles.periodButton,
                          ...(selectedHistoryPeriod === period ? styles.activePeriod : {})
                        }}
                        onClick={() => setSelectedHistoryPeriod(period)}
                      >
                        {period === '7d' ? '7 jours' : period === '30d' ? '30 jours' : 'Tout'}
                      </button>
                    ))}
                  </div>
                  <div style={styles.periodSelector}>
                    <button
                      style={{
                        ...styles.periodButton,
                        ...(historySortOrder === 'desc' ? styles.activePeriod : {})
                      }}
                      onClick={() => setHistorySortOrder('desc')}
                      title="Du plus récent au plus ancien"
                    >
                      ↓ Récent
                    </button>
                    <button
                      style={{
                        ...styles.periodButton,
                        ...(historySortOrder === 'asc' ? styles.activePeriod : {})
                      }}
                      onClick={() => setHistorySortOrder('asc')}
                      title="Du plus ancien au plus récent"
                    >
                      ↑ Ancien
                    </button>
                  </div>
                </div>
              </div>
              {weights.length > 0 ? (
                <>
                  <div style={styles.weightItemHeader} className="weight-item-header">
                    <span>Poids</span>
                    <span>Date</span>
                    <span>Variation</span>
                    <span>IMC</span>
                    <span>Supprimer</span>
                  </div>
                  <ul style={styles.weightList} className="weight-list">
                    {getFilteredHistoryWeights().map((weight) => {
                        // Calculer l'IMC pour chaque mesure
                        const height = userInfo?.taille || 1.75;
                        const bmiValue = (weight.poids / (height * height)).toFixed(1);
                        const bmiColor = getBMIColorFromValue(bmiValue);
                        const difference = getWeightDifference(weight, weights);
                        
                          return (
                          <li
                            key={weight.id}
                            className="weight-item"
                            style={styles.weightItem}
                            onMouseEnter={handleItemHover}
                            onMouseLeave={handleItemLeave}
                          >
                            <span style={styles.weightValue}>{weight.poids} kg</span>
                            <span style={styles.weightDate}>
                              {new Date(weight.date_mesure).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span 
                              style={{
                                fontWeight: 'bold',
                                color: difference === null ? '#a0aec0' : (difference > 0 ? '#f56565' : '#48bb78')
                              }}
                            >
                              {difference === null ? '—' : (difference > 0 ? '↑ ' : '↓ ') + Math.abs(difference).toFixed(1) + ' kg'}
                            </span>
                            <span 
                              style={{
                                ...styles.weightBmi,
                                color: bmiColor,
                                fontWeight: 'bold'
                              }}
                            >
                              {bmiValue}
                            </span>
                            <button
                              className="delete-button"
                              onClick={() => handleDeleteWeight(weight.id)}
                              style={{...styles.deleteButton, marginLeft: '1rem', padding: '0.4rem 0.6rem'}}
                              title="Supprimer"
                              aria-label="Supprimer la mesure"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                                <path d="M3 6h18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                <path d="M8 6l1-3h6l1 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                <path d="M10 11v6M14 11v6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                              </svg>
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#a0aec0' }}>
                  <p>Aucun poids enregistré</p>
                  <p>Commencez par ajouter votre premier poids</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// Fonction utilitaire pour obtenir la couleur de l'IMC
function getBMIColor(status) {
  switch(status) {
    case 'Maigreur': return '#4299e1';
    case 'Normal': return '#48bb78';
    case 'Surpoids': return '#ed8936';
    case 'Obésité': return '#f56565';
    default: return '#718096';
  }
}

export default Dashboard;