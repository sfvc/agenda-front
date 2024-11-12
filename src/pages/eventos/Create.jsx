/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable use-isnan */
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { SelectForm } from '@/components/agenda/forms'
import { getEventoById, createEvento, updateEvento } from '@/services/eventService'
import { useQuery } from '@tanstack/react-query'
import { getCategoryBySelect } from '@/services/categoryService'
import { LabelsSelect } from '@/components/agenda/forms/LabelsSelect'
import { toast } from 'react-toastify'
import Button from '@/components/ui/Button'
import Loading from '@/components/Loading'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Textarea from '@/components/ui/Textarea'
import DatePicker from '@/components/ui/DatePicker'
import BasicMap from '@/components/basicMap'
import lugares from '@/json/lugares'
import columnContact from '@/json/columnsContact.json'
import { searchContactName, getContacts } from '@/services/contactService'
import { getGroup, getGroupById } from '@/services/groupService'
import { addContacts } from '../../services/eventService'

const initialForm = {
  nombre_solicitante: null,
  email_solicitante: null,
  telefono_solicitante: null,
  descripcion: null,
  fecha: null,
  categoria: null,
  ubicacion: null,
  location: null,
  summary: null,
  barrio: null,
  circuito: null,
  etiquetas_ids: [],
  subbarrio: null
}

const initialPosition = {
  latitud: -28.46867672033115,
  longitud: -65.77899050151645
}

export const Create = () => {
  const [position, setPosition] = useState(initialPosition)
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [etiquetas, setEtiquetas] = useState([])
  const [, setFormData] = useState(initialForm)
  const [tags, setTags] = useState('')
  const [search, setSearch] = useState('')
  const [contacts, setContact] = useState([])
  const [invitados, setInvitados] = useState([])
  // eslint-disable-next-line no-unused-vars
  const { data: contactos } = useQuery({
    queryKey: ['contactos', currentPage],
    queryFn: () => getContacts(currentPage),
    keepPreviousData: true
  })

  const { data: grupos } = useQuery({
    queryKey: ['grupos', currentPage],
    queryFn: () => getGroup(currentPage),
    keepPreviousData: true
  })

  const { data: categorias } = useQuery({
    queryKey: ['categoria'],
    queryFn: getCategoryBySelect
  })

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    watch
  } = useForm()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleChangeContact = async (e) => {
    setSearch(e.target.value)
    if (search.length > 1) {
      const res = await searchContactName(search)
      setContact(res?.items)
    } else {
      setContact([])
    }
  }

  const addContactFunction = async () => {
    try {
      const { contactos, nombre } = await getGroupById(tags)
      const nuevosContactos = contactos.filter((element) => {
        return !invitados.some((invitado) => invitado.id === element.id)
      }).map((contacto) => {
        return { ...contacto, grupo: nombre }
      })
      if (nuevosContactos.length > 0) {
        setInvitados([...invitados, ...nuevosContactos])
      } else {
        console.log('No hay contactos nuevos para agregar.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addContact = (e) => {
    const exists = invitados.some((invitado) => invitado.id === e.id)
    if (!exists) {
      setInvitados([...invitados, e])
      setContact([])
    } else {
      toast.warning('El contacto ya está en la lista')
      setContact([])
      setSearch('')
    }
    setSearch('')
  }

  const deleteGuest = (e) => {
    setInvitados((prevItems) => prevItems.filter(item => item.id !== e))
  }

  const obtenerIds = (data) => {
    return data.map(item => ({
      id: item.id,
      email: item.email
    }))
  }

  const onSubmitContacts = async () => {
    const ids = obtenerIds(invitados)
    try {
      await addContacts(id, { contactos: ids })
      toast.success('Se enviaron las invitaciones')
    } catch (error) {
      console.error(error)
      toast.error('Hubo un error al intentar pasar el evento')
    }
  }

  const handleDateChange = (date) => {
    setValue('fecha', date ? date[0].toISOString() : '')
  }

  const handleLocationChange = (latitud, longitud, direccion) => {
    setValue('ubicacion', JSON.stringify({ latitud, longitud, direccion }))
  }

  const handleLugarSelect = (selectedLugar) => {
    setValue('location', selectedLugar.nombre)
    setValue('barrio', selectedLugar.barrio)
    setValue('subbarrio', selectedLugar.subbarrio)
    setValue('circuito', selectedLugar.circuito)
    setValue('ubicacion', JSON.stringify({
      latitud: selectedLugar.latitud,
      longitud: selectedLugar.longitud,
      direccion: selectedLugar.nombre
    }))
    setPosition({ latitud: selectedLugar.latitud, longitud: selectedLugar.longitud })
  }

  const handleNeight = (e) => {
    setValue('barrio', e)
  }

  const handleCircuit = (e) => {
    setValue('circuito', e)
  }

  const handleSub = (e) => {
    setValue('subbarrio', e)
  }

  const handleLabels = (e) => {
    setValue('etiquetas_ids', e)
  }

  const sanitizeObject = (items) => {
    return Object.fromEntries(
      Object.entries(items).map(([key, value]) => {
        if (value === '' || (Array.isArray(value) && value.length === 0)) {
          return [key, null]
        }
        return [key, value]
      })
    )
  }

  const onSubmit = async (items) => {
    items.categoria_id = parseInt(items.categoria_id)
    const newObject = sanitizeObject(items)

    try {
      if (!id) {
        await createEvento(newObject)
        toast.success('Evento creado exitosamente')
      } else {
        await updateEvento(id, newObject)
        toast.info('Evento editado exitosamente')
      }

      navigate('/eventos')
    } catch (error) {
      toast.error('Hubo un error al crear el evento')
    }
  }

  const loadEvento = async () => {
    if (id) {
      try {
        const evento = await getEventoById(id)
        setEtiquetas(evento.etiquetas)
        setValue('nombre_solicitante', evento.nombre_solicitante)
        setValue('email_solicitante', evento.email_solicitante)
        setValue('telefono_solicitante', evento.telefono_solicitante)
        setValue('fecha', new Date(evento.fecha))
        setValue('categoria_id', evento.categoria_id)
        setValue('descripcion', evento.descripcion)
        setValue('ubicacion', evento.ubicacion)
        setValue('location', evento.location)
        setValue('summary', evento.summary)
        setPosition(JSON.parse(evento.ubicacion))
        setTimeout(() => {
          setValue('barrio', evento.barrio)
          setValue('subbarrio', evento.subbarrio)
          setValue('circuito', evento.circuito)
        }, 100)
        setValue('etiquetas_ids', evento.etiquetas)
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
          <div>
            <Card>
              <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 md:grid-cols-2 gap-4'>

                <div>
                  <label htmlFor='nombre_solicitante' className='form-label'>
                    Nombre del Solicitante
                  </label>
                  <Textinput
                    name='nombre_solicitante'
                    type='text'
                    placeholder='Ingrese el nombre del solicitante'
                    register={register}
                    onChange={handleChange}
                    errors={errors.nombre_solicitante}
                  />
                </div>

                <div>
                  <label htmlFor='fecha' className='form-label'>
                    Fecha del Evento
                    <strong className='obligatorio'>(*)</strong>
                  </label>
                  <DatePicker
                    placeholder='Seleccione la fecha del evento'
                    value={watch('fecha') ? new Date(watch('fecha')) : null}
                    onChange={handleDateChange}
                  />
                </div>

                <div>
                  <label htmlFor='email_solicitante' className='form-label'>
                    Email del Solicitante
                  </label>
                  <Textinput
                    name='email_solicitante'
                    type='email'
                    placeholder='Ingrese un email'
                    register={register}
                    onChange={handleChange}
                    errors={errors.email_solicitante}
                  />
                </div>

                <div>
                  <label htmlFor='telefono_solicitante' className='form-label'>
                    Teléfono del Solicitante
                  </label>
                  <Textinput
                    type='number'
                    name='telefono_solicitante'
                    placeholder='Ingrese el teléfono'
                    register={register}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor='categoria' className='form-label'>
                    Eje
                    <strong className='obligatorio'>(*)</strong>
                  </label>
                  <SelectForm
                    register={register('categoria_id')}
                    options={categorias}
                    errors={errors.categoria_id}
                    onChange={handleChange}
                  />
                </div>

                <div className='hidden'>
                  <label htmlFor='ubicacion' className='form-label'>
                    Ubicación
                    <strong className='obligatorio'>(*)</strong>
                  </label>
                  <Textinput
                    name='ubicacion'
                    type='text'
                    placeholder='Ingrese la ubicación'
                    register={register}
                    errors={errors.ubicacion}
                  />
                </div>

                <div>
                  <label htmlFor='descripcion' className='form-label'>
                    Descripción
                    <strong className='obligatorio'>(*)</strong>
                  </label>
                  <Textarea
                    name='descripcion'
                    placeholder='Ingrese una descripción del evento'
                    register={register}
                    errors={errors.descripcion}
                  />
                </div>

                <div>
                  <label htmlFor='summary' className='form-label'>
                    Nombre del Evento
                    <strong className='obligatorio'>(*)</strong>
                  </label>
                  <Textarea
                    name='summary'
                    placeholder='Ingrese un nombre al evento'
                    register={register}
                    errors={errors.summary}
                  />
                </div>

                <div>
                  <label htmlFor='lugares' className='form-label'>
                    Lugares Recurrentes
                  </label>
                  <SelectForm
                    options={lugares}
                    onChange={(e) => {
                      const selectedLugar = lugares.find(lugar => lugar.nombre === e.target.value)
                      handleLugarSelect(selectedLugar)
                    }}
                  />
                </div>

                <div>
                  <label htmlFor='location' className='form-label'>
                    Localización
                    <strong className='obligatorio'>(*)</strong>
                  </label>
                  <Textarea
                    name='location'
                    placeholder='Escriba la ubicación'
                    register={register}
                    errors={errors.location}
                  />
                </div>

                <div>
                  <label htmlFor='barrio' className='form-label'>
                    Barrio
                    <strong className='obligatorio'>(*)</strong>
                  </label>
                  <Textinput
                    name='barrio'
                    type='text'
                    placeholder='El barrio se carga a partir del mapa'
                    register={register}
                    errors={errors.barrio}
                  />
                </div>

                <div>
                  <label htmlFor='circuito' className='form-label'>
                    Circuito
                    <strong className='obligatorio'>(*)</strong>
                  </label>
                  <Textinput
                    name='circuito'
                    type='text'
                    placeholder='El circuito se carga a partir del mapa'
                    register={register}
                    errors={errors.circuito}
                  />
                </div>

                <div>
                  <label htmlFor='subbarrio' className='form-label'>
                    Sub-Barrio
                    <strong className='obligatorio'>(*)</strong>
                  </label>
                  <Textinput
                    name='subbarrio'
                    type='text'
                    placeholder='El sub-barrio se carga a partir del mapa'
                    register={register}
                    errors={errors.subbarrio}
                  />
                </div>

              </form>

            </Card>

            <div>
              <Card>
                <LabelsSelect handleLabels={handleLabels} oldLabels={etiquetas} />
              </Card>

              {id && (
                <Card>
                  <div className='w-full'>
                    <div className='flex flex-col md:flex-row'>
                      <div className='w-full md:w-1/2 md:mx-6 mb-6 relative'>
                        <label className='form-label'>Buscar Persona</label>
                        <div className='relative'>
                          <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
                            <svg className='w-4 h-4 text-gray-500 dark:text-gray-400' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'>
                              <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z' />
                            </svg>
                          </div>
                          <input type='search' onChange={handleChangeContact} id='default-search' className='block w-full ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder='Ingrese el nombre del invitado' value={search} />
                        </div>
                        {contacts.length > 0
                          ? <div className='w-full text-sm font-medium text-gray-900 bg-white  border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white absolute'>
                            {contacts.map((contact) => {
                              return (
                                <button
                                  onClick={() => addContact(contact)}
                                  aria-current='true'
                                  key={contact.id}
                                  type='button'
                                  className='w-full px-4 py-2 hover:text-white font-medium text-center rtl:text-right dark:text-white bg-grey-700  rounded-lg cursor-pointer hover:bg-blue-700 focus:outline-none dark:bg-gray-800 dark:border-gray-600 grid grid-cols-3 divide-x'
                                >
                                  <div>
                                    {contact.nombre} {contact.apellido}
                                  </div>
                                  <div>
                                    {contact.email}
                                  </div>
                                  <div>
                                    {contact.telefono}
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                          : ''}
                      </div>
                      <div className='w-full md:w-1/2 md:mx-6 mb-6 flex items-end justify-center gap-3'>
                        <SelectForm title='Grupos' options={grupos?.items} onChange={(e) => setTags(e.target.value)} />
                        <Button
                          type='submit'
                          text='Agregar Grupo'
                          className='bg-blue-500 hover:bg-blue-700 text-white py-2 px-6 rounded-lg'
                          onClick={addContactFunction}
                        />
                      </div>
                    </div>

                    <div className='w-full'>
                      <div className='overflow-x-auto mx-6'>
                        <div className='inline-block min-w-full align-middle'>
                          <div className='overflow-hidden '>
                            <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                              <thead className='bg-slate-200 dark:bg-slate-700'>
                                <tr>
                                  {columnContact.map((column, i) => (
                                    <th key={i} scope='col' className='table-th'>
                                      {column.label}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className='bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700'>
                                {
                                invitados.length > 0
                                  ? invitados.map((contacto) => {
                                    return (
                                      <tr key={contacto.id}>
                                        <td className='table-td'>{contacto.apellido} {contacto.nombre}</td>
                                        <td className='table-td'>{contacto.email}</td>
                                        <td className='table-td'>{contacto.telefono}</td>
                                        <td className='table-td'>
                                          {contacto.grupo || 'Agregado Particular'}
                                        </td>
                                        <td className='table-td'>
                                          <button className='bg-danger-500 text-white p-2 rounded-lg hover:bg-danger-700' onClick={() => { deleteGuest(contacto.id) }}>
                                            <svg
                                              xmlns='http://www.w3.org/2000/svg'
                                              className='icon icon-tabler icon-tabler-trash'
                                              width='24'
                                              height='24'
                                              viewBox='0 0 24 24'
                                              strokeWidth='1.5'
                                              stroke='currentColor'
                                              fill='none'
                                              strokeLinecap='round'
                                              strokeLinejoin='round'
                                            >
                                              <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                                              <path d='M4 7l16 0' />
                                              <path d='M10 11l0 6' />
                                              <path d='M14 11l0 6' />
                                              <path d='M5 7l1 12.5a1 1 0 0 0 1 0.5h10a1 1 0 0 0 1 -0.5l1 -12.5' />
                                              <path d='M9 7l0 -3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1l0 3' />
                                            </svg>
                                          </button>
                                        </td>
                                      </tr>
                                    )
                                  })
                                  : <tr><td colSpan='10' className='text-center py-2 dark:bg-gray-800'>Aun no tienes invitados</td></tr>
                              }
                              </tbody>

                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-end gap-4 mt-8'>
                    <div className='ltr:text-right rtl:text-left'>
                      <Button
                        type='submit'
                        text={isSubmitting ? 'Agregando' : 'Agregar'}
                        className={`bg-indigo-500 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-indigo-700'} text-white items-center text-center py-2 px-6 rounded-lg`}
                        disabled={isSubmitting}
                        onClick={handleSubmit(onSubmitContacts)}
                      />
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <div className='h-96 w-full'>
              <BasicMap onLocationChange={handleLocationChange} handleNeight={handleNeight} editPosition={position} handleCircuit={handleCircuit} handleSub={handleSub} />
            </div>

            <div className='flex justify-end gap-4 mt-8'>
              <div className='ltr:text-right rtl:text-left'>
                <button
                  className='btn-danger items-center text-center py-2 px-6 rounded-lg'
                  onClick={() => navigate(`/eventos?page=${currentPage}`)}
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
          </div>
          )}
    </>
  )
}
