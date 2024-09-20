/* eslint-disable react/no-children-prop */
import { useState } from 'react'
import Card from '@/components/ui/Card'
import Loading from '@/components/Loading'
import { TextInput } from 'flowbite-react'
import Pagination from '@/components/ui/Pagination'
import { useQuery } from '@tanstack/react-query'
import { getUser } from '@/services/userService'
import EditButton from '@/components/buttons/EditButton'
import { useNavigate } from 'react-router-dom'

const columns = [
  {
    label: 'Nombre',
    field: 'nombre'
  },
  {
    label: 'Apellido',
    field: 'apellido'
  },
  {
    label: 'Usuario',
    field: 'username'
  },
  {
    label: 'Rol',
    field: 'rol'
  },
  {
    label: 'Acciones',
    field: 'acciones'
  }
]

export const Usuarios = () => {
  const navigate = useNavigate()
  const [search] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['usuarios', currentPage],
    queryFn: () => getUser(currentPage),
    keepPreviousData: true
  })

  if (isLoading) {
    return <Loading />
  }

  async function onSearch () {

  }

  async function onEdit (id) {
    navigate(`/usuarios/editar/${id}`)
  }

  function addUser () {
    navigate('/usuarios/crear')
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
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Listado de Usuarios</h1>
                  <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                    <div className='flex gap-2 items-center'>
                      <div className='relative flex-1'>
                        <TextInput
                          name='search'
                          placeholder='Buscar'
                          onChange={onSearch}
                          value={search}
                          className='w-full'
                        />
                      </div>
                      <button
                        type='button'
                        onClick={addUser}
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
                    <div className='overflow-hidden'>
                      <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                        <thead className='bg-slate-200 dark:bg-slate-700'>
                          <tr>
                            {columns.map((column, i) => (
                              <th key={i} scope='col' className='table-th'>
                                {column.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700'>
                          {
                            (usuarios?.items && usuarios.items.length > 0)
                              ? (usuarios.items.map((usuario) => (
                                <tr key={usuario.id}>
                                  <td className='table-td'>{usuario.nombre}</td>
                                  <td className='table-td'>{usuario.apellido}</td>
                                  <td className='table-td'>{usuario.username}</td>
                                  <td className='table-td'>{usuario.rol}</td>
                                  <td className='table-td flex justify-start gap-2'>
                                    <EditButton evento={usuario} onEdit={onEdit} />
                                  </td>
                                </tr>
                                )))
                              : (<tr><td colSpan='10' className='text-center py-2 dark:bg-gray-800'>No se encontraron resultados</td></tr>)
                          }
                        </tbody>
                      </table>

                      {/* Paginado */}
                      <div className='flex justify-center mt-8'>
                        <Pagination
                          paginate={{
                            current: usuarios.current,
                            totalPages: usuarios.totalPages
                          }}
                          onPageChange={(page) => setCurrentPage(page)}
                          text
                        />
                      </div>

                    </div>
                  </div>
                </div>
              </Card>
            </>
            )
      }
    </>
  )
}
