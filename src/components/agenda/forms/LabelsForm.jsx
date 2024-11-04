import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Textinput from '@/components/ui/Textinput'
import Button from '@/components/ui/Button'
import { Label } from 'flowbite-react'
import { toast } from 'react-toastify'
import { fetchLabelsById, updateLabels } from '../../../services/labelsService'

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

export const LabelsForm = ({ fnAction, refetchLabel, activeLabel, onClose, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      nombre: activeLabel?.nombre || ''
    },
    resolver: yupResolver(activeLabel ? FormValidationUpdate : FormValidationSaving)
  })

  const onSubmit = async (data) => {
    try {
      if (!id) {
        await fnAction(data)
        toast.success('Etiqueta creada exitosamente')
        refetchLabel()
        reset()
        onClose()
      } else {
        await updateLabels(id, data)
        toast.info('Etiqueta editada exitosamente')
        refetchLabel()
        reset()
        onClose()
      }
    } catch (error) {
      toast.error('Hubo un error al crear la etiqueta')
    }
  }

  const loadCategory = async () => {
    if (id) {
      try {
        const etiqueta = await fetchLabelsById(id)

        setValue('nombre', etiqueta.nombre)
      } catch (error) {
        console.error('Error al cargar el evento:', error)
      }
    }
  }

  useEffect(() => {
    loadCategory()
  }, [id])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 relative'>
      <div className='mb-4'>
        <div className='mb-2 block dark:text-white'>
          <Label color='gray' htmlFor='nombre' value='Nombre de la etiqueta' />
          <strong className='obligatorio'>(*)</strong>
        </div>
        <Textinput
          name='nombre'
          type='text'
          placeholder='Nombre de la etiqueta'
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
