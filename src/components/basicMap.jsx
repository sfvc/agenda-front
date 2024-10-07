/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable eqeqeq */
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet'
import React, { useState, useEffect, useRef } from 'react'
import { features } from '@/json/barrios.json'
import data from "@/json/circuitos_electorales.json"
import 'leaflet/dist/leaflet.css'
import * as turf from '@turf/turf'

const BasicMap = ({ onLocationChange, isActive, editPosition, handleNeight, handleCircuit }) => {
  const initialPosition = {
    latitud: -28.46867672033115,
    longitud: -65.77899050151645
  }
  const [geoData, setGeoData] = useState([])
  const [geoCircuitos, setGeoCircuitos] = useState([])
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
    const coords = array.map(coordenada => [coordenada[1], coordenada[0]]);
    // Asegúrate de que la primera y la última coordenadas sean iguales
    if (coords.length > 0 && (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])) {
      coords.push(coords[0]);
    }
    return coords;
  };

  const [position, setPosition] = useState(() => {
    if (editPosition) {
      return [editPosition.latitud, editPosition.longitud]
    }
    return [initialPosition.latitud, initialPosition.longitud]
  })

  useEffect(() => {
    const geoDataTemp = features.map(ft => {
      const coords = invertirCoordenadas(ft.geometry.coordinates[0]);
      return {
        id: ft.properties.id,
        zona: ft.properties.zona,
        barrio: ft.properties.barrio,
        coords,
      };
    });

    setGeoData(geoDataTemp);

    const geoCircuitosTemp = data.features.map(ft => {
      const coords = invertirCoordenadas(ft.geometry.coordinates[0]);
      return {
        id: ft.properties.id,
        circuito: ft.properties.circuitos,
        coords,
      };
    });

    setGeoCircuitos(geoCircuitosTemp);
  }, []);


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
    let found = false;
    for (const polygonCoords of geoCircuitos) {
      // Asegúrate de que polygonCoords.coords tiene 4 o más posiciones
      if (polygonCoords.coords.length >= 4) {
        const polygon = turf.polygon([polygonCoords.coords]);
        if (turf.booleanPointInPolygon(position, polygon)) {
          handleCircuit( polygonCoords.circuito );
          found = true;
          break;
        }
      }
    }
    if (!found) {
      handleCircuit('');
    }
  }, [position, geoCircuitos]);
useEffect(() => {
    let found = false;
    for (const polygonCoords of geoData) {
      const polygon = turf.polygon([[...polygonCoords.coords]]);
      if (turf.booleanPointInPolygon(position, polygon)) {
        handleNeight( polygonCoords.barrio );
        found = true;
        break;
      }
    }
    if (!found) {
      handleNeight('');
    }
  }, [position]);
  return (
    <div className='h-full'>
      {geoCircuitos.length > 0
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
        </MapContainer>
        : null}
    </div>
  )
}

export default BasicMap


