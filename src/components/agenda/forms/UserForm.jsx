import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Textinput from '@/components/ui/Textinput'
import Button from '@/components/ui/Button'
import { Label } from 'flowbite-react'
import { toast } from 'react-toastify'
import { SelectForm } from '@/components/agenda/forms'
import { getUserById } from '../../../services/userService'
import { useParams } from 'react-router-dom'

const roles = [
  { id: 'administrador', nombre: 'Administrador' },
  { id: 'visualizador', nombre: 'Visualizador' },
  { id: 'solicitante', nombre: 'Solicitante' }
]

const FormValidationSaving = yup
  .object({
    nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerido'),
    username: yup.string().required('El usuario es requerido'),
    password: yup.string().required('La contraseña es requerido')
  })
  .required()

const FormValidationUpdate = yup
  .object({
    nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerido'),
    password: yup.string().required('La contraseña es requerido')
  })
  .required()

export const UserForm = ({ fnAction, refetchUser, activeUser, onClose }) => {
  const { id } = useParams()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    defaultValues: {
      nombre: activeUser?.nombre || '',
      apellido: activeUser?.apellido || '',
      username: activeUser?.username || '',
      rol: activeUser?.rol || ''
    },
    resolver: yupResolver(activeUser ? FormValidationUpdate : FormValidationSaving)
  })

  const onSubmit = async (data) => {
    try {
      await fnAction(data)
      toast.success('Usuario creado exitosamente')
      refetchUser()
      reset()
      onClose()
    } catch (error) {
      toast.error('Hubo un error al crear el usuario')
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const loadUser = async () => {
    if (id) {
      try {
        const usurio = await getUserById(id)

        setValue('nombre', usurio.nombre)
        setValue('apellido', usurio.apellido)
        setValue('username', usurio.username)
        setValue('rol', usurio.rol)
      } catch (error) {
        console.error('Error al cargar el evento:', error)
      }
    }
  }

  useEffect(() => {
    loadUser()
  }, [id])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 relative'>
      <div className='mb-4'>
        <div className='mb-2 block dark:text-white'>
          <Label color='gray' htmlFor='nombre' value='Nombre' />
          <strong className='obligatorio'>(*)</strong>
        </div>
        <Textinput
          name='nombre'
          type='text'
          placeholder='Nombre'
          register={register}
          error={errors.nombre}
        />
      </div>

      <div className='mb-4'>
        <div className='mb-2 block dark:text-white'>
          <Label color='gray' htmlFor='apellido' value='Apellido' />
          <strong className='obligatorio'>(*)</strong>
        </div>
        <Textinput
          name='apellido'
          type='text'
          placeholder='apellido'
          register={register}
          error={errors.apellido}
        />
      </div>

      <div className='mb-4'>
        <div className='mb-2 block dark:text-white'>
          <Label color='gray' htmlFor='username' value='Usuario' />
          <strong className='obligatorio'>(*)</strong>
        </div>
        <Textinput
          name='username'
          type='text'
          placeholder='Usuario'
          register={register}
          error={errors.username}
        />
      </div>

      <div className='relative'>
        <label htmlFor='password' className='form-label space-y-2'>
          Contraseña
          <strong className='obligatorio'>(*)</strong>
          <Textinput
            name='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='Contraseña'
            register={register}
            disabled={!activeUser}
            error={errors.password}
          />
          <button
            type='button'
            className='absolute top-1/2 right-4 mb-1'
            onClick={togglePasswordVisibility}
          >
            {showPassword
              ? (
                <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-eye dark:stroke-white' width='24' height='24' viewBox='0 0 24 24' strokeWidth='1' stroke='#000000' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                  <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                  <path d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0' />
                  <path d='M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6' />
                </svg>
                )
              : (
                <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-eye-closed dark:stroke-white' width='24' height='24' viewBox='0 0 24 24' strokeWidth='1' stroke='#000000' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                  <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                  <path d='M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4' />
                  <path d='M3 15l2.5 -3.8' />
                  <path d='M21 14.976l-2.492 -3.776' />
                  <path d='M9 17l.5 -4' />
                  <path d='M15 17l-.5 -4' />
                </svg>
                )}
          </button>
        </label>
      </div>

      <div className='col-span-1'>
        <SelectForm
          title='Rol'
          options={roles}
          register={register('rol')}
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
