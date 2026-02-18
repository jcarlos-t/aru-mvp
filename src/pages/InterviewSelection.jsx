
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle2, Circle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { interviewQuestions } from '../data/interviewQuestions';
import '../styles/InterviewSelection.css';

const InterviewSelection = () => {
    const navigate = useNavigate();
    const [selectedQuestions, setSelectedQuestions] = useState([]);

    const toggleQuestion = (id) => {
        setSelectedQuestions(prev => {
            if (prev.includes(id)) {
                return prev.filter(qId => qId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleStartInterview = () => {
        if (selectedQuestions.length === 0) return;

        // Filter the actual question objects locally to pass to the next page
        const selectedQuestionObjects = interviewQuestions.filter(q =>
            selectedQuestions.includes(q.id)
        );

        navigate('/interview-mode', { state: { questions: selectedQuestionObjects } });
    };

    return (
        <div className="interview-selection-page">
            <Navbar />

            <div className="selection-container">
                <div className="selection-header">
                    <button className="back-button" onClick={() => navigate('/')}>
                        <ArrowLeft size={24} />
                        <span>Volver</span>
                    </button>
                    <h1>Modo Entrevista</h1>
                    <p>Selecciona las preguntas para la Entrevista</p>
                </div>

                <div className="questions-grid">
                    {interviewQuestions.map((q) => (
                        <div
                            key={q.id}
                            className={`question-card ${selectedQuestions.includes(q.id) ? 'selected' : ''}`}
                            onClick={() => toggleQuestion(q.id)}
                        >
                            <div className="card-indicator">
                                {selectedQuestions.includes(q.id) ?
                                    <CheckCircle2 className="icon-selected" /> :
                                    <Circle className="icon-unselected" />
                                }
                            </div>
                            <span className="question-text">{q.text}</span>
                        </div>
                    ))}
                </div>

                <div className="action-bar">
                    <p className="selection-count">
                        {selectedQuestions.length} {selectedQuestions.length === 1 ? 'pregunta seleccionada' : 'preguntas seleccionadas'}
                    </p>
                    <button
                        className={`start-button ${selectedQuestions.length === 0 ? 'disabled' : ''}`}
                        onClick={handleStartInterview}
                        disabled={selectedQuestions.length === 0}
                    >
                        <span>Comenzar Entrevista</span>
                        <Play size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewSelection;
