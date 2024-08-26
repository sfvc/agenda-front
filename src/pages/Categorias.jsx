/* eslint-disable react/no-children-prop */
import { useState } from 'react'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Loading from '@/components/Loading'
import { TextInput } from 'flowbite-react'
import Pagination from '@/components/ui/Pagination'
import { useQuery } from '@tanstack/react-query'
import { createCategory, getCategory } from '@/services/categoryService'
import { CategoryForm } from '@/components/agenda/forms/CategoryForm'

const columns = [
  {
    label: 'Nombre',
    field: 'nombre'
  }
]

export const Categorias = () => {
  const [search] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: categorias, isLoading, refetch } = useQuery({
    queryKey: ['categorias', currentPage],
    queryFn: () => getCategory(currentPage),
    keepPreviousData: true
  })

  if (isLoading) {
    return <Loading />
  }

  const onClose = () => {
    setIsModalOpen(false)
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
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Listado de Categorias</h1>
                  <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                    <div className='flex gap-2'>
                      <div className='relative'>

                        <TextInput
                          name='search'
                          placeholder='Buscar'
                          // onChange={onSearch}
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
                      <Modal
                        title='Agregar Categoria'
                        label='Agregar'
                        labelClass='bg-blue-600 hover:bg-blue-800 text-white items-center text-center py-2 px-6 rounded-lg'
                        show={isModalOpen}
                        onClose={onClose}
                        centered
                        children={
                          <CategoryForm
                            fnAction={createCategory}
                            refetchCategories={refetch}
                            onClose={onClose}
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
