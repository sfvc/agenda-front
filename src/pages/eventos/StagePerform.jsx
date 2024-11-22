/* eslint-disable react/jsx-closing-tag-location */
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { nextStageEvent } from '@/services/eventService'
import { searchContactName, getContacts } from '@/services/contactService'
import { getGroup, getGroupById } from '@/services/groupService'
import { toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import { SelectForm } from '@/components/agenda/forms'
import { useForm } from 'react-hook-form'
import Card from '@/components/ui/Card'
import React, { useState } from 'react'
import Loading from '@/components/Loading'
import Button from '@/components/ui/Button'
import columnContact from '@/json/columnsContact.json'

export const StagePerform = () => {
  const {
    formState: { isSubmitting },
    handleSubmit
  } = useForm()
  const navigate = useNavigate()
  const [tags, setTags] = useState('')
  const [search, setSearch] = useState('')
  const [contacts, setContact] = useState([])
  const [invitados, setInvitados] = useState([])
  const { id } = useParams()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialPage = parseInt(queryParams.get('page')) || 1
  const [currentPage] = useState(initialPage)
  // eslint-disable-next-line no-unused-vars
  const { data: contactos, isLoading } = useQuery({
    queryKey: ['contactos', currentPage],
    queryFn: () => getContacts(currentPage),
    keepPreviousData: true
  })

  const { data: grupos } = useQuery({
    queryKey: ['grupos', currentPage],
    queryFn: () => getGroup(currentPage),
    keepPreviousData: true
  })

  if (isLoading) {
    return <Loading />
  }

  const handleChange = async (e) => {
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

  const onSubmit = async () => {
    const ids = obtenerIds(invitados)
    try {
      await nextStageEvent(id, { contactos: ids })
      navigate(`/eventos?page=${currentPage}`)
      toast.success('El evento paso al estado A REALIZAR')
    } catch (error) {
      console.error(error)
      toast.error('Hubo un error al intentar pasar el evento')
    }
  }

  return (

    <>
      {
        isLoading
          ? <Loading className='mt-28 md:mt-64' />
          : (
            <>
              <Card>
                <div className='mb-4 md:flex md:justify-between'>
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Pasar evento a realizar</h1>
                </div>
              </Card>
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
                        <input type='search' onChange={handleChange} id='default-search' className='block w-full ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder='Ingrese el nombre del invitado' value={search} />
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
              </Card>

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
            </>
            )
      }

    </>
  )
}
