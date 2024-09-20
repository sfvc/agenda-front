import Card from '@/components/ui/Card'
import React, { useState } from 'react'
import Loading from '@/components/Loading'
import Button from '@/components/ui/Button'
import { useNavigate, useParams } from 'react-router-dom'
import { nextStageEvent } from '@/services/eventService'
import { searchContact, getContacts } from '@/services/contactService'
import { toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'

const columnContact = [
  {
    label: 'Apellido y Nombre',
    field: 'apellido'
  },
  {
    label: 'Correo Electronico',
    field: 'email'
  },
  {
    label: 'Telefono',
    field: 'telefono'
  },
  {
    label: 'Acciones',
    field: 'acciones'
  }
]

export const StagePerform = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [contacts, setContact] = useState([])
  const [invitados, setInvitados] = useState([])
  // const [, setFormData] = useState(initialForm)
  const { id } = useParams()
  const [currentPage, setCurrentPage] = useState(1)
  const { data: contactos, isLoading } = useQuery({
    queryKey: ['contactos', currentPage],
    queryFn: () => getContacts(currentPage),
    keepPreviousData: true
  })
  if (isLoading) {
    return <Loading />
  }

  const handleChange = async (e) => {
    setSearch(e.target.value)
    if (search.length > 2) {
      const res = await searchContact(search)
      setContact(res.items)
    } else {
      setContact([])
    }
  }

  const addContact = (e) => {
    const exists = invitados.some((invitado) => invitado.id === e.id)
    if (!exists) {
      setInvitados([...invitados, e])
      setContact([])
      setSearch('')
    } else {
      toast.warning('Este invitado ya está en la lista')
    }
  }

  const deleteGuest = (e) => {
    setInvitados((prevItems) => prevItems.filter(item => item.id !== e))
    // const exists = invitados.findIndex((invitado) => invitado.id === e);
    // console.log(invitados)
  }

  const obtenerIds = (data) => {
    return data.map(item => ({
      id: item.id,
      email: item.email
    }))
  }

  const handleSubmit = async () => {
    const ids = obtenerIds(invitados)
    setIsSubmitting(true)
    try {
      await nextStageEvent(id, { contactos: ids })
      navigate('/eventos')
      toast.success('El evento paso al estado A REALIZAR')
    } catch (error) {
      console.error(error)
      toast.error('Hubo un error al intentar pasar el evento')
    } finally {
      setIsSubmitting(false)
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
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Pasar evento a Realizar</h1>
                </div>
              </Card>
              <Card>
                <div className='w-full flex gap-5'>
                  <div className='w-1/2'>
                    <label htmlFor='default-search' className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'>Search</label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
                        <svg className='w-4 h-4 text-gray-500 dark:text-gray-400' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'>
                          <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z' />
                        </svg>
                      </div>
                      <input type='search' onChange={handleChange} id='default-search' className='block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder='Ingrese el nombre del invitado' value={search} />
                      {/* <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button> */}
                    </div>
                    <div className='w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
                      {contacts.map((contact) => {
                        return (
                          <button
                            onClick={() => addContact(contact)}
                            aria-current='true'
                            key={contact.id}
                            type='button'
                            className='w-full px-4 py-2 font-medium text-left rtl:text-right text-white bg-blue-700 border-b border-gray-200 rounded-t-lg cursor-pointer focus:outline-none dark:bg-gray-800 dark:border-gray-600'
                          >
                            {contact.nombre} {contact.apellido} | {contact.email}
                          </button>
                        )
                      })}

                    </div>
                  </div>

                  <div className='w-1/2'>

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
                                (invitados.length > 0)
                                  ? (invitados.map((contacto) => {
                                      return (
                                        <tr key={contacto.id}>
                                          <td className='table-td text-center'>{contacto.apellido} {contacto.nombre}</td>
                                          <td className='table-td text-center'>{contacto.email}</td>
                                          <td className='table-td text-center'>{contacto.telefono}</td>
                                          <td className='table-td text-center'>
                                            <button onClick={() => { deleteGuest(contacto.id) }}>
                                              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-6'>
                                                <path strokeLinecap='round' strokeLinejoin='round' d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0' />
                                              </svg>
                                            </button>
                                          </td>
                                        </tr>
                                      )
                                    }))
                                  : (<tr><td colSpan='10' className='text-center py-2 dark:bg-gray-800'>Aun no tienes invitados</td></tr>)
                                }
                            </tbody>

                          </table>

                          {/* Paginado */}
                          {/* <div className='flex justify-center mt-8'>
                                    <Pagination
                                        paginate={{
                                            current: contactos.current,
                                            totalPages: contactos.totalPages
                                        }}
                                        onPageChange={(page) => setCurrentPage(page)}
                                        text
                                    />
                                </div> */}

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
                    onClick={() => navigate('/eventos')}
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
                    onClick={handleSubmit}
                  />
                </div>
              </div>
            </>
            )
    }
    </>
  )
}
