import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { SelectForm } from '@/components/agenda/forms'
import { getEventoById, createEvento, updateEvento } from '@/services/eventService'
import { useQuery } from '@tanstack/react-query'
import { getCategoryById } from '@/services/categoryService'
import Button from '@/components/ui/Button'
import Loading from '@/components/Loading'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Textarea from '@/components/ui/Textarea'
import DatePicker from '@/components/ui/DatePicker'
import BasicMap from '@/components/basicMap'
import { toast } from 'react-toastify'

const initialForm = {
  nombre_solicitante: '',
  email_solicitante: '',
  telefono_solicitante: '',
  descripcion: '',
  fecha: '',
  categoria: '',
  ubicacion: '',
  location:'',
  summary:''
  // estado: 'PENDIENTE'
}
const initialPosition = {
  latitud: -28.46867672033115,
  longitud: -65.77899050151645
}

export const Create = () => {
  const [position, setPosition] = useState(initialPosition)
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [, setFormData] = useState(initialForm)
  const { data: categorias } = useQuery({
    queryKey: ['categoria'],
    queryFn: getCategoryById
  })

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    watch
  } = useForm()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleDateChange = (date) => {
    setValue('fecha', date ? date[0].toISOString() : '')
    console.log(date);
  }

  const handleLocationChange = (latitud, longitud, direccion) => {
    setValue('ubicacion', JSON.stringify({ latitud, longitud, direccion }))
    setValue('location',direccion)
  }

  const onSubmit = async (items) => {
    items.categoria_id = parseInt(items.categoria_id)

  
    try {
      if (!id) {
        await createEvento(items)
        toast.success('Evento creado exitosamente')
      } else {
        await updateEvento(id, items)
        toast.success('Evento editado exitosamente')
      }

      navigate('/eventos')
    } catch (error) {
      toast.error('Hubo un error al crear el evento')
    }
  }


  const loadEvento = async () => {
    if (id) {
      try {
        const evento = await getEventoById(id)
        setValue('nombre_solicitante', evento.nombre_solicitante)
        setValue('email_solicitante', evento.email_solicitante)
        setValue('telefono_solicitante', evento.telefono_solicitante)
        setValue('fecha', new Date(evento.fecha))
        setValue('categoria_id', evento.categoria_id)
        // setValue('detalle_planificacion', evento.detalle_planificacion)
        setValue('descripcion', evento.descripcion)
        setValue('ubicacion', evento.ubicacion)
        setPosition(JSON.parse(evento.ubicacion))
     
// console.log(evento);a
      } catch (error) {
        console.error('Error al cargar el evento:', error)
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadEvento()
  }, [id])

  return (
    <>
      {isLoading
        ? (
          <Loading className='mt-28 md:mt-64' />
        )
        : (
          <div>
            <Card>
              <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 md:grid-cols-2 gap-4'>

                <div>
                  <label htmlFor='nombre_solicitante' className='form-label'>
                    Nombre del Solicitante
                  </label>
                  <Textinput
                    name='nombre_solicitante'
                    type='text'
                    placeholder='Ingrese el nombre'
                    register={register}
                    onChange={handleChange}
                    errors={errors.nombre_solicitante}
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
                    register={register}
                    onChange={handleChange}
                    errors={errors.email_solicitante}
                  />
                </div>

                <div>
                  <label htmlFor='telefono_solicitante' className='form-label'>
                    Teléfono del Solicitante
                  </label>
                  <Textinput
                    type='text'
                    name='telefono_solicitante'
                    placeholder='Ingrese el teléfono'
                    register={register}
                    onChange={handleChange}
                    errors={errors.telefono_solicitante}
                  />
                </div>

                <div>
                  <label htmlFor='fecha' className='form-label'>
                    Fecha del Evento
                  </label>
                  <DatePicker
                    placeholder="Seleccione la fecha del evento"
                    value={watch('fecha') ? new Date(watch('fecha')) : null}
                    onChange={handleDateChange}
                  />
                </div>

                <SelectForm
                  register={register('categoria_id')}
                  title='Categoria'
                  options={categorias}
                  errors={errors.categoria_id}
                  onChange={handleChange}
                />

                {/* <div>
                  <label htmlFor='detalle_planificacion' className='form-label'>
                    Detalle de la Planificación
                  </label>
                  <Textinput
                    name='detalle_planificacion'
                    type='text'
                    placeholder='Ingrese el detalle de la planificación'
                    register={register}
                    onChange={handleChange}
                    errors={errors.detalle_planificacion}
                  />
                </div> */}

                <div className='hidden'>
                  <label htmlFor='ubicacion' className='form-label'>
                    Ubicación
                  </label>
                  <Textinput
                    name='ubicacion'
                    type='text'
                    placeholder='Ingrese la ubicación'
                    register={register}
                    errors={errors.ubicacion}
                  />
                </div>

                <div>
                  <label htmlFor='descripcion' className='form-label'>
                    Descripción
                  </label>
                  <Textarea
                    name='descripcion'
                    placeholder='Ingrese una descripción del evento'
                    register={register}
                    errors={errors.descripcion}
                  />
                </div>

                <div>
                  <label htmlFor='summary' className='form-label'>
                    Nombre del Evento
                  </label>
                  <Textarea
                    name='summary'
                   
                    placeholder='Ingrese un nombre al evento'
                    register={register}
                    errors={errors.summary}
                  />
                </div>
                <div>
                  <label htmlFor='location' className='form-label'>
                    Localizacion
                  </label>
                  <Textarea
                    name='location'
                    readonly
                    placeholder='la localizacion se obtiene del mapa'
                    register={register}
                    errors={errors.location}
                  />
                </div>

              </form>
            </Card>

            <div className='h-96 w-full'>
              <BasicMap onLocationChange={handleLocationChange} editPosition={position} />
            </div>

            <div className='flex justify-end gap-4 mt-8'>
              <div className='ltr:text-right rtl:text-left'>
                <button
                  className='btn-danger items-center text-center py-2 px-6 rounded-lg'
                  onClick={() => navigate('/eventos')}
                >
                  Volver
                </button>
              </div>
              <div className='ltr:text-right rtl:text-left'>
                <Button
                  type='submit'
                  text={isSubmitting ? 'Guardando' : 'Guardar'}
                  className={`bg-green-500 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700'} text-white items-center text-center py-2 px-6 rounded-lg`}
                  disabled={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                />
              </div>
            </div>
          </div>
        )}
    </>
  )
}
