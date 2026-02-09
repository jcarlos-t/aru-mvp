import { useEffect, useRef, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

/**
 * Componente Avatar - Renderiza un avatar 3D y ejecuta animaciones en secuencia
 * @param {Object} props
 * @param {string[]} props.animationQueue - Array de claves de animación para reproducir
 * @param {Function} props.onComplete - Callback cuando termina la secuencia completa
 * @param {Function} props.onAnimationChange - Callback cuando cambia de animación
 */
export default function Avatar({ animationQueue = [], onComplete, onAnimationChange }) {
    const group = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Cargar el modelo base del avatar
    const { scene } = useGLTF('/models/avatar3.glb');
    const { actions, mixer } = useAnimations([], group);

    // Estado para manejar las animaciones cargadas dinámicamente
    const [loadedAnimations, setLoadedAnimations] = useState({});
    const previousActionRef = useRef(null);

    /**
     * Carga una animación desde un archivo GLB
     */
    const loadAnimation = async (animationKey) => {
        // Si ya está cargada, no volver a cargar
        if (loadedAnimations[animationKey]) {
            return loadedAnimations[animationKey];
        }

        try {
            // Cargar el archivo de animación usando GLTFLoader
            const loader = new GLTFLoader();
            const gltf = await new Promise((resolve, reject) => {
                loader.load(
                    `/animations/${animationKey.toLowerCase().replace('letra_', '')}.glb`,
                    resolve,
                    undefined,
                    reject
                );
            });

            if (gltf.animations && gltf.animations.length > 0) {
                const clip = gltf.animations[0];
                clip.name = animationKey;

                // Agregar el clip al mixer
                const action = mixer.clipAction(clip);
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;

                // Guardar en el estado
                setLoadedAnimations(prev => ({
                    ...prev,
                    [animationKey]: action
                }));

                return action;
            }
        } catch (error) {
            console.warn(`No se pudo cargar la animación: ${animationKey}`, error);
            return null;
        }
    };

    /**
     * Reproduce la siguiente animación en la cola
     */
    useEffect(() => {
        if (animationQueue.length === 0 || currentIndex >= animationQueue.length) {
            setIsPlaying(false);
            if (currentIndex >= animationQueue.length && onComplete) {
                onComplete();
            }
            return;
        }

        const currentAnimKey = animationQueue[currentIndex];
        setIsPlaying(true);

        if (onAnimationChange) {
            onAnimationChange(currentAnimKey, currentIndex);
        }

        // Cargar y reproducir la animación
        loadAnimation(currentAnimKey).then(action => {
            if (!action) {
                // Si no se puede cargar, pasar a la siguiente
                setCurrentIndex(prev => prev + 1);
                return;
            }

            // Aplicar crossFade si hay una animación previa
            if (previousActionRef.current && previousActionRef.current !== action) {
                previousActionRef.current.fadeOut(0.3);
            }

            // Reproducir la nueva animación con fadeIn
            action.reset();
            action.fadeIn(0.3);
            action.play();

            // Listener para cuando termine la animación
            const onFinished = (e) => {
                if (e.action === action) {
                    mixer.removeEventListener('finished', onFinished);
                    setCurrentIndex(prev => prev + 1);
                }
            };

            mixer.addEventListener('finished', onFinished);
            previousActionRef.current = action;
        });

    }, [currentIndex, animationQueue, mixer, onComplete, onAnimationChange]);

    /**
     * Resetear cuando cambia la cola de animaciones
     */
    useEffect(() => {
        setCurrentIndex(0);
        setIsPlaying(false);
        previousActionRef.current = null;
    }, [animationQueue]);

    return (
        <group ref={group}>
            <primitive object={scene} />
        </group>
    );
}

// Precargar el modelo base
useGLTF.preload('/models/avatar3.glb');
