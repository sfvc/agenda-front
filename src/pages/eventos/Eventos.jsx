import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getEventos, nextStageEvent, rejectEvent } from '@/services/eventService'
import { formatDate } from '@/components/Format'
import MapEvent from './MapEvent'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import Loading from '@/components/Loading'
import EditButton from '@/components/buttons/EditButton'
import ViewButton from '@/components/buttons/ViewButton'
import AgendaButton from '@/components/buttons/AgendaButton'
import columnEventos from '@/json/columnsEventos.json'
import RejectButton from '@/components/buttons/RejectButton'
import { FilterEvents } from './FilterEvents'

export const Eventos = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialPage = parseInt(queryParams.get('page')) || 1
  const [currentPage, setCurrentPage] = useState(initialPage)
  const { googleAuth } = useSelector(state => state.auth)
  const [filteredEventos, setFilteredEventos] = useState([])
  const { user } = useSelector((state) => state.auth)
  const [totalPages, setTotalPages] = useState()

  const { data: eventos, isLoading, refetch } = useQuery({
    queryKey: ['eventos', currentPage],
    queryFn: () => getEventos(currentPage),
    keepPreviousData: true
  })

  useEffect(() => {
    setFilteredEventos([])
    refetch()
  }, [currentPage, refetch])

  const eventosAMostrar = filteredEventos.length > 0 ? filteredEventos : (eventos?.items || [])
  // const totalPages = Math.ceil(filteredEventos.length / 10) || Math.ceil(eventos?.totalItems / 10)

  if (isLoading) {
    return <Loading />
  }

  const onPageChange = (page) => {
    setCurrentPage(page)
    navigate(`?page=${page}`)
  }

  function addEvento () {
    navigate(`/eventos/crear?page=${currentPage}`)
  }

  async function showEvento (id) {
    navigate(`/eventos/ver/${id}?page=${currentPage}`)
  }

  async function onEdit (id) {
    navigate(`/eventos/editar/${id}?page=${currentPage}`)
  }

  async function onDelete (id, estado) {
    if (estado === 'PENDIENTE') {
      navigate(`/eventos/estado_considerar/${id}?page=${currentPage}`)
    } else if (estado === 'A_CONSIDERAR') {
      navigate(`/eventos/estado_realizar/${id}?page=${currentPage}`)
    } else if (estado === 'A_REALIZAR') {
      try {
        await nextStageEvent(id)
        toast.success('El evento pasó al estado REALIZADO')
        await refetch()
        setFilteredEventos(prevEventos =>
          prevEventos.map(evento =>
            evento.id === id ? { ...evento, estado: 'REALIZADO' } : evento
          )
        )
      } catch (error) {
        console.error(error)
        toast.error('Hubo un error al intentar pasar el evento')
      }
    }
  }

  async function onReject (id) {
    try {
      await rejectEvent(id)
      toast.success('El evento se desestimó')
      await refetch()
      setFilteredEventos(prevEventos =>
        prevEventos.map(evento =>
          evento.id === id ? { ...evento, estado: 'RECHAZADO' } : evento
        )
      )
    } catch (error) {
      console.error(error)
      toast.error('Hubo un error al intentar desestimar')
    }
  }

  async function onSearch (e) {
    const myEventos = await getEventos(currentPage, e.circuito, e.state, e.category, e.fechIni, e.fechFin, e.barrio, e.etiquetas, e.organizadores)

    if (myEventos.items.length === 0) {
      toast.error('No se encontraron coincidencias')
    }

    setFilteredEventos(myEventos.items)
    setTotalPages(myEventos.totalPages)
  }

  return (
    <>
      {isLoading
        ? (
          <Loading className='mt-28 md:mt-64' />
          )
        : (
          <>
            <Card>
              <div className='mb-4 flex flex-col md:flex-row md:justify-between'>
                <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Listado de Eventos</h1>

                {user.rol !== 'visualizador' && (
                  <div className='flex flex-col md:flex-row items-start md:items-center gap-4 mt-4 md:mt-0'>
                    <button
                      type='button'
                      onClick={addEvento}
                      disabled={!googleAuth}
                      className={`bg-blue-600 hover:bg-blue-800 text-white items-center text-center py-2 px-6 rounded-lg
                      ${!googleAuth ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Agregar
                    </button>
                  </div>
                )}
              </div>
            </Card>
            <Card>
              <FilterEvents onSearch={onSearch} />
            </Card>

            <MapEvent isActive events={eventosAMostrar} />

            <Card noborder>
              <div className='overflow-x-auto -mx-6'>
                <div className='inline-block min-w-full align-middle'>
                  <div className='overflow-hidden'>
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
                        {eventosAMostrar.length > 0
                          ? (
                              eventosAMostrar.map((evento) => (
                                <tr key={evento.id}>
                                  <td className='table-td'>{evento?.summary || '-'}</td>
                                  <td className='table-td'>{evento?.nombre_solicitante || '-'}</td>
                                  <td className='table-td max-w-96'>{evento?.location || '-'}</td>
                                  <td className='table-td'>{formatDate(evento?.fecha) || '-'}</td>
                                  <td className='table-td'>{evento?.categoria?.nombre || '-'}</td>
                                  <td className='table-td'>
                                    <span
                                      className={`inline-block text-black px-3 min-w-[90px] text-center py-1 rounded-full bg-opacity-25
                                  ${evento?.estado === 'A_REALIZAR'
                                    ? 'text-black bg-indigo-500 dark:bg-indigo-400'
                                    : evento?.estado === 'PENDIENTE'
                                    ? 'text-black bg-cyan-500 dark:bg-cyan-500'
                                    : evento?.estado === 'REALIZADO'
                                    ? 'text-black bg-green-500 dark:bg-green-400'
                                    : evento?.estado === 'RECHAZADO'
                                    ? 'text-black bg-red-500 dark:bg-red-400'
                                    : 'text-black bg-warning-500 dark:bg-warning-500'}`}
                                    >
                                      {evento?.estado}
                                    </span>
                                  </td>
                                  <td className='table-td flex gap-2'>
                                    <ViewButton evento={evento} onView={showEvento} />
                                    {evento.estado !== 'RECHAZADO' && user.rol !== 'visualizador' && (
                                      <EditButton evento={evento} onEdit={onEdit} />
                                    )}
                                    {user.rol !== 'visualizador' && (
                                      <AgendaButton evento={evento} onDelete={() => onDelete(evento.id, evento.estado)} refetch={refetch} />
                                    )}
                                    {evento.estado !== 'RECHAZADO' && evento.estado !== 'REALIZADO' && user.rol !== 'visualizador' && (
                                      <RejectButton evento={evento} onReject={onReject} refetch={refetch} />
                                    )}
                                  </td>
                                </tr>
                              ))
                            )
                          : (
                            <tr><td colSpan='10' className='text-center py-2 dark:bg-gray-800'>No se encontraron resultados</td></tr>
                            )}
                      </tbody>
                    </table>

                    {/* Paginado */}
                    <div className='flex justify-center mt-8'>
                      <Pagination
                        paginate={{
                          current: eventos.current,
                          totalPages
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
          )}
    </>
  )
}
