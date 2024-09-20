import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Loading from '@/components/Loading'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import { toast } from 'react-toastify'
import { createUser, getUserById, updateUser } from '@/services/userService'
import { SelectForm } from '@/components/agenda/forms'
import { Label } from 'flowbite-react'

const initialForm = {
  nombre: '',
  apellido: '',
  username: '',
  rol: ''
}

const roles = [
  { id: 'administrador', nombre: 'Administrador' },
  { id: 'visualizador', nombre: 'Visualizador' },
  { id: 'solicitante', nombre: 'Solicitante' }
]

export const CreateUser = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [, setFormData] = useState(initialForm)
  const navigate = useNavigate()
  const { id } = useParams()
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue
  } = useForm()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const onSubmit = async (items) => {
    try {
      if (!id) {
        await createUser(items)
        toast.success('Usuario creado exitosamente')
      } else {
        await updateUser(id, items)
        toast.info('Usuario editado exitosamente')
      }
      navigate('/usuarios')
    } catch (error) {
      toast.error('Hubo un error al crear el usuario')
    }
  }

  const loadEvento = async () => {
    if (id) {
      try {
        const usuario = await getUserById(id)

        setValue('nombre', usuario.nombre)
        setValue('apellido', usuario.apellido)
        setValue('username', usuario.username)
        setValue('rol', usuario.rol)
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
      {
            isLoading
              ? (
                <Loading className='mt-28 md:mt-64' />
                )
              : (
                <>
                  <Card>
                    <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 md:grid-cols-2 gap-4'>

                      <div>
                        <div className='mb-2 block dark:text-white'>
                          <Label color='gray' htmlFor='nombre' value='Nombre' />
                          <strong className='obligatorio'>(*)</strong>
                        </div>
                        <Textinput
                          name='nombre'
                          type='text'
                          placeholder='Ingrese el nombre'
                          register={register}
                          onChange={handleChange}
                          errors={errors.nombre}
                        />
                      </div>

                      <div>
                        <div className='mb-2 block dark:text-white'>
                          <Label color='gray' htmlFor='apellido' value='Apellido' />
                          <strong className='obligatorio'>(*)</strong>
                        </div>
                        <Textinput
                          name='apellido'
                          type='text'
                          placeholder='Ingrese el apellido'
                          register={register}
                          onChange={handleChange}
                          errors={errors.apellido}
                        />
                      </div>

                      <div>
                        <div className='mb-2 block dark:text-white'>
                          <Label color='gray' htmlFor='username' value='Usuario' />
                          <strong className='obligatorio'>(*)</strong>
                        </div>
                        <Textinput
                          name='username'
                          type='text'
                          placeholder='Ingrese el nombre del usuario'
                          register={register}
                          onChange={handleChange}
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
                            onChange={handleChange}
                            error={errors.password}
                          />
                          <button
                            type='button'
                            className='absolute top-[40%] right-4 mb-1'
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

                      <div>
                        <div className='mb-2 block dark:text-white'>
                          <Label color='gray' htmlFor='rol' value='Rol' />
                          <strong className='obligatorio'>(*)</strong>
                        </div>
                        <SelectForm
                          options={roles}
                          register={register('rol')}
                        />
                      </div>

                    </form>
                  </Card>
                  <div className='flex justify-end gap-4 mt-8'>
                    <div className='ltr:text-right rtl:text-left'>
                      <button
                        className='btn-danger items-center text-center py-2 px-6 rounded-lg'
                        onClick={() => navigate('/usuarios')}
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
                </>
                )
        }

    </>
  )
}
