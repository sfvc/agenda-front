import { features } from '@/json/barrios.json'
import data from '@/json/circuitos_electorales.json'
import { subBarrios } from "@/json/subBarrios.json"
import * as turf from '@turf/turf'

let geoData = [];
let geoCircuitos = [];
let geoSubBarrios = [];
let position = [/* coordenadas iniciales */];

//INVIERTE LAS COORDENADAS
const invertirCoordenadas = (array) => {
    const coords = array.map(coordenada => [coordenada[1], coordenada[0]])
    // Asegúrate de que la primera y la última coordenadas sean iguales
    if (coords.length > 0 && (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])) {
        coords.push(coords[0])
    }
    return coords
}

//CREA LOS POLIGONOS
export const initializeGeoData = () => {
    const geoDataTemp = features.map(ft => {
        const coords = invertirCoordenadas(ft.geometry.coordinates[0]);
        return {
            id: ft.properties.id,
            zona: ft.properties.zona,
            barrio: ft.properties.barrio,
            coords
        };
    });
    geoData = geoDataTemp;


    const geoCircuitosTemp = data.features.map(ft => {
        const coords = invertirCoordenadas(ft.geometry.coordinates[0]);
        return {
            id: ft.properties.id,
            circuito: ft.properties.circuitos,
            coords
        };
    });
    geoCircuitos = geoCircuitosTemp;


    const geoSubTemp = subBarrios.map(ft => {
        const coords = invertirCoordenadas(ft.coordinates[0]);
        return {
            id: ft.REFERENCIA,
            subBarrio: ft.SUBBARRIO,
            coords
        };
    });
    geoSubBarrios = geoSubTemp;
    return { barrios: geoData, circuitos: geoCircuitos, sub: geoSubBarrios }

};





export const checkPositionInCircuito = (position, geoCircuitos) => {
    let found = false;

    for (const polygonCoords of geoCircuitos) {
        // Asegúrate de que polygonCoords.coords tiene 4 o más posiciones
        if (polygonCoords.coords.length >= 4) {
            const polygon = turf.polygon([polygonCoords.coords]); // Crea el polígono con las coordenadas
            if (turf.booleanPointInPolygon(position, polygon)) {
                return polygonCoords.circuito
            }
        }
    }
    if (!found) {
        return null // Llama a handleCircuit con una cadena vacía si no se encontró ningún polígono que contenga la posición
    }
};

export const checkPositionInNeigh = (position, geoCircuitos) => {
    let found = false;

    for (const polygonCoords of geoCircuitos) {
        // Asegúrate de que polygonCoords.coords tiene 4 o más posiciones
        if (polygonCoords.coords.length >= 4) {
            const polygon = turf.polygon([polygonCoords.coords]); // Crea el polígono con las coordenadas
            if (turf.booleanPointInPolygon(position, polygon)) {
                return polygonCoords.barrio
            }
        }
    }
    if (!found) {
        return null // Llama a handleCircuit con una cadena vacía si no se encontró ningún polígono que contenga la posición
    }
};

export const checkPositionInSubNeigh = (position, geoCircuitos) => {
    let found = false;

    for (const polygonCoords of geoCircuitos) {
        // Asegúrate de que polygonCoords.coords tiene 4 o más posiciones
        if (polygonCoords.coords.length >= 4) {
            const polygon = turf.polygon([polygonCoords.coords]); // Crea el polígono con las coordenadas
            if (turf.booleanPointInPolygon(position, polygon)) {
                return polygonCoords.subBarrio
            }
        }
    }
    if (!found) {
        return null // Llama a handleCircuit con una cadena vacía si no se encontró ningún polígono que contenga la posición
    }
};