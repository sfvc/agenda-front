/* eslint-disable react/no-children-prop */
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createCategory, updateCategory, getCategory } from '@/services/categoryService'
import { CategoryForm } from '@/components/agenda/forms/CategoryForm'
import { toast } from 'react-toastify'
import { deleteCategory } from '../services/categoryService'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Loading from '@/components/Loading'
import Pagination from '@/components/ui/Pagination'
import EditModal from '@/components/ui/EditModal'
import EditButton from '@/components/buttons/EditButton'
import DeleteButton from '../components/buttons/DeleteButton'
import { useLocation, useNavigate } from 'react-router-dom'

const columns = [
  {
    label: 'Nombre',
    field: 'nombre'
  },
  {
    label: 'Acciones',
    field: 'acciones'
  }
]

export const Categorias = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialPage = parseInt(queryParams.get('page')) || 1
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const { data: categorias, isLoading, refetch } = useQuery({
    queryKey: ['categorias', currentPage],
    queryFn: () => getCategory(currentPage),
    keepPreviousData: true
  })

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsEditModalOpen(false)
    setSelectedCategory(null)
  }

  const onPageChange = (page) => {
    setCurrentPage(page)
    navigate(`?page=${page}`)
  }

  function onEdit (category) {
    setSelectedCategory(category)
    setIsEditModalOpen(true)
  }

  async function onDelete (id) {
    try {
      await deleteCategory(id)
      toast.success('El eje se eliminó')
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
            <>
              <Card>
                <div className='mb-4 md:flex md:justify-between'>
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Listado de Ejes</h1>
                  <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                    <div className='flex gap-2 items-center'>
                      <button
                        type='button'
                        onClick={handleOpenModal}
                        className='bg-blue-600 hover:bg-blue-800 text-white py-2 px-6 rounded-lg'
                      >
                        Agregar
                      </button>

                      <Modal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        title='Agregar Eje'
                        labelClass='bg-blue-600 hover:bg-blue-800 text-white items-center text-center py-2 px-6 rounded-lg'
                        centered
                        children={
                          <CategoryForm
                            fnAction={createCategory}
                            refetchCategories={refetch}
                            onClose={handleCloseModal}
                          />
                        }
                      />

                      <EditModal
                        isOpen={isEditModalOpen}
                        onClose={handleCloseModal}
                        title='Editar Eje'
                        centered
                        children={
                          <CategoryForm
                            fnAction={(category) => updateCategory(selectedCategory, category)}
                            initialData={selectedCategory}
                            refetchCategories={refetch}
                            onClose={handleCloseModal}
                            id={selectedCategory}
                          />
                        }
                      />
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
                            (categorias?.items && categorias.items.length > 0)
                              ? (categorias.items.map((categoria) => (
                                <tr key={categoria.id}>
                                  <td className='table-td'>{categoria.nombre}</td>
                                  <td className='table-td flex justify-start gap-2'>
                                    <EditButton evento={categoria} onEdit={onEdit} />
                                    <DeleteButton evento={categoria} onDelete={onDelete} refetch={refetch} />
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
                            current: categorias.current,
                            totalPages: categorias.totalPages
                          }}
                          onPageChange={onPageChange}
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
