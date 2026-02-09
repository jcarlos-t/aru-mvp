/**
 * Motor de Glosas para la Lengua de Señas Peruana (LSP)
 * Convierte texto en español a la estructura de glosas LSP
 */

/**
 * Lista de palabras que se eliminan en el proceso de limpieza
 */
const ARTICLES = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas'];
const PREPOSITIONS = ['de', 'para', 'con', 'en', 'a', 'por', 'sin', 'sobre', 'entre', 'desde', 'hasta'];
const CONNECTORS = ['y', 'e', 'o', 'u', 'pero', 'mas', 'sino', 'que'];
const SER_ESTAR = ['soy', 'eres', 'es', 'somos', 'sois', 'son', 'estoy', 'estás', 'está', 'estamos', 'estáis', 'están'];

/**
 * Limpia el texto removiendo artículos, preposiciones y conectores
 * @param {string} text - Texto en español a limpiar
 * @returns {string[]} Array de palabras limpias en mayúsculas
 */
export function cleanText(text) {
    // Convertir a minúsculas y dividir en palabras
    const words = text.toLowerCase().trim().split(/\s+/);

    // Filtrar palabras no deseadas
    const cleaned = words.filter(word => {
        return !ARTICLES.includes(word) &&
            !PREPOSITIONS.includes(word) &&
            !CONNECTORS.includes(word) &&
            !SER_ESTAR.includes(word);
    });

    // Convertir a mayúsculas (formato de glosa)
    return cleaned.map(word => word.toUpperCase());
}

/**
 * Reordena las palabras siguiendo la estructura LSP (SOV - Sujeto-Objeto-Verbo)
 * Implementación simplificada para MVP
 * @param {string[]} words - Array de palabras limpias
 * @returns {string[]} Array de palabras reordenadas
 */
export function reorderToLSP(words) {
    // Para el MVP, mantenemos un reordenamiento simple
    // En versiones futuras, se puede implementar análisis sintáctico más complejo

    // Por ahora, solo retornamos las palabras como están
    // TODO: Implementar lógica SOV más sofisticada
    return words;
}

/**
 * Convierte una palabra en un array de letras para dactilología (deletreo)
 * @param {string} word - Palabra a deletrear
 * @returns {string[]} Array de letras individuales
 */
export function splitToDactylology(word) {
    // Eliminar caracteres especiales y convertir a array de letras
    const letters = word.replace(/[^A-Z]/g, '').split('');

    // Retornar array con formato de dactilología (cada letra como una seña)
    return letters.map(letter => `LETRA_${letter}`);
}

/**
 * Función principal: Convierte texto en español a secuencia de animaciones LSP
 * @param {string} text - Texto en español a traducir
 * @param {Object} dictionary - Diccionario de palabras a rutas de animación
 * @returns {string[]} Array de claves de animación para reproducir en secuencia
 */
export function textToGloss(text, dictionary) {
    // Validar entrada
    if (!text || text.trim() === '') {
        return [];
    }

    // Paso 1: Limpiar el texto
    const cleanedWords = cleanText(text);

    // Paso 2: Reordenar según estructura LSP
    const reorderedWords = reorderToLSP(cleanedWords);

    // Paso 3: Mapear a animaciones o dactilología
    const animationQueue = [];

    for (const word of reorderedWords) {
        if (dictionary[word]) {
            // La palabra existe en el diccionario
            animationQueue.push(word);
        } else {
            // Palabra no encontrada: usar dactilología (deletreo)
            const letters = splitToDactylology(word);
            animationQueue.push(...letters);
        }
    }

    return animationQueue;
}

/**
 * Formatea una palabra según las convenciones de glosa LSP
 * @param {string} word - Palabra a formatear
 * @param {boolean} isCompound - Si es una seña compuesta
 * @returns {string} Palabra formateada
 */
export function formatGloss(word, isCompound = false) {
    const formatted = word.toUpperCase();

    if (isCompound) {
        // Señas compuestas se unen con guion (ej: NOCHE-COMER)
        return formatted.replace(/\s+/g, '-');
    }

    return formatted;
}

/**
 * Marca pluralización según convención LSP (++)
 * @param {string} word - Palabra base
 * @param {boolean} isPlural - Si es plural
 * @returns {string} Palabra con marca de plural si aplica
 */
export function markPlural(word, isPlural = false) {
    return isPlural ? `${word}++` : word;
}
