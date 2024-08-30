import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DeleteModal } from '@/components/ui/DeleteModal'
import { useQuery } from '@tanstack/react-query'
import { getEventos } from '@/services/eventService'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import Loading from '@/components/Loading'
import EditButton from '@/components/buttons/EditButton'
import ViewButton from '@/components/buttons/ViewButton'
import AgendaButton from '@/components/buttons/AgendaButton'
import { TextInput } from 'flowbite-react'
import { formatDate } from '@/components/Format'
import columnEventos from '@/json/columnsEventos.json'

export const Eventos = () => {
  const navigate = useNavigate()
  const [search] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const { data: eventos, isLoading } = useQuery({
    queryKey: ['eventos', currentPage],
    queryFn: () => getEventos(currentPage),
    keepPreviousData: true
  })

  if (isLoading) {
    return <Loading />
  }

  function addEvento() {
    navigate('/eventos/crear')
  }

  async function showEvento(id) {
    await onEdit(id)
    navigate(`/eventos/ver/${id}`)
  }

  async function onEdit(id) {
    navigate(`/eventos/editar/${id}`)
  }

  async function onDelete(id) {

  }
  async function onSearch(params) {

  }

  const parseUbicacion = (ubicacion) => {
    try {
      const parsed = JSON.parse(ubicacion);
      return parsed.direccion || 'Dirección no disponible';
    } catch {
      return 'Dirección no disponible';
    }
  };
  return (
    <>
      {
        isLoading
          ? <Loading className='mt-28 md:mt-64' />
          : (
            <>
              <Card>
                <div className='mb-4 md:flex md:justify-between'>
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Listado de Eventos</h1>
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
                      btnFunction={() => onDelete}
                    />

                    <div className='flex gap-4'>
                      <button
                        type='button'
                        onClick={addEvento}
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
                            {columnEventos.map((column, i) => (
                              <th key={i} scope='col' className='table-th'>
                                {column.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700'>
                          {
                            (eventos.items.length > 0)
                              ? (eventos.items.map((evento) => {
                                return (
                                  <tr key={evento.id}>
                                    <td className='table-td'>{evento.id}</td>
                                    <td className='table-td'>{evento.nombre_solicitante}</td>
                                    <td className='table-td'>{evento.email_solicitante}</td>
                                    <td className='table-td'>{evento.telefono_solicitante}</td>
                                    <td className='table-td'>{evento.descripcion}</td>
                                    {/* <td className='table-td'>{parseUbicacion(evento.ubicacion)}</td> */}
                                    <td className='table-td'>{formatDate(evento.fecha)}</td>
                                    <td className='table-td'>{evento.detalle_planificacion}</td>
                                    <td className='table-td'>{evento.categoria.nombre}</td>
                                    <td className='table-td'>
                                      <span className={`inline-block text-black px-3 min-w-[90px] text-center py-1 rounded-full bg-opacity-25 ${evento.estado === 'A_REALIZAR' ? 'text-black bg-success-500 dark:bg-success-400' : evento.estado === 'PENDIENTE' ? 'text-black bg-warning-500 dark:bg-warning-500' : 'text-black bg-danger-500 dark:bg-danger-500'}`}>
                                        {evento.estado}
                                      </span>
                                    </td>
                                    <td className='table-td flex justify-start gap-2'>
                                      <ViewButton evento={evento} onView={showEvento} />
                                      <EditButton evento={evento} onEdit={onEdit} />
                                      <AgendaButton evento={evento} onDelete={onDelete} />
                                    </td>
                                  </tr>
                                );
                              }))
                              : (<tr><td colSpan='10' className='text-center py-2 dark:bg-gray-800'>No se encontraron resultados</td></tr>)
                          }
                        </tbody>

                      </table>

                      {/* Paginado */}
                      <div className='flex justify-center mt-8'>
                        <Pagination
                          paginate={{
                            current: eventos.current,
                            totalPages: eventos.totalPages
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
