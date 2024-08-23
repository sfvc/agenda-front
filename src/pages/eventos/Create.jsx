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
    nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerido'),
    fecha: yup.string().required('La fecha es requerida'),
    ubicacion: yup.string().required('La ubicación es requerida'),
    contacto: yup.string().required('El contacto es requerido'),
    categoria: yup.string().required('La categoría es requerida'),
    estado: yup.string().required('El estado es requerido')
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
      nombre: '',
      descripcion: '',
      fecha: '',
      ubicacion: '',
      contacto: '',
      categoria: '',
      estado: ''
    }
  })

  const onSubmit = async (data) => {
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
        Object.entries(evento).forEach(([key, value]) => {
          setValue(key, value)
        })
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

              <CrearEventoData register={register} errors={errors} setValue={setValue} watch={watch} />

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
