import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import React, { useState } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const getIconByState = (estado) => {
  switch (estado) {
    case 'activo':
      return new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png', // Verde para activo
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41]
      })
    case 'inactivo':
      return new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png', // Rojo para inactivo
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41]
      })
    case 'pendiente':
      return new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png', // Naranja para pendiente
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41]
      })
    default:
      return new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png', // Azul por defecto
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41]
      })
  }
}

export const MapEvent = ({ isActive, events }) => {
  const initialPosition = [
    -28.46867672033115,
    -65.77899050151645
  ]

  const extractUbicaciones = (list) => {
    return list.map(item => {
      const ubicacion = JSON.parse(item.ubicacion)

      return {
        latitud: ubicacion.latitud,
        longitud: ubicacion.longitud,
        direccion: separarTresPrimerosElementos(ubicacion.direccion),
        estado: item.estado
      }
    })
  }

  function separarTresPrimerosElementos (cadena) {
    const elementos = cadena.split(',').map(elemento => elemento.trim())
    const primerosTres = elementos.slice(0, 3)
    return primerosTres.join(', ')
  }

  const ubicaciones = extractUbicaciones(events)
  const [position] = useState(initialPosition)

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
              key={index}
              position={[item.latitud, item.longitud]}
              draggable={!isActive}
              icon={getIconByState(item.estado)} // Aquí seleccionas el ícono según el estado
            >
              <Popup>{item.direccion}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  )
}
