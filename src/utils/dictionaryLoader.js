/**
 * Utilidad para cargar el diccionario de glosas LSP
 */
import dictionaryData from '../data/dictionary.json';

/**
 * Diccionario de palabras LSP a rutas de archivo de animación
 * @type {Object<string, string>}
 */
export const dictionary = dictionaryData;

/**
 * Verifica si una palabra existe en el diccionario
 * @param {string} word - Palabra en formato de glosa (mayúsculas)
 * @returns {boolean} True si la palabra existe
 */
export function hasWord(word) {
    return word.toUpperCase() in dictionary;
}

/**
 * Obtiene la ruta de animación para una palabra
 * @param {string} word - Palabra en formato de glosa
 * @returns {string|null} Ruta del archivo de animación o null si no existe
 */
export function getAnimationPath(word) {
    return dictionary[word.toUpperCase()] || null;
}

/**
 * Obtiene todas las palabras disponibles en el diccionario
 * @returns {string[]} Array de palabras disponibles
 */
export function getAvailableWords() {
    return Object.keys(dictionary);
}

export default dictionary;
