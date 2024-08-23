import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import React, { useState, useEffect } from 'react'
import 'leaflet/dist/leaflet.css'

const BasicMap = ({ latitud, longitud }) => {
  const initialPosition = [latitud, longitud]
  const [address, setAddress] = useState('')

  useEffect(() => {
    const getAddressFromCoordinates = async (lat, lng) => {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      try {
        const response = await fetch(url)
        const data = await response.json()
        setAddress(data.display_name)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    getAddressFromCoordinates(latitud, longitud)
  }, [latitud, longitud])

  return (
    <div className='h-screen w-scren'>
      <MapContainer
        center={initialPosition}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        <Marker position={initialPosition}>
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default BasicMap
