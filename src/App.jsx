import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import Avatar from './components/Avatar';
import { textToGloss } from './utils/glossEngine';
import { dictionary } from './utils/dictionaryLoader';
import './App.css';

function App() {
    const [inputText, setInputText] = useState('');
    const [animationQueue, setAnimationQueue] = useState([]);
    const [currentAnimation, setCurrentAnimation] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);

    /**
     * Maneja la traducción del texto a glosas LSP
     */
    const handleTranslate = () => {
        if (!inputText.trim()) {
            alert('Por favor, ingresa un texto para traducir');
            return;
        }

        // Convertir texto a secuencia de animaciones usando el motor de glosas
        const glossSequence = textToGloss(inputText, dictionary);

        if (glossSequence.length === 0) {
            alert('No se encontraron palabras válidas para traducir');
            return;
        }

        console.log('Glosas generadas:', glossSequence);
        setAnimationQueue(glossSequence);
        setIsTranslating(true);
    };

    /**
     * Callback cuando cambia la animación actual
     */
    const handleAnimationChange = (animKey, index) => {
        setCurrentAnimation(animKey);
        console.log(`Reproduciendo animación ${index + 1}/${animationQueue.length}: ${animKey}`);
    };

    /**
     * Callback cuando termina toda la secuencia
     */
    const handleComplete = () => {
        console.log('Secuencia de animación completada');
        setIsTranslating(false);
        setCurrentAnimation('');
    };

    /**
     * Reinicia la traducción
     */
    const handleReset = () => {
        setInputText('');
        setAnimationQueue([]);
        setCurrentAnimation('');
        setIsTranslating(false);
    };

    return (
        <div className="app">
            {/* Canvas 3D para el avatar */}
            <div className="canvas-container">
                <Canvas shadows>
                    <PerspectiveCamera makeDefault position={[0, 1.6, 3]} />
                    <OrbitControls
                        target={[0, 1, 0]}
                        minDistance={2}
                        maxDistance={6}
                        maxPolarAngle={Math.PI / 2}
                    />

                    {/* Iluminación */}
                    <ambientLight intensity={0.5} />
                    <directionalLight
                        position={[5, 5, 5]}
                        intensity={1}
                        castShadow
                    />
                    <spotLight
                        position={[0, 5, 0]}
                        angle={0.3}
                        penumbra={1}
                        intensity={0.5}
                        castShadow
                    />

                    {/* Avatar con animaciones */}
                    <Suspense fallback={null}>
                        <Avatar
                            animationQueue={animationQueue}
                            onComplete={handleComplete}
                            onAnimationChange={handleAnimationChange}
                        />
                        <Environment preset="studio" />
                    </Suspense>

                    {/* Suelo */}
                    <mesh
                        rotation={[-Math.PI / 2, 0, 0]}
                        position={[0, 0, 0]}
                        receiveShadow
                    >
                        <planeGeometry args={[10, 10]} />
                        <meshStandardMaterial color="#2a2a2a" />
                    </mesh>
                </Canvas>

                {/* Indicador de animación actual */}
                {isTranslating && currentAnimation && (
                    <div className="animation-indicator">
                        Reproduciendo: <strong>{currentAnimation}</strong>
                    </div>
                )}
            </div>

            {/* Controles de traducción */}
            <div className="controls-container">
                <div className="controls-content">
                    <h1 className="title">
                        <span className="logo">ARU</span>
                        <span className="subtitle">Traductor de Lengua de Señas Peruana</span>
                    </h1>

                    <div className="input-group">
                        <input
                            type="text"
                            className="text-input"
                            placeholder="Escribe aquí el texto a traducir..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleTranslate()}
                            disabled={isTranslating}
                        />

                        <div className="button-group">
                            <button
                                className="btn btn-primary"
                                onClick={handleTranslate}
                                disabled={isTranslating || !inputText.trim()}
                            >
                                {isTranslating ? '🔄 Traduciendo...' : '🤟 Traducir a LSP'}
                            </button>

                            {(isTranslating || animationQueue.length > 0) && (
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleReset}
                                >
                                    🔄 Reiniciar
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="info">
                        <p>💡 <strong>Palabra disponible:</strong> Ahora</p>
                        <p>🔤 Las palabras desconocidas se deletrean letra por letra</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
