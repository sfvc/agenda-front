import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { deleteGroup, getGroup } from '@/services/groupService'
import { toast } from 'react-toastify'
import Loading from '@/components/Loading'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import columnsGroup from '@/json/columnsGroup'
import EditButton from '@/components/buttons/EditButton'
import DeleteButton from '@/components/buttons/DeleteButton'

export const Groups = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialPage = parseInt(queryParams.get('page')) || 1
  const [currentPage, setCurrentPage] = useState(initialPage)
  const { data: grupos, isLoading, refetch } = useQuery({
    queryKey: ['grupo', currentPage],
    queryFn: () => getGroup(currentPage),
    keepPreviousData: true
  })

  const onPageChange = (page) => {
    setCurrentPage(page)
    navigate(`?page=${page}`)
  }

  const addGroup = () => {
    navigate(`/grupos/crear?page=${currentPage}`)
  }

  async function onEdit (id) {
    navigate(`/grupos/editar/${id}?page=${currentPage}`)
  }

  async function onDelete (id) {
    try {
      await deleteGroup(id)
      toast.success('El grupo se eliminó')
      await refetch()
    } catch (error) {
      console.error(error)
      toast.error('Hubo un error al intentar eliminar')
    }
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
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Listado de Grupos</h1>
                  <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                    <div className='flex gap-4'>
                      <button
                        type='button'
                        onClick={addGroup}
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
                            {columnsGroup.map((column, i) => (
                              <th key={i} scope='col' className='table-th'>
                                {column.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700'>
                          {
                            (grupos.items.length > 0)
                              ? (grupos.items.map((grupo) => {
                                  return (
                                    <tr key={grupo.id}>
                                      <td className='table-td'>{grupo.nombre}</td>
                                      <td className='table-td flex gap-2'>
                                        <EditButton evento={grupo} onEdit={onEdit} />
                                        <DeleteButton evento={grupo} onDelete={onDelete} refetch={refetch} />
                                      </td>
                                    </tr>
                                  )
                                }))
                              : (<tr><td colSpan='10' className='text-center py-2 dark:bg-gray-800'>No se encontraron resultados</td></tr>)
                          }
                        </tbody>
                      </table>

                      <div className='flex justify-center mt-8'>
                        <Pagination
                          paginate={{
                            current: grupos.current,
                            totalPages: grupos.totalPages
                          }}
                          onPageChange={onPageChange}
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
