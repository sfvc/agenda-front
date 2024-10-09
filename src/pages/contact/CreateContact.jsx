import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
// import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Loading from '@/components/Loading'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
// import Textarea from '@/components/ui/Textarea'
import { SelectForm } from '@/components/agenda/forms'
import { toast } from 'react-toastify'
import { createContact, getContactsById, updateContact } from '@/services/contactService'

const initialForm = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: ''
}



export const CreateContactos = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [, setFormData] = useState(initialForm)
  const [currentPage] = useState(1)
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

  const onSubmit = async (items) => {
    try {
      if (!id) {
        await createContact(items)

        toast.success('Contacto creado exitosamente')
      } else {
        await updateContact(id, items)
        toast.info('Contacto editado exitosamente')
      }
      navigate('/contactos')
    } catch (error) {
      toast.error('Hubo un error al crear el contacto')
    }
  }

  const loadEvento = async () => {
    if (id) {
      try {
        const contacto = await getContactsById(id)
        console.log(contacto);
        setValue('nombre', contacto.nombre)
        setValue('apellido', contacto.apellido)
        setValue('email', contacto.email)
        setValue('telefono', contacto.telefono)
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
                    <label htmlFor='nombre' className='form-label'>
                      Nombre del Contacto
                    </label>
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
                    <label htmlFor='apellido' className='form-label'>
                      Apellido del Contacto
                    </label>
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
                    <label htmlFor='email' className='form-label'>
                      Correo del Contacto
                    </label>
                    <Textinput
                      name='email'
                      type='email'
                      placeholder='Ingrese el correo electronico'
                      register={register}
                      onChange={handleChange}
                      errors={errors.email}
                    />
                  </div>

                  <div>
                    <label htmlFor='telefono' className='form-label'>
                      Telefono del Contacto
                    </label>
                    <Textinput
                      name='telefono'
                      type='text'
                      placeholder='Ingrese el telefono'
                      register={register}
                      onChange={handleChange}
                      errors={errors.telefono}
                    />
                  </div>
                </form>
              </Card>
              <div className='flex justify-end gap-4 mt-8'>
                <div className='ltr:text-right rtl:text-left'>
                  <button
                    className='btn-danger items-center text-center py-2 px-6 rounded-lg'
                    onClick={() => navigate(`/contactos?page=${currentPage}`)}
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
