import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import React, { useState, useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

const BasicMap = ({ onLocationChange, isActive, editPosition }) => {
  const initialPosition = {
    latitud: -28.46867672033115,
    longitud: -65.77899050151645
  }

  const previousPosition = useRef(initialPosition)

  const [position, setPosition] = useState(() => {
    if (editPosition) {
      return [editPosition.latitud, editPosition.longitud]
    }
    return [initialPosition.latitud, initialPosition.longitud]
  })

  const [address, setAddress] = useState('')

  // if (!isActive) {
    useEffect(() => {
      const getAddressFromCoordinates = async (lat, lng) => {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        try {
          const response = await fetch(url)
          const data = await response.json()
          setAddress(data.display_name)
          onLocationChange(lat, lng, data.display_name)
        } catch (error) {
          console.error('Error:', error)
        }
      }

      if (isActive) {
        getAddressFromCoordinates(position[0], position[1])
      }

      if (position[0] !== previousPosition.current[0] || position[1] !== previousPosition.current[1]) {
        getAddressFromCoordinates(position[0], position[1])
        previousPosition.current = position
      }
    }, [position, onLocationChange,isActive])
  // }

  const handleMapClick = (event) => {
    if (!isActive) {
      const { lat, lng } = event.latlng
      setPosition([lat, lng])
    }
  }

  const handleMarkerDragEnd = (event) => {
    if (!isActive) {
      const { lat, lng } = event.target.getLatLng()
      setPosition([lat, lng])
    }
  }

  return (
    <div className='h-full'>
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
        onClick={handleMapClick}
      >
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        <Marker
          position={position}
          draggable={!isActive}
          eventHandlers={{
            dragend: handleMarkerDragEnd
          }}
        >
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default BasicMap
