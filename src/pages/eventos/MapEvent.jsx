import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import React, { useState, useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

export const MapEvent = ({ isActive, events }) => {
    const initialPosition = [
        -28.46867672033115,
        -65.77899050151645
    ]

    const extractUbicaciones = (list) => {
        return list.map(item => {
            const ubicacion = JSON.parse(item.ubicacion);

            return {
                latitud: ubicacion.latitud,
                longitud: ubicacion.longitud,
                direccion: separarTresPrimerosElementos(ubicacion.direccion)
            };
        });
    };
    function separarTresPrimerosElementos(cadena) {
        // Divide la cadena por comas y recorta espacios adicionales
        const elementos = cadena.split(',').map(elemento => elemento.trim());

        // Toma los primeros tres elementos
        const primerosTres = elementos.slice(0, 3);
        const resultadoEnCadena = primerosTres.join(', ');
        return resultadoEnCadena;
    }


    const ubicaciones = extractUbicaciones(events);

    const [position, setPosition] = useState(initialPosition)
    return (
        <>
            <div className='h-[500px] w-full'>
                <MapContainer
                    scrollWheelZoom={false}
                    center={position}
                    zoom={14}

                    style={{ height: '100%', width: '100%' }}

                >
                    <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                    {ubicaciones.map((item, index) => (
                        <Marker
                            key={index} // Idealmente un identificador único
                            position={[item.latitud, item.longitud]}
                            draggable={!isActive}
                        >
                            <Popup>{item.direccion}</Popup>
                        </Marker>
                    ))}

                </MapContainer>
            </div>
        </>
    )
}