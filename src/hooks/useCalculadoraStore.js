import { useDispatch, useSelector } from "react-redux"
import { calcularPaneles } from "../store/calculadora/calculadoraSlice"
import calculadoraApi from "../api/calculadoraApi"

import Swal from "sweetalert2"

export const useCalculadoraStore = () => {

    const dispatch = useDispatch()
    const { panel, techo, verticalFirst, horizontalFirst, maxPanel } = useSelector(state => state.calculadora)

    const startCalcularPaneles = async (panel, techo) => {

        try {

            const response = await calculadoraApi.post('/events/calcularPaneles', {
                a: panel.alto,
                b: panel.ancho,
                x: techo.ancho,
                y: techo.alto
            });

            const { verticalFirst, maxPanel } = response.data

            localStorage.setItem('panel_alto', panel.alto)
            localStorage.setItem('panel_ancho', panel.ancho)
            localStorage.setItem('techo_alto', techo.alto)
            localStorage.setItem('techo_ancho', techo.ancho)
            localStorage.setItem('cantVerticalFirst', verticalFirst.cantVerticalFirst)
            localStorage.setItem('cantHorizontalSecond', verticalFirst.cantHorizontalSecond)
            localStorage.setItem('maxPanel', maxPanel)

            dispatch(calcularPaneles({
                panel: { a: panel.alto, b: panel.ancho },
                techo: { x: techo.ancho, y: techo.alto },
                verticalFirst,
                maxPanel
            }))

            return response.data.ok

        } catch (error) {

            console.log(error)

            if (!error.response) {
                Swal.fire('Error de red', 'No se pudo establecer conexión con el servidor.', 'error');
            } else {
                const errorMessage = error.response.data?.msg || Object.values(error.response.data?.errors ?? {})[0]?.msg || 'Ocurrió un error desconocido.';
                Swal.fire('Error al calcular', errorMessage, 'error');
            }

            return false;

        }

    }

    return {
        //* Propiedades
        panel,
        techo,
        verticalFirst,
        horizontalFirst,
        maxPanel,

        //* Metodos
        startCalcularPaneles,
    }
}
