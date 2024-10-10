import { useState, useEffect } from 'react'
import { DeleteModal } from '@/components/ui/DeleteModal'
import { TextInput } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getContacts, searchContactName } from '@/services/contactService'
import Card from '@/components/ui/Card'
import columnContact from '@/json/columnsContact.json'
import Pagination from '@/components/ui/Pagination'
import Loading from '@/components/Loading'
import EditButton from '@/components/buttons/EditButton'

export const Contactos = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [debouncedSearch, setDebouncedSearch] = useState(search)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 1000)

    return () => {
      clearTimeout(handler)
    }
  }, [search])

  const fetchContacts = async () => {
    return debouncedSearch
      ? searchContactName(debouncedSearch, currentPage)
      : getContacts(currentPage)
  }

  const { data: contactos, isLoading } = useQuery({
    queryKey: ['contactos', currentPage, debouncedSearch],
    queryFn: fetchContacts,
    keepPreviousData: true
  })

  const onSearch = (event) => {
    setSearch(event.target.value)
  }

  const onEdit = (id) => {
    navigate(`/contactos/editar/${id}`)
  }

  const addContact = () => {
    navigate('/contactos/crear')
  }

  if (isLoading) {
    return <Loading />
  }
 
  return (
    <>
      {
        isLoading
          ? <Loading className='mt-28 md:mt-64' />
          : (
            <div>
              <Card>
                <div className='mb-4 md:flex md:justify-between'>
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Listado de Contactos</h1>
                  <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                    <div className='relative'>
                      <TextInput
                        name='search'
                        placeholder='Buscar'
                        onChange={onSearch}
                        value={search}
                      />

                      <div
                        type='button'
                        className='absolute top-3 right-2'
                      >
                        <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-search dark:stroke-white' width='16' height='16' viewBox='0 0 24 24' strokeWidth='1.5' stroke='#000000' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                          <path d='M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0' />
                          <path d='M21 21l-6 -6' />
                        </svg>
                      </div>
                    </div>

                    <DeleteModal
                      themeClass='bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700'
                      centered
                      title='Acciones del Evento'
                      message='¿Estás seguro de que deseas eliminar este evento?'
                      labelBtn='Aceptar'
                    />

                    <div className='flex gap-4'>
                      <button
                        type='button'
                        onClick={addContact}
                        className='bg-blue-600 hover:bg-blue-800 text-white items-center text-center py-2 px-6 rounded-lg'
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card noborder>
                <div className='overflow-x-auto -mx-6'>
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
                            (contactos.items.length > 0)
                              ? (contactos.items.map((contacto) => {
                                return (
                                  <tr key={contacto.id}>
                                    <td className='table-td'>{contacto.apellido} {contacto.nombre}</td>

                                    <td className='table-td'>{contacto.email}</td>
                                    <td className='table-td'>{contacto.telefono}</td>
                                  
                                    <td className='table-td flex justify-start gap-2'>
                                      <EditButton evento={contacto} onEdit={onEdit} />
                                    </td>

                                  </tr>
                                )
                              }))
                              : (<tr><td colSpan='10' className='text-center py-2 dark:bg-gray-800'>No se encontraron resultados</td></tr>)
                          }
                        </tbody>
                      </table>

                      {/* Paginado */}
                      <div className='flex justify-center mt-8'>
                        <Pagination
                          paginate={{
                            current: contactos.current,
                            totalPages: contactos.totalPages
                          }}
                          onPageChange={(page) => setCurrentPage(page)}
                          text
                        />
                      </div>

                    </div>
                  </div>
                </div>
              </Card>
            </div>

          )
      }

    </>
  )
}
