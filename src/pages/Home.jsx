import { MessageCircleMore, BookOpenText, HandMetal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Home.css';
import '../styles/Navbar.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            <div className="home-container">
                <svg width="0" height="0" style={{ position: 'absolute' }}>
                    <defs>
                        <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" style={{ stopColor: 'var(--purple)', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: 'var(--cyan)', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                </svg>

                <div className="home-content">
                    {/* Hero Section */}
                    <div className="hero-section">
                        <div className="hero-content">
                            <h1 className="hero-title">Comunicación sin barreras</h1>
                            <p className="hero-subtitle">
                                Traducción en tiempo real de Lengua de Señas Peruana a texto y voz.
                                Conecta, aprende y comunícate libremente.
                            </p>

                            <div className="hero-actions">
                                <button className="btn btn-primary btn-lg" onClick={() => navigate('/camera')}>
                                    Comenzar Traductor
                                </button>
                                <button className="btn btn-secondary btn-lg-2" onClick={() => navigate('/conversation')}>
                                    Modo Conversación
                                </button>
                            </div>
                        </div>

                        <div className="hero-image-container">
                            <div className="hero-circle"></div>
                            <img src="/person_signing.png" alt="Person Signing" className="hero-image" />
                        </div>
                    </div>

                    {/* Feature Section */}
                    <div className="features-grid">
                        <div className="feature-item">
                            <span className="icon"><HandMetal stroke="url(#icon-gradient)" /></span>
                            <div>
                                <h4>Traducción Instantánea</h4>
                                <p>De señas a voz y texto en tiempo real</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <span className="icon"><MessageCircleMore stroke="url(#icon-gradient)" /></span>
                            <div>
                                <h4>Conversación Fluida</h4>
                                <p>Comunicación bidireccional texto-señas</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <span className="icon"><BookOpenText stroke="url(#icon-gradient)" /></span>
                            <div>
                                <h4>Aprendizaje Continuo</h4>
                                <p>Mejora tu vocabulario LSP</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Home;
