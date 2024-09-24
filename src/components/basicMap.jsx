/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable eqeqeq */
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import React, { useState, useEffect, useRef } from 'react'
import { features } from '@/json/barrios.json'
import 'leaflet/dist/leaflet.css'
import * as turf from '@turf/turf'

const BasicMap = ({ onLocationChange, isActive, editPosition, handlePolygons }) => {
  const initialPosition = {
    latitud: -28.46867672033115,
    longitud: -65.77899050151645
  }
  const [geoData, setGeoData] = useState([])
  const previousPosition = useRef(initialPosition)
  const [address, setAddress] = useState('')

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

  const invertirCoordenadas = (array) => {
    return array.map(coordenada => [coordenada[1], coordenada[0]])
  }

  const [position, setPosition] = useState(() => {
    if (editPosition) {
      return [editPosition.latitud, editPosition.longitud]
    }
    return [initialPosition.latitud, initialPosition.longitud]
  })

  useEffect(() => {
    features.forEach(ft => {
      const coords = ft.geometry.coordinates[0]
      const id = ft.properties.id
      const zona = ft.properties.zona
      const barrio = ft.properties.barrio
      const coordenadasInvertidas = invertirCoordenadas(coords)
      const poli = {
        id,
        zona,
        barrio,
        coords: coordenadasInvertidas
      }
      setGeoData(prevGeoData => [...prevGeoData, poli])
    })
  }, [])

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
  }, [position, onLocationChange, isActive])

  useEffect(() => {
    let isPointInsideAnyPolygon = false

    // Recorremos cada polígono y verificamos si el punto está dentro de ellos
    geoData.forEach((polygonCoords, index) => {
      // Creamos el polígono de turf.js
      const polygon = turf.polygon([[...polygonCoords.coords]])
      const barrio = polygonCoords.barrio
      // Usamos la función booleanPointInPolygon de turf.js
      if (turf.booleanPointInPolygon(position, polygon)) {
        isPointInsideAnyPolygon = true

        handlePolygons(barrio)
      }
    })

    if (!isPointInsideAnyPolygon) {
      handlePolygons('')
    }
  }, [position])

  return (
    <div className='h-full'>
      {geoData !=
      []
        ? <MapContainer
            center={position}
            zoom={16}
            scrollWheelZoom
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
            eventHandlers={{
              dragend: handleMarkerDragEnd
            }}
          >
            <Popup>{address}</Popup>
          </Marker>
          {
            // geoData.map((item, index) =>
            //   <Polygon positions={item?.coords} key={index}

            //   />
            // )

            // <Polygon positions={geoData[0]?.coords} pathOptions={polygonStyle} ref={polygonRef} />
          }

        </MapContainer>
        : ''}
    </div>
  )
}

export default BasicMap
