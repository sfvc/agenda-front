import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Loading from '@/components/Loading'
import Button from '@/components/ui/Button'
import { getEventoById, createEvento, updateEvento } from '@/services/eventService'
import CrearEventoData from '@/components/forms/CrearEventoData'

export const Create = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [, setActiveEvento] = useState(null)

  const FormValidationSchema = yup.object().shape({
    nombre_solicitante: yup.string().required('El nombre es requerido'),
    email_solicitante: yup.string().required('El email es requerido'),
    telefono_solicitante: yup.string().required('El telefono es requerido'),
    descripcion: yup.string().required('La descripcion es requerida'),
    fecha: yup.string().required('La fecha es requerida'),
    categoria: yup.string().required('La categoría es requerida')
  })

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    defaultValues: {
      nombre_solicitante: '',
      email_solicitante: '',
      telefono_solicitante: '',
      descripcion: '',
      fecha: '',
      categoria: ''
    }
  })

  const onSubmit = async (data) => {
    console.log('Datos a enviar:', data)
    if (!id) {
      await startSavingEvento(data)
    } else {
      await startUpdateEvento(id, data)
    }
    navigate('/eventos')
  }

  const startSavingEvento = async (data) => {
    try {
      await createEvento(data)
    } catch (error) {
      console.error('Error al crear el evento:', error)
    }
  }

  const startUpdateEvento = async (eventoId, data) => {
    try {
      await updateEvento(eventoId, data)
    } catch (error) {
      console.error('Error al actualizar el evento:', error)
    }
  }

  const loadEvento = async () => {
    if (id) {
      try {
        const evento = await getEventoById(id)
        setActiveEvento(evento)

        setValue('nombre_solicitante', evento.nombre_solicitante)
        setValue('email_solicitante', evento.email_solicitante)
        setValue('telefono_solicitante', evento.telefono_solicitante)
        setValue('descripcion', evento.descripcion)
        setValue('fecha', evento.fecha)
        setValue('categoria', evento.categoria)
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <CrearEventoData register={register} errors={errors} setValue={setValue} watch={watch} />
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
                  onClick={isSubmitting ? undefined : handleSubmit}
                />
              </div>
            </div>
          </form>
          )}
    </>
  )
}
