import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { SelectForm } from '@/components/agenda/forms'
import { getEventoById, createEvento, updateEvento } from '@/services/eventService'
import { useQuery } from '@tanstack/react-query'
import { getCategoryBySelect } from '@/services/categoryService'
import Button from '@/components/ui/Button'
import Loading from '@/components/Loading'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Textarea from '@/components/ui/Textarea'
import DatePicker from '@/components/ui/DatePicker'
import BasicMap from '@/components/basicMap'
import { toast } from 'react-toastify'
import { LabelsSelect } from '../../components/agenda/forms/LabelsSelect'
const initialForm = {
  nombre_solicitante: '',
  email_solicitante: '',
  telefono_solicitante: '',
  descripcion: '',
  fecha: '',
  categoria: '',
  ubicacion: '',
  location: '',
  summary: '',
  barrio: '',
  circuito: '',
  etiquetas_ids:[]
}



const initialPosition = {
  latitud: -28.46867672033115,
  longitud: -65.77899050151645
}

export const Create = () => {
  const [position, setPosition] = useState(initialPosition)
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [etiquetas,setEtiquetas] = useState([])
  const [, setFormData] = useState(initialForm)
  const { data: categorias } = useQuery({
    queryKey: ['categoria'],
    queryFn: getCategoryBySelect
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
  }

  const handleLocationChange = (latitud, longitud, direccion) => {
    setValue('ubicacion', JSON.stringify({ latitud, longitud, direccion }))
    setValue('location', direccion)
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

  const handleNeight = (e) => {
    setValue('barrio', e)
  }

  const handleCircuit = (e) => {
    setValue('circuito', e)
  }

  const handleLabels = (e) => {
    setValue('etiquetas_ids',e)
   
  }

  const loadEvento = async () => {
    if (id) {
      try {
        const evento = await getEventoById(id)
        setEtiquetas(evento.etiquetas)
        setValue('nombre_solicitante', evento.nombre_solicitante)
        setValue('email_solicitante', evento.email_solicitante)
        setValue('telefono_solicitante', evento.telefono_solicitante)
        setValue('fecha', new Date(evento.fecha))
        setValue('categoria_id', evento.categoria_id)
        setValue('descripcion', evento.descripcion)
        setValue('ubicacion', evento.ubicacion)
        setValue('summary', evento.summary)
        setValue('circuito', evento.circuito)
        setPosition(JSON.parse(evento.ubicacion))
        setTimeout(() => {
          setValue('barrio', evento.barrio)
        }, 100)
        setValue('etiquetas_ids',evento.etiquetas)
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
                  <label htmlFor='fecha' className='form-label'>
                    Fecha del Evento
                  </label>
                  <DatePicker
                    placeholder='Seleccione la fecha del evento'
                    value={watch('fecha') ? new Date(watch('fecha')) : null}
                    onChange={handleDateChange}
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
                    type='number'
                    name='telefono_solicitante'
                    placeholder='Ingrese el teléfono'
                    register={register}
                    onChange={handleChange}
                    errors={errors.telefono_solicitante}
                  />
                </div>

                <SelectForm
                  register={register('categoria_id')}
                  title='Categoria'
                  options={categorias}
                  errors={errors.categoria_id}
                  onChange={handleChange}
                />

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

                <div>
                  <label htmlFor='barrio' className='form-label'>
                    Barrio
                  </label>
                  <Textinput
                    name='barrio'
                    type='text'
                    readonly
                    placeholder='El barrio se carga a partir del mapa'
                    register={register}
                    errors={errors.barrio}
                  />
                </div>
                <div>
                  <label htmlFor='circuito' className='form-label'>
                    Circuito
                  </label>
                  <Textinput
                    name='circuito'
                    type='text'
                    readonly
                    placeholder='El circuito se carga a partir del mapa'
                    register={register}
                    errors={errors.circuito}
                  />
                </div>

              </form>

            </Card>

            <Card>
              <LabelsSelect handleLabels={handleLabels} oldLabels={etiquetas} />
            </Card>
            <div className='h-96 w-full'>
              <BasicMap onLocationChange={handleLocationChange} handleNeight={handleNeight} editPosition={position} handleCircuit={handleCircuit} />
            </div>

            <div className='flex justify-end gap-4 mt-8'>
              <div className='ltr:text-right rtl:text-left'>
                <button
                  className='btn-danger items-center text-center py-2 px-6 rounded-lg'
                  onClick={() => navigate(`/eventos?page=${currentPage}`)}
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
