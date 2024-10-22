import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getEventos, nextStageEvent, rejectEvent } from '@/services/eventService'
import { formatDate } from '@/components/Format'
import { MapEvent } from './MapEvent'
import { SelectForm } from '@/components/agenda/forms'
import { getCategory } from '@/services/categoryService'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { fetchLabels } from '../../services/labelsService'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import Loading from '@/components/Loading'
import EditButton from '@/components/buttons/EditButton'
import ViewButton from '@/components/buttons/ViewButton'
import AgendaButton from '@/components/buttons/AgendaButton'
import columnEventos from '@/json/columnsEventos.json'
import RejectButton from '@/components/buttons/RejectButton'

const estados = [
  { id: 'PENDIENTE', nombre: 'Pendiente' },
  { id: 'A_CONSIDERAR', nombre: 'A Considerar' },
  { id: 'A_REALIZAR', nombre: 'A Realizar' },
  { id: 'REALIZADO', nombre: 'Realizado' },
  { id: 'RECHAZADO', nombre: 'Rechazado' }
]

const barrios = [
  { id: '9 DE JULIO', nombre: '9 DE JULIO' },
  { id: 'ACHACHAY', nombre: 'ACHACHAY' },
  { id: 'AVELLANEDA Y TULA', nombre: 'AVELLANEDA Y TULA' },
  { id: 'BANDA DE VARELA', nombre: 'BANDA DE VARELA' },
  { id: 'CENTRO', nombre: 'CENTRO' },
  { id: 'CHOYA', nombre: 'CHOYA' },
  { id: 'JORGE BERMUDEZ', nombre: 'JORGE BERMUDEZ' },
  { id: 'J. M. DE ROSAS', nombre: 'J. M. DE ROSAS' },
  { id: 'LA CHACARITA', nombre: 'LA CHACARITA' },
  { id: 'LA ESTANCITA', nombre: 'LA ESTANCITA' },
  { id: 'LA TABLADA', nombre: 'LA TABLADA' },
  { id: 'LOS EJIDOS', nombre: 'LOS EJIDOS' },
  { id: 'LUIS FRANCO', nombre: 'LUIS FRANCO' },
  { id: 'MANUEL DE SALAZAR', nombre: 'MANUEL DE SALAZAR' },
  { id: 'NORTE', nombre: 'NORTE' },
  { id: 'PORTAL DEL NORTE', nombre: 'PORTAL DEL NORTE' },
  { id: 'ROMIS RAIDEN', nombre: 'ROMIS RAIDEN' },
  { id: 'SUD', nombre: 'SUD' },
  { id: 'VALLE CHICO', nombre: 'VALLE CHICO' },
  { id: 'VILLA CUBAS', nombre: 'VILLA CUBAS' },
  { id: 'VILLA PARQUE CHACABUCO', nombre: 'VILLA PARQUE CHACABUCO' },
  { id: 'ZONA INDUSTRIAL (PANTANILLO)', nombre: 'ZONA INDUSTRIAL (PANTANILLO)' }
]

const circuitos = [
  { id: '1', nombre: 'Circuito N° 1' },
  { id: '2', nombre: 'Circuito N° 2' },
  { id: '3', nombre: 'Circuito N° 3' },
  { id: '4', nombre: 'Circuito N° 4' },
  { id: '5', nombre: 'Circuito N° 5' },
  { id: '6', nombre: 'Circuito N° 6' },
  { id: '7', nombre: 'Circuito N° 7' },
  { id: '8', nombre: 'Circuito N° 8' },
  { id: '9', nombre: 'Circuito N° 9' }
]

export const Eventos = () => {
  const navigate = useNavigate()
  const [state, setState] = useState('')
  const [buttonFilter, setButtonFilter] = useState(false)
  const [category, setCategory] = useState('')
  const [fechIni, setFechIni] = useState('')
  const [fechFin, setFechFin] = useState('')
  const [circuito, setCircuito] = useState('')
  const [barrio, setBarrio] = useState('')
  const [etiquetas, setEtiquetas] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const { googleAuth } = useSelector(state => state.auth)
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

  const { data: labels } = useQuery({
    queryKey: ['labels'],
    queryFn: () => fetchLabels(),
    keepPreviousData: true
  })

  const eventosAMostrar = filteredEventos.length > 0 ? filteredEventos : (eventos?.items || [])

  useEffect(() => {
    if (state || category || fechIni || fechFin || circuito || barrio || etiquetas) {
      setButtonFilter(false)
    } else {
      setButtonFilter(true)
    }
  }, [state, category, fechIni, fechFin, circuito, barrio, etiquetas])

  if (isLoading) {
    return <Loading />
  }

  function addEvento () {
    navigate(`/eventos/crear?page=${currentPage}`)
  }

  async function showEvento (id) {
    await onEdit(id)
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

  async function onReject (id) {
    try {
      await rejectEvent(id)
      toast.success('El evento se desestimo')
      await refetch()
    } catch (error) {
      console.error(error)
      toast.error('Hubo un error al intentar desestimar')
    }
  }

  async function onSearch () {
    if (buttonFilter) return
    const myEventos = await getEventos(currentPage, circuito, state, category, fechIni, fechFin, barrio, etiquetas)

    if (myEventos.items.length === 0) {
      toast.error('No se encontraron coincidencias')
    } else {
      toast.success('Filtrado correctamente')
    }
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
                </div>
                <div className='flex flex-col md:flex-row gap-3 items-start md:items-end justify-center'>
                  <SelectForm title='Barrio' options={barrios} onChange={(e) => setBarrio(e.target.value)} />
                  <SelectForm title='Circuito' options={circuitos} onChange={(e) => setCircuito(e.target.value)} />
                  <SelectForm title='Etiqueta' options={labels?.items} onChange={(e) => setEtiquetas(e.target.value)} />

                  <SelectForm title='Estado' options={estados} onChange={(e) => setState(e.target.value)} />
                  <SelectForm title='Ejes' options={categorias?.items} onChange={(e) => setCategory(e.target.value)} />

                  <div className='flex flex-col'>
                    <label htmlFor='fechaInicio' className='form-label'>Fecha de Inicio</label>
                    <input
                      type='date'
                      id='fechaInicio'
                      value={fechIni}
                      className='form-control py-2'
                      onChange={(e) => setFechIni(e.target.value)}
                    />
                  </div>

                  <div className='flex flex-col'>
                    <label htmlFor='fechaFin' className='form-label'>Fecha de Fin</label>
                    <input
                      type='date'
                      id='fechaFin'
                      value={fechFin}
                      className='form-control py-2'
                      onChange={(e) => setFechFin(e.target.value)}
                    />
                  </div>

                  <button
                    type='button'
                    onClick={onSearch}
                    disabled={buttonFilter}
                    className={`${buttonFilter ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-800'} text-white py-2 px-6 rounded-lg mt-2 md:mt-0`}
                  >
                    {buttonFilter ? 'Filtrar' : 'Filtrar'}
                  </button>
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
                                      <td className='table-td'>{evento.nombre_solicitante || '-'}</td>
                                      <td className='table-td'>{evento.telefono_solicitante || '-'}</td>
                                      <td className='table-td max-w-96'>{parseUbicacion(evento.ubicacion) || '-'}</td>
                                      <td className='table-td'>{formatDate(evento.fecha) || '-'}</td>
                                      <td className='table-td'>{evento.categoria?.nombre || '-'}</td>
                                      <td className='table-td'>
                                        <span
                                          className={`inline-block text-black px-3 min-w-[90px] text-center py-1 rounded-full bg-opacity-25 
                                            ${evento.estado === 'A_REALIZAR'
                                            ? 'text-black bg-indigo-500 dark:bg-indigo-400'
                                            : evento.estado === 'PENDIENTE'
                                              ? 'text-black bg-cyan-500 dark:bg-cyan-500'
                                              : evento.estado === 'REALIZADO'
                                                ? 'text-black bg-green-500 dark:bg-green-400'
                                                : evento.estado === 'RECHAZADO'
                                                  ? 'text-black bg-red-500 dark:bg-red-400'
                                                  : 'text-black bg-warning-500 dark:bg-warning-500'}`}
                                        >
                                          {evento.estado}
                                        </span>
                                      </td>
                                      <td className='table-td flex gap-2'>
                                        <ViewButton evento={evento} onView={showEvento} />
                                        {evento.estado !== 'RECHAZADO' && (
                                          <EditButton evento={evento} onEdit={onEdit} />
                                        )}
                                        <AgendaButton evento={evento} onDelete={() => onDelete(evento.id, evento.estado)} />
                                        {evento.estado !== 'RECHAZADO' && evento.estado !== 'REALIZADO' && (
                                          <RejectButton evento={evento} onReject={onReject} />
                                        )}
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
