import { useEffect, useRef, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

/**
 * Mapa de huesos para retargeting (Mixamo -> ReadyPlayerMe)
 */
const BONE_MAP = {
    'mixamorigHips': 'Hips',
    'mixamorigSpine': 'Spine',
    'mixamorigSpine1': 'Spine1',
    'mixamorigSpine2': 'Spine2',
    'mixamorigNeck': 'Neck',
    'mixamorigHead': 'Head',
    'mixamorigLeftShoulder': 'LeftShoulder',
    'mixamorigLeftArm': 'LeftArm',
    'mixamorigLeftForeArm': 'LeftForeArm',
    'mixamorigLeftHand': 'LeftHand',
    'mixamorigLeftHandThumb1': 'LeftHandThumb1',
    'mixamorigLeftHandThumb2': 'LeftHandThumb2',
    'mixamorigLeftHandThumb3': 'LeftHandThumb3',
    'mixamorigLeftHandIndex1': 'LeftHandIndex1',
    'mixamorigLeftHandIndex2': 'LeftHandIndex2',
    'mixamorigLeftHandIndex3': 'LeftHandIndex3',
    'mixamorigLeftHandMiddle1': 'LeftHandMiddle1',
    'mixamorigLeftHandMiddle2': 'LeftHandMiddle2',
    'mixamorigLeftHandMiddle3': 'LeftHandMiddle3',
    'mixamorigLeftHandRing1': 'LeftHandRing1',
    'mixamorigLeftHandRing2': 'LeftHandRing2',
    'mixamorigLeftHandRing3': 'LeftHandRing3',
    'mixamorigLeftHandPinky1': 'LeftHandPinky1',
    'mixamorigLeftHandPinky2': 'LeftHandPinky2',
    'mixamorigLeftHandPinky3': 'LeftHandPinky3',
    'mixamorigRightShoulder': 'RightShoulder',
    'mixamorigRightArm': 'RightArm',
    'mixamorigRightForeArm': 'RightForeArm',
    'mixamorigRightHand': 'RightHand',
    'mixamorigRightHandThumb1': 'RightHandThumb1',
    'mixamorigRightHandThumb2': 'RightHandThumb2',
    'mixamorigRightHandThumb3': 'RightHandThumb3',
    'mixamorigRightHandIndex1': 'RightHandIndex1',
    'mixamorigRightHandIndex2': 'RightHandIndex2',
    'mixamorigRightHandIndex3': 'RightHandIndex3',
    'mixamorigRightHandMiddle1': 'RightHandMiddle1',
    'mixamorigRightHandMiddle2': 'RightHandMiddle2',
    'mixamorigRightHandMiddle3': 'RightHandMiddle3',
    'mixamorigRightHandRing1': 'RightHandRing1',
    'mixamorigRightHandRing2': 'RightHandRing2',
    'mixamorigRightHandRing3': 'RightHandRing3',
    'mixamorigRightHandPinky1': 'RightHandPinky1',
    'mixamorigRightHandPinky2': 'RightHandPinky2',
    'mixamorigRightHandPinky3': 'RightHandPinky3',
    'mixamorigLeftUpLeg': 'LeftUpLeg',
    'mixamorigLeftLeg': 'LeftLeg',
    'mixamorigLeftFoot': 'LeftFoot',
    'mixamorigLeftToeBase': 'LeftToeBase',
    'mixamorigRightUpLeg': 'RightUpLeg',
    'mixamorigRightLeg': 'RightLeg',
    'mixamorigRightFoot': 'RightFoot',
    'mixamorigRightToeBase': 'RightToeBase'
};

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
    const { scene } = useGLTF('/models/avatar.glb');
    const { actions, mixer } = useAnimations([], group);

    useEffect(() => {
        console.log('Avatar base cargado: /models/avatar.glb');
    }, []);

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
            const fileName = `/animations/${animationKey.toLowerCase().replace('letra_', '')}.glb`;
            console.log(`Cargando archivo de animación: ${fileName}`);

            const gltf = await new Promise((resolve, reject) => {
                loader.load(
                    fileName,
                    resolve,
                    undefined,
                    reject
                );
            });

            if (gltf.animations && gltf.animations.length > 0) {
                const clip = gltf.animations[0];
                const newClip = clip.clone();
                newClip.name = animationKey;

                newClip.tracks.forEach((track) => {
                    // 1. Limpiar jerarquía (RootNode)
                    track.name = track.name.replace('RootNode.', '');

                    // 2. Mapear nombres de huesos
                    const parts = track.name.split('.');
                    const boneName = parts[0];
                    const property = parts[1];

                    if (BONE_MAP[boneName]) {
                        track.name = `${BONE_MAP[boneName]}.${property}`;
                    } else if (boneName.endsWith('_JNT')) {
                        // Intento genérico si no está en el mapa
                        const cleanName = boneName.replace('_JNT', '');
                        // Convertir snake_case a CamelCase simple (ej: l_index_JNT -> LIndex ?)
                        // Por ahora dejemos el mapeo explícito como prioritario
                    }
                });

                // Agregar el clip al mixer
                const action = mixer.clipAction(newClip);
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
                action.timeScale = 0.5; // Doble de duración (mitad de velocidad)

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
                // Fade out final (regreso natural al estado base al terminar la secuencia)
                if (previousActionRef.current) {
                    previousActionRef.current.fadeOut(0.5);
                }
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

            // Reproducir la nueva animación
            action.reset();
            action.setEffectiveTimeScale(0.5); // Asegurar velocidad (0.5 = doble duración)
            action.setEffectiveWeight(1); // Asegurar peso

            // Solo usar fadeIn si hay una animación previa fluyendo
            if (previousActionRef.current) {
                action.fadeIn(0.5); // Transición más suave (0.5s)
            }

            action.play();

            // Listener para cuando termine la animación
            const onFinished = (e) => {
                if (e.action === action) {
                    mixer.removeEventListener('finished', onFinished);
                    // No hacemos fadeOut aquí para permitir transición suave a la siguiente palabra
                    // El fadeOut se hace al terminar la secuencia completa o en el crossFade
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
useGLTF.preload('/models/avatar.glb');
