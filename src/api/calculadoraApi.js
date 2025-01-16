import axios from 'axios'
import { getEnvVariables } from '../helpers'

const { VITE_API_URL, VITE_USER, VITE_EMAIL, VITE_PASS} = getEnvVariables()

const calculadoraApi = axios.create({
    baseURL: VITE_API_URL
})

const obtenerToken = async () => {

    try {

        const response = await calculadoraApi.post('/auth/obtenerToken', {
            user: VITE_USER,
            email: VITE_EMAIL,
            pass: VITE_PASS
        });

        const { ok, token } = response.data;

        if (ok) {
            localStorage.setItem('token', token);
            localStorage.setItem('tokenTimestamp', Date.now());

            return token

        }
    } catch (error) {
        console.error("Error en la solicitud:", error.response ? error.response.data : error.message);
    }
    
}

const getTokenLocalStorage = () => {
    const token = localStorage.getItem('token');
    const timestamp = localStorage.getItem('tokenTimestamp');
    const currentTime = Date.now();

    if (token && timestamp && currentTime - timestamp < 7200000) {
        return token; 
    }

    return null;
};


export {
    calculadoraApi,
    obtenerToken,
    getTokenLocalStorage
};