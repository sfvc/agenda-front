import React, { useState } from 'react'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import Textarea from '@/components/ui/Textarea'
import { SelectForm } from '@/components/agenda/forms'
import DatePicker from '@/components/ui/DatePicker'
import Loading from '@/components/Loading'
import { createEvent } from '@/services/eventService'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { getCategoryById } from '@/services/categoryService'
import BasicMap from '@/components/basicMap'

const initialForm = {
  nombre_solicitante: '',
  email_solicitante: '',
  telefono_solicitante: '',
  descripcion: '',
  fecha: '',
  categoria: '',
  ubicacion: '',
  estado: 'PENDIENTE'
}

const CrearEventoData = () => {
  const [formData, setFormData] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useForm()
  const { data: categorias } = useQuery({
    queryKey: ['categoria'],
    queryFn: getCategoryById
  })

  const mutation = useMutation({
    mutationFn: createEvent,
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
    mutation.mutate(formData)
  }

  // Función para manejar el cambio de ubicación
  const handleLocationChange = (latitud, longitud, direccion) => {
    setFormData((prevState) => ({
      ...prevState,
      ubicacion: JSON.stringify({ latitud, longitud, direccion })
    }))
  }

  return (
    <>
      {mutation.isLoading || isLoading
        ? (
          <Loading className='mt-28 md:mt-64' />
          )
        : (
          <div>
            <h4 className='card-title text-center bg-blue-500 dark:bg-gray-700 text-white rounded-md p-2'>
              Crear Evento
            </h4>

            <Card>
              <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4'>

                <div>
                  <label htmlFor='nombre_solicitante' className='form-label'>
                    Nombre del Solicitante
                  </label>
                  <Textinput
                    name='nombre_solicitante'
                    type='text'
                    placeholder='Ingrese el nombre'
                    onChange={handleChange}
                    register={register}
                  />
                </div>

                <div>
                  <label htmlFor='email_solicitante' className='form-label'>
                    Email del Solicitante
                  </label>
                  <Textinput
                    name='email_solicitante'
                    type='email'
                    placeholder='Ingrese un email'
                    onChange={handleChange}
                    register={register}
                  />
                </div>

                <div>
                  <label htmlFor='telefono_solicitante' className='form-label'>
                    Teléfono del Solicitante
                  </label>
                  <Numberinput
                    type='number'
                    name='telefono_solicitante'
                    placeholder='Ingrese el teléfono'
                    onChange={handleChange}
                    register={register}
                  />
                </div>

                <div>
                  <label htmlFor='fecha' className='form-label'>
                    Fecha del Evento
                  </label>
                  <DatePicker
                    placeholder='Seleccione la fecha del evento'
                    onChange={handleDateChange}
                    register={register}
                  />
                </div>

                <SelectForm
                  register={register('categoria_id')}
                  title='Categoria'
                  options={categorias}
                />

                <div>
                  <label htmlFor='detalle_planificacion' className='form-label'>
                    Detalle de la Planificacion
                  </label>
                  <Textinput
                    name='detalle_planificacion'
                    type='text'
                    placeholder='Ingrese el detalle de la planificacion'
                    onChange={handleChange}
                    register={register}
                  />
                </div>

                <div>
                  <label htmlFor='ubicacion' className='form-label'>
                    Ubicacion
                  </label>
                  <Textinput
                    name='ubicacion'
                    type='text'
                    placeholder='Ingrese la ubicacion'
                    onChange={handleChange}
                    register={register}
                  />
                </div>

                <div>
                  <label htmlFor='descripcion' className='form-label'>
                    Descripción
                  </label>
                  <Textarea
                    name='descripcion'
                    type='text'
                    placeholder='Ingrese una descripción del evento'
                    onChange={handleChange}
                    register={register}
                  />
                </div>

              </form>
            </Card>

            <div className='h-96 w-full'>
              <BasicMap onLocationChange={handleLocationChange} />
            </div>

          </div>
          )}
    </>
  )
}

export default CrearEventoData
