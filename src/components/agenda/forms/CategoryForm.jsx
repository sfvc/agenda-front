import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Textinput from '@/components/ui/Textinput'
import Button from '@/components/ui/Button'
import { Label } from 'flowbite-react'
import { toast } from 'react-toastify'
import { getCategoryById } from '@/services/categoryService'

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

export const CategoryForm = ({ fnAction, refetchCategories, activeCategory, onClose, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      nombre: activeCategory?.nombre || ''
    },
    resolver: yupResolver(activeCategory ? FormValidationUpdate : FormValidationSaving)
  })

  const onSubmit = async (data) => {
    try {
      await fnAction(data)
      toast.success('Eje creado exitosamente')
      refetchCategories()
      reset()
      onClose()
    } catch (error) {
      toast.error('Hubo un error al crear el eje')
    }
  }

  const loadCategory = async () => {
    if (id) {
      try {
        const categoria = await getCategoryById(id)

        setValue('nombre', categoria.nombre)
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
          <Label color='gray' htmlFor='nombre' value='Nombre del eje' />
          <strong className='obligatorio'>(*)</strong>
        </div>
        <Textinput
          name='nombre'
          type='text'
          placeholder='Nombre del eje'
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
