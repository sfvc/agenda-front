import React, { useState } from 'react'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import DatePicker from '../ui/DatePicker'
import Loading from '@/components/Loading'
import { createEvent } from '../../services/eventService'
import { useMutation } from '@tanstack/react-query'

const initialForm = {
  nombre: '',
  descripcion: '',
  fecha: '',
  ubicacion: '',
  organizador: ''
}

const CrearEventoData = () => {
  const [formData, setFormData] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(false)

  const mutation = useMutation(createEvent, {
    onMutate: () => {
      setIsLoading(true)
    },
    onError: (error) => {
      console.error('Error al crear el evento:', error)
      setIsLoading(false)
    },
    onSettled: () => {
      setIsLoading(false)
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleDateChange = (date) => {
    setFormData((prevState) => ({
      ...prevState,
      fecha: date ? date[0] : ''
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(formData) // Llama a la mutación con los datos del formulario
  }

  return (
    <>
      {mutation.isLoading || isLoading
        ? (
          <Loading className='mt-28 md:mt-64' />
          )
        : (
          <div>
            <h4 className='card-title text-center bg-green-500 dark:bg-gray-700 text-white rounded-md p-2'>
              Crear Evento
            </h4>

            <Card>
              <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='nombre' className='form-label'>
                    Nombre del Evento
                    <strong className='obligatorio'>(*)</strong>
                  </label>
                  <Textinput
                    name='nombre'
                    type='text'
                    placeholder='Ingrese el nombre del evento'
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor='descripcion' className='form-label'>
                    Descripción
                  </label>
                  <Textinput
                    name='descripcion'
                    type='text'
                    placeholder='Ingrese una descripción del evento'
                    value={formData.descripcion}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor='fecha' className='form-label'>
                    Fecha
                  </label>
                  <DatePicker
                    value={formData.fecha ? [new Date(formData.fecha)] : null}
                    placeholder='Seleccione la fecha del evento'
                    onChange={handleDateChange}
                  />
                </div>

                <div>
                  <label htmlFor='ubicacion' className='form-label'>
                    Ubicación
                  </label>
                  <Textinput
                    name='ubicacion'
                    type='text'
                    placeholder='Ingrese la ubicación del evento'
                    value={formData.ubicacion}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor='organizador' className='form-label'>
                    Organizador
                  </label>
                  <Textinput
                    name='organizador'
                    type='text'
                    placeholder='Ingrese el nombre del organizador'
                    value={formData.organizador}
                    onChange={handleChange}
                  />
                </div>

                <div className='col-span-2 flex justify-end'>
                  <button type='submit' className='btn-primary' disabled={mutation.isLoading}>
                    Crear Evento
                  </button>
                </div>
              </form>
            </Card>
          </div>
          )}
    </>
  )
}

export default CrearEventoData
