
import { useState, Suspense, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { ArrowLeft, RefreshCcw, SkipForward, Play, Pause } from 'lucide-react';
import Avatar from '../components/Avatar';
import Navbar from '../components/Navbar';
import '../styles/InterviewMode.css';

const InterviewMode = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions } = location.state || { questions: [] };

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [animationQueue, setAnimationQueue] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);

    // Safety check if no questions were passed
    useEffect(() => {
        if (!questions || questions.length === 0) {
            navigate('/interview-selection');
        } else {
            // Load the first question's animation
            playQuestion(0);
        }
    }, [questions, navigate]);

    const playQuestion = (index) => {
        if (index >= 0 && index < questions.length) {
            const question = questions[index];
            setAnimationQueue([question.animation]);
            setIsPlaying(true);
            setCurrentQuestionIndex(index);
        }
    };

    const handleAnimationComplete = () => {
        setIsPlaying(false);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            playQuestion(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            playQuestion(currentQuestionIndex - 1);
        }
    };

    const handleReplay = () => {
        playQuestion(currentQuestionIndex);
    };

    // If no questions, don't render anything (redirecting)
    if (!questions || questions.length === 0) return null;

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="interview-mode-page">
            <Navbar />

            <div className="interview-content">
                <div className="avatar-section">
                    <Canvas shadows className="avatar-canvas">
                        <PerspectiveCamera makeDefault position={[0, 1.4, 3]} />
                        <OrbitControls
                            target={[0, 1.2, 0]}
                            minDistance={2}
                            maxDistance={5}
                            enablePan={false}
                            maxPolarAngle={Math.PI / 1.8}
                        />

                        <ambientLight intensity={0.4} />
                        <directionalLight position={[2, 4, 3]} intensity={0.6} castShadow />
                        <spotLight position={[-2, 3, 2]} intensity={0.4} castShadow />

                        <Suspense fallback={null}>
                            <Avatar
                                animationQueue={animationQueue}
                                onComplete={handleAnimationComplete}
                            />
                            <Environment preset="apartment" intensity={0.5} />
                        </Suspense>
                    </Canvas>
                </div>

                <div className="question-panel">
                    <div className="panel-header">
                        <button className="icon-btn" onClick={() => navigate('/interview-selection')}>
                            <ArrowLeft size={24} />
                        </button>
                        <span className="question-counter">
                            Pregunta {currentQuestionIndex + 1} de {questions.length}
                        </span>
                    </div>

                    <div className="current-question-display">
                        <h2>{currentQuestion?.text}</h2>
                        <div className="status-indicator">
                            {isPlaying ? (
                                <span className="status-playing">Reproduciendo...</span>
                            ) : (
                                <span className="status-waiting">Esperando respuesta</span>
                            )}
                        </div>
                    </div>

                    <div className="controls-bar">
                        <button className="control-btn secondary" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                            Anterior
                        </button>

                        <button className="control-btn primary round" onClick={handleReplay} title="Repetir">
                            <RefreshCcw size={24} />
                        </button>

                        <button className="control-btn secondary" onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
                            Siguiente <SkipForward size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewMode;
