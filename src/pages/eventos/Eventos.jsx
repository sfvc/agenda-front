import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getEventos, nextStageEvent } from '@/services/eventService'
import { formatDate } from '@/components/Format'
import { MapEvent } from './MapEvent'
import { SelectForm } from '@/components/agenda/forms'
import { getCategory } from '@/services/categoryService'
import { toast } from 'react-toastify'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import Loading from '@/components/Loading'
import EditButton from '@/components/buttons/EditButton'
import ViewButton from '@/components/buttons/ViewButton'
import AgendaButton from '@/components/buttons/AgendaButton'
import columnEventos from '@/json/columnsEventos.json'

const estados = [
  { id: 'PENDIENTE', nombre: 'Pendiente' },
  { id: 'A_CONSIDERAR', nombre: 'A Considerar' },
  { id: 'A_REALIZAR', nombre: 'A Realizar' },
  { id: 'REALIZADO', nombre: 'Realizado' }
]

export const Eventos = () => {
  const navigate = useNavigate()
  const [state, setState] = useState('')
  const [category, setCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredEventos, setFilteredEventos] = useState([])
  const { data: eventos, isLoading, refetch } = useQuery({
    queryKey: ['eventos', currentPage],
    queryFn: () => getEventos(currentPage),
    keepPreviousData: true
  })

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => getCategory(),
    keepPreviousData: true
  })

  const eventosAMostrar = filteredEventos.length > 0 ? filteredEventos : (eventos?.items || [])

  if (isLoading) {
    return <Loading />
  }

  function addEvento () {
    navigate('/eventos/crear')
  }

  async function showEvento (id) {
    await onEdit(id)
    navigate(`/eventos/ver/${id}`)
  }

  async function onEdit (id) {
    navigate(`/eventos/editar/${id}`)
  }

  async function onDelete (id, estado) {
    if (estado === 'PENDIENTE') {
      navigate(`/eventos/estado_considerar/${id}`)
    } else if (estado === 'A_CONSIDERAR') {
      navigate(`/eventos/estado_realizar/${id}`)
    } else if (estado === 'A_REALIZAR') {
      try {
        await nextStageEvent(id)
        toast.success('El evento pasó al estado REALIZADO')
        await refetch()
        setFilteredEventos(prevEventos => prevEventos.map(evento => {
          if (evento.id === id) {
            return { ...evento }
          }
          return evento
        }))
      } catch (error) {
        console.error(error)
        toast.error('Hubo un error al intentar pasar el evento')
      }
    }
  }

  async function onSearch () {
    const myEventos = await getEventos(currentPage, state, category)
    setFilteredEventos(myEventos.items)
  }

  function separarTresPrimerosElementos (cadena) {
    const elementos = cadena.split(',').map(elemento => elemento.trim())
    const primerosTres = elementos.slice(0, 3)
    const resultadoEnCadena = primerosTres.join(', ')
    return resultadoEnCadena
  }
  const parseUbicacion = (ubicacion) => {
    try {
      const parsed = JSON.parse(ubicacion)
      const resultado = separarTresPrimerosElementos(parsed.direccion)
      return resultado || 'Dirección no disponible'
    } catch {
      return 'Dirección no disponible'
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
                <div className='mb-4 flex flex-col md:flex-row md:justify-between'>
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Listado de Eventos</h1>
                  <div className='flex flex-col md:flex-row gap-3 items-start md:items-end'>
                    <SelectForm title='Estado' options={estados} onChange={(e) => setState(e.target.value)} />
                    <SelectForm title='Categorias' options={categorias?.items} onChange={(e) => setCategory(e.target.value)} />
                    <button
                      type='button'
                      onClick={onSearch}
                      className='bg-green-600 hover:bg-green-800 text-white items-center text-center py-2 px-6 rounded-lg mt-2 md:mt-0'
                    >
                      Filtrar
                    </button>
                  </div>
                  <div className='flex flex-col md:flex-row items-start md:items-center gap-4 mt-4 md:mt-0'>
                    <button
                      type='button'
                      onClick={addEvento}
                      className='bg-blue-600 hover:bg-blue-800 text-white items-center text-center py-2 px-6 rounded-lg'
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </Card>
              <MapEvent isActive events={eventosAMostrar} />
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
                            (eventosAMostrar.length > 0)
                              ? (eventosAMostrar.map((evento) => {
                                  return (
                                    <tr key={evento.id}>
                                      <td className='table-td'>{evento.id}</td>
                                      <td className='table-td'>{evento.nombre_solicitante}</td>
                                      <td className='table-td'>{evento.telefono_solicitante}</td>
                                      <td className='table-td max-w-96'>{parseUbicacion(evento.ubicacion)}</td>
                                      <td className='table-td'>{formatDate(evento.fecha)}</td>
                                      <td className='table-td'>{evento.categoria?.nombre}</td>
                                      <td className='table-td'>
                                        <span className={`inline-block text-black px-3 min-w-[90px] text-center py-1 rounded-full bg-opacity-25 ${evento.estado === 'A_REALIZAR' ? 'text-black bg-indigo-500 dark:bg-indigo-400' : evento.estado === 'PENDIENTE' ? 'text-black bg-danger-500 dark:bg-danger-500' : evento.estado === 'REALIZADO' ? 'text-black bg-green-500 dark:bg-green-400' : 'text-black bg-warning-500 dark:bg-warning-500'}`}>
                                          {evento.estado}
                                        </span>
                                      </td>
                                      <td className='table-td  flex gap-2'>
                                        <ViewButton evento={evento} onView={showEvento} />
                                        <EditButton evento={evento} onEdit={onEdit} />
                                        <AgendaButton evento={evento} onDelete={() => onDelete(evento.id, evento.estado)} />
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
