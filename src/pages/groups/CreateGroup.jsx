import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Button from '@/components/ui/Button'
import Loading from '@/components/Loading'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import { toast } from 'react-toastify'
import { createGroup, getGroupById, updateGroup } from '@/services/groupService'
import { ContactSelect } from '../../components/agenda/forms/ContactSelect'
const initialForm = {
  nombre: '',
  contactos: []
}
export const CreateGroup = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [, setFormData] = useState(initialForm)
  const [contacts, setContacts] = useState([])
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
        await createGroup(items)

        toast.success('Contacto creado exitosamente')
      } else {
        await updateGroup(id, items)
        toast.info('Contacto editado exitosamente')
      }
      navigate('/grupos')
    } catch (error) {
      toast.error('Hubo un error al crear el contacto')
    }
  }
  const loadGroup = async () => {
    if (id) {
      try {
        const group = await getGroupById(id)

        setValue('nombre', group.nombre)
        setValue('contactos', group.contactos)
        setContacts(group?.contactos)
      } catch (error) {
        console.error('Error al cargar el evento:', error)
      }
    }
    setIsLoading(false)
  }
  const handleContact = (e) => {
    setValue('contactos', e)
  }

  useEffect(() => {
    loadGroup()
  }, [id])

  return (
    <>
      {
                isLoading
                  ? (<Loading className='mt-28 md:mt-64' />)
                  : (
                    < >
                      <Card>
                        <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div>
                            <label htmlFor='nombre' className='form-label'>
                              Nombre del Grupo
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
                        </form>
                        {
                                id !== undefined
                                  ? (
                                    <>
                                      <div className='mt-5'>
                                        <ContactSelect handleContact={handleContact} oldContacts={contacts} />
                                      </div>
                                    </>
                                    )
                                  : null
                            }
                      </Card>
                      <div className='flex justify-end gap-4 mt-8'>
                        <div className='ltr:text-right rtl:text-left'>
                          <button
                            className='btn-danger items-center text-center py-2 px-6 rounded-lg'
                            onClick={() => navigate('/grupos')}
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
                    </>)
            }
    </>
  )
}
