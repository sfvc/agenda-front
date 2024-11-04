/* eslint-disable react/no-children-prop */
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createLabels, deleteLabels, fetchLabels, updateLabels } from '../services/labelsService'
import { LabelsForm } from '../components/agenda/forms/LabelsForm'
import { toast } from 'react-toastify'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Loading from '@/components/Loading'
import Pagination from '@/components/ui/Pagination'
import EditModal from '@/components/ui/EditModal'
import EditButton from '@/components/buttons/EditButton'
import DeleteButton from '../components/buttons/DeleteButton'

const columns = [
  {
    label: 'ID',
    field: 'id'
  },
  {
    label: 'Nombre',
    field: 'nombre'
  },
  {
    label: 'Acciones',
    field: 'acciones'
  }
]

export const Labels = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState(null)
  const { data: etiquetas, isLoading, refetch } = useQuery({
    queryKey: ['etiquetas', currentPage],
    queryFn: () => fetchLabels(currentPage),
    keepPreviousData: true
  })

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsEditModalOpen(false)
    setSelectedLabel(null)
  }

  function onEdit (label) {
    setSelectedLabel(label)
    setIsEditModalOpen(true)
  }

  async function onDelete (id) {
    try {
      await deleteLabels(id)
      toast.success('La etiqueta se eliminó')
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
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Listado de Etiquetas</h1>
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
                        title='Agregar Etiqueta'
                        labelClass='bg-blue-600 hover:bg-blue-800 text-white items-center text-center py-2 px-6 rounded-lg'
                        centered
                        children={
                          <LabelsForm
                            fnAction={createLabels}
                            refetchLabel={refetch}
                            onClose={handleCloseModal}
                          />
                        }
                      />

                      <EditModal
                        isOpen={isEditModalOpen}
                        onClose={handleCloseModal}
                        title='Editar Etiqueta'
                        centered
                        children={
                          <LabelsForm
                            fnAction={(label) => updateLabels(selectedLabel, label)}
                            initialData={selectedLabel}
                            refetchLabel={refetch}
                            onClose={handleCloseModal}
                            id={selectedLabel}
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
                            (etiquetas?.items && etiquetas.items.length > 0)
                              ? (etiquetas.items.map((etiqueta) => (
                                <tr key={etiqueta.id}>
                                  <td className='table-td'>{etiqueta.id}</td>
                                  <td className='table-td'>{etiqueta.nombre}</td>
                                  <td className='table-td flex justify-start gap-2'>
                                    <EditButton evento={etiqueta} onEdit={onEdit} />
                                    <DeleteButton evento={etiqueta} onDelete={onDelete} refetch={refetch} />
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
                            current: etiquetas.current,
                            totalPages: etiquetas.totalPages
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
