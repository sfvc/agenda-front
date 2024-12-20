/* eslint-disable react/jsx-closing-tag-location */

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import React, { useState, useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import { initializeGeoData, checkPositionInCircuito, checkPositionInNeigh, checkPositionInSubNeigh } from '@/services/maps.js'
import L from 'leaflet'
import marker1 from '../../node_modules/leaflet/dist/images/marker-icon.png'
import marker2 from '../../node_modules/leaflet/dist/images/marker-icon-2x.png'
import marker3 from '../../node_modules/leaflet/dist/images/marker-shadow.png'

const markerIcon = new L.Icon({
  iconUrl: marker1,
  iconRetinaUrl: marker2,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: marker3,
  shadowSize: [41, 41]
})

const BasicMap = ({ onLocationChange, isActive, editPosition, handleNeight, handleCircuit, handleSub }) => {
  const initialPosition = {
    latitud: -28.46867672033115,
    longitud: -65.77899050151645
  }

  const [position, setPosition] = useState([editPosition ? editPosition.latitud : initialPosition.latitud, editPosition ? editPosition.longitud : initialPosition.longitud])
  const [geoData, setGeoData] = useState([])
  const [geoCircuitos, setGeoCircuitos] = useState([])
  const [geoSubBarrios, setGeoSubBarrios] = useState([])
  const previousPosition = useRef([initialPosition.latitud, initialPosition.longitud])
  const [address, setAddress] = useState('')

  const handleMapClick = (event) => {
    if (!isActive) {
      const { lat, lng } = event.latlng
      setPosition([lat, lng])
    }
  }

  useEffect(() => {
    const { barrios, sub, circuitos } = initializeGeoData()
    setGeoData(barrios)
    setGeoCircuitos(circuitos)
    setGeoSubBarrios(sub)
  }, [])

  useEffect(() => {
    const circuito = checkPositionInCircuito(position, geoCircuitos)
    const barrio = checkPositionInNeigh(position, geoData)
    const subBarrio = checkPositionInSubNeigh(position, geoSubBarrios)
    handleCircuit(circuito)
    handleNeight(barrio)
    if (subBarrio === null) {
      handleSub(barrio)
    } else {
      handleSub(subBarrio)
    }
  }, [position])

  const handleMarkerDragEnd = (event) => {
    if (!isActive) {
      const { lat, lng } = event.target.getLatLng()
      setPosition([lat, lng])
    }
  }

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

    if (isActive || (position[0] !== previousPosition.current[0] || position[1] !== previousPosition.current[1])) {
      getAddressFromCoordinates(position[0], position[1])
      previousPosition.current = position
    }
  }, [position, onLocationChange, isActive])

  useEffect(() => {
    if (editPosition) {
      setPosition([editPosition.latitud, editPosition.longitud])
    }
  }, [editPosition])

  return (
    <div className='h-full'>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        onClick={handleMapClick}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker
          position={position}
          draggable={!isActive}
          icon={markerIcon}
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
