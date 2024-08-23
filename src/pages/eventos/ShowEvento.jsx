import React, { useEffect, useState } from 'react'
import { Card } from 'flowbite-react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchEventById } from '@/services'
import { formatDate } from '../../components/Format'
import BasicMap from '../../components/basicMap'

export const ShowEvento = () => {
  const [activeEvento, setActiveEvento] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const getEvent = async () => {
      try {
        const evento = await fetchEventById(id)
        setActiveEvento(evento)
      } catch (error) {
        console.error('Error fetching event:', error)
      }
    }

    getEvent()
  }, [id])

  // Parsear la ubicación
  const ubicacion = activeEvento ? JSON.parse(activeEvento.ubicacion) : { latitud: 0, longitud: 0 }

  return (
    activeEvento && (
      <div>
        <Card>
          <div>
            <h4 className='card-title text-center bg-blue-500 dark:bg-gray-700 text-white rounded-md p-2'>
              Detalles del Evento
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
              <div className='border-b py-2 px-4'>
                <strong>Nombre del Solicitante:</strong> {activeEvento.nombre_solicitante}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Email del Solicitante:</strong> {activeEvento.email_solicitante}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Teléfono del Solicitante:</strong> {activeEvento.telefono_solicitante}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Descripción:</strong> {activeEvento.descripcion}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Fecha:</strong> {formatDate(activeEvento.fecha)}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Ubicación:</strong> {activeEvento.ubicacion}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Detalle de Planificación:</strong> {activeEvento.detalle_planificacion}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Categoría:</strong> {activeEvento.categoria.nombre}
              </div>
            </div>

            <div>
              <BasicMap latitud={ubicacion.latitud} longitud={ubicacion.longitud} />
            </div>
          </div>

          <div className='mt-4 flex justify-end gap-4'>
            <button className='btn-danger items-center text-center py-2 px-6 rounded-lg' onClick={() => navigate('/eventos')}>
              Volver
            </button>
          </div>
        </Card>

      </div>
    )
  )
}
