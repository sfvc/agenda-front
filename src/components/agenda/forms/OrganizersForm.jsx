import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Textinput from '@/components/ui/Textinput'
import Button from '@/components/ui/Button'
import { Label } from 'flowbite-react'
import { toast } from 'react-toastify'
import { fetchOrganizersById, updateOrganizers } from '../../../services/organizersService'

const FormValidationSaving = yup
  .object({
    nombre: yup.string().required('El nombre es requerido')
  })
  .required()

const FormValidationUpdate = yup
  .object({
    nombre: yup.string().required('El nombre es requerido')
  })
  .required()

export const OrganizersForm = ({ fnAction, refetchOrganizers, activeOrganizer, onClose, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      nombre: activeOrganizer?.nombre || ''
    },
    resolver: yupResolver(activeOrganizer ? FormValidationUpdate : FormValidationSaving)
  })

  const onSubmit = async (data) => {
    try {
      if (!id) {
        await fnAction(data)
        toast.success('Organizador creado exitosamente')
        refetchOrganizers()
        reset()
        onClose()
      } else {
        await updateOrganizers(id, data)
        toast.info('Organizador editado exitosamente')
        refetchOrganizers()
        reset()
        onClose()
      }
    } catch (error) {
      toast.error('Hubo un error al crear el organizador')
    }
  }

  const loadOrganizer = async () => {
    if (id) {
      try {
        const organizador = await fetchOrganizersById(id)

        setValue('nombre', organizador.nombre)
      } catch (error) {
        console.error('Error al cargar el evento:', error)
      }
    }
  }

  useEffect(() => {
    loadOrganizer()
  }, [id])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 relative'>
      <div className='mb-4'>
        <div className='mb-2 block dark:text-white'>
          <Label color='gray' htmlFor='nombre' value='Nombre del organizador' />
          <strong className='obligatorio'>(*)</strong>
        </div>
        <Textinput
          name='nombre'
          type='text'
          placeholder='Nombre del organizador'
          register={register}
          error={errors.nombre}
        />
      </div>

      <div className='ltr:text-right rtl:text-left'>
        <Button
          type='submit'
          text={isSubmitting ? 'Guardando' : 'Guardar'}
          className={`bg-green-500 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700'} text-white items-center text-center py-2 px-6 rounded-lg`}
          disabled={isSubmitting}
        />
      </div>
    </form>
  )
}
