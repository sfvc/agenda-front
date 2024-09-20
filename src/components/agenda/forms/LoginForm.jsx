import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import Textinput from '@/components/ui/Textinput'
import Tooltip from '@/components/ui/Tooltip'
import { loginUser } from '@/services/userService'
import { useMutation } from '@tanstack/react-query'

const schema = yup.object({
  username: yup.string().required('El usuario es requerido'),
  password: yup.string().required('La contraseña es requerida').min(6, 'La contraseña debe contener al menos 6 caracteres')
}).required()

function LoginForm () {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const { formState: { errors }, handleSubmit, setValue, register } = useForm({
    resolver: yupResolver(schema)
  })

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token)
      navigate('/eventos')
    },
    onError: (err) => {
      console.error('Error en el login:', err)
    }
  })

  const onSubmit = (data) => {
    mutate(data)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='relative space-y-2'>
      <div>
        <label htmlFor='default-picker' className='form-label text-white'>
          Usuario
        </label>
        <Textinput
          name='username'
          type='text'
          register={register}
          error={errors.username}
          className='h-[48px]'
          placeholder='Usuario'
          onChange={(e) => {
            setValue('username', e.target.value)
          }}
        />
      </div>

      <div>
        <label htmlFor='default-picker' className='form-label text-white'>
          Contraseña
        </label>
        <Textinput
          name='password'
          type={showPassword ? 'text' : 'password'}
          register={register}
          error={errors.password}
          className='h-[48px]'
          placeholder='Contraseña'
          onChange={(e) => {
            setValue('password', e.target.value)
          }}
        />
      </div>

      <button
        type='button'
        className='absolute top-2/4 right-4 transform translate-y-2/4 mt-1'
        onClick={togglePasswordVisibility}
      >
        {showPassword
          ? (
            <Tooltip content='Ocultar Contraseña'>
              <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-eye dark:stroke-white' width='24' height='24' viewBox='0 0 24 24' strokeWidth='1' stroke='#000000' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                <path d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0' />
                <path d='M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6' />
              </svg>
            </Tooltip>
            )
          : (
            <Tooltip content='Mostrar Contraseña'>
              <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-eye-closed dark:stroke-white' width='24' height='24' viewBox='0 0 24 24' strokeWidth='1' stroke='#000000' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                <path d='M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4' />
                <path d='M3 15l2.5 -3.8' />
                <path d='M21 14.976l-2.492 -3.776' />
                <path d='M9 17l.5 -4' />
                <path d='M15 17l-.5 -4' />
              </svg>
            </Tooltip>
            )}
      </button>

      <button className='btn bg-blue-600 hover:bg-blue-800 block w-full text-center mt-2 text-white' type='submit'>
        {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
      </button>

      {isError && (
        <div className='text-red-500 mt-2'>
          {error?.response?.data?.message || 'Error al iniciar sesión'}
        </div>
      )}
    </form>
  )
}

export default LoginForm
