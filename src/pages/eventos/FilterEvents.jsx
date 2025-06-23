import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SelectForm } from '@/components/agenda/forms'
import { fetchLabelsBySelect } from '../../services/labelsService'
import { fetchCategoryBySelect } from '../../services/categoryService'
import { fetchOrganizersBySelect } from '../../services/organizersService'
import { Icon } from '@iconify/react/dist/iconify.js'

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

export const FilterEvents = ({ onSearch }) => {
  const [category, setCategory] = useState('')
  const [fechIni, setFechIni] = useState('')
  const [fechFin, setFechFin] = useState('')
  const [circuito, setCircuito] = useState('')
  const [barrio, setBarrio] = useState('')
  const [etiquetas, setEtiquetas] = useState('')
  const [organizadores, setOrganizadores] = useState('')
  const [state, setState] = useState('')
  const [buttonFilter, setButtonFilter] = useState(false)
  const [listLabels, setListLabels] = useState([])
  const [listOrganizers, setListOrganizers] = useState([])

  const [filtrar, setFiltrar] = useState(false)
  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => fetchCategoryBySelect(),
    keepPreviousData: true
  })

  const { data: labels } = useQuery({
    queryKey: ['labels'],
    queryFn: () => fetchLabelsBySelect(),
    keepPreviousData: true
  })

  const { data: organizers } = useQuery({
    queryKey: ['organizers'],
    queryFn: () => fetchOrganizersBySelect(),
    keepPreviousData: true
  })

  const handleFilters = () => {
    const filters = {
      state,
      category,
      fechIni,
      fechFin,
      circuito,
      barrio,
      etiquetas,
      organizadores
    }
    onSearch(filters)
  }

  const cleanFilters = () => {
    setCategory('')
    setFechIni('')
    setFechFin('')
    setCircuito('')
    setBarrio('')
    setEtiquetas('')
    setOrganizadores('')
    setState('')
    setListLabels([])
    setListOrganizers([])
  }

  useEffect(() => {
    if (category === '' && fechIni === '' && fechFin === '' && circuito === '' && barrio === '' && etiquetas === '' && organizadores === '' && state === '') {
      handleFilters()
    }
  }, [category, fechIni, fechFin, circuito, barrio, etiquetas, organizadores, state])

  useEffect(() => {
    if (state || category || fechIni || fechFin || circuito || barrio || etiquetas || organizadores) {
      setButtonFilter(false)
    } else {
      setButtonFilter(true)
    }
  }, [state, category, fechIni, fechFin, circuito, barrio, etiquetas, organizadores])

  const addLabels = (e) => {
    const exists = listLabels.some((etiqueta) => etiqueta === e)

    if (exists) {
      setListLabels(listLabels.filter((etiqueta) => etiqueta !== e))
    } else {
      setListLabels([...listLabels, e])
    }
  }

  const addOrganizers = (e) => {
    const exists = listOrganizers.some((organizador) => organizador === e)

    if (exists) {
      setListOrganizers(listOrganizers.filter((organizador) => organizador !== e))
    } else {
      setListOrganizers([...listOrganizers, e])
    }
  }

  useEffect(() => {
    setEtiquetas(listLabels)
  }, [listLabels])

  useEffect(() => {
    setOrganizadores(listOrganizers)
  }, [listOrganizers])

  return (
    <>
      <div className=' flex justify-end'>
        <button
          type='button'
          className='bg-indigo-600 hover:bg-indigo-800 text-white py-2 px-6 rounded-lg my-2 md:mt-0'
          onClick={() => setFiltrar(!filtrar)}
        >
          Generar filtros
        </button>
      </div>

      <div
        className={`transition-all duration-700 ease-in-out transform ${filtrar ? 'opacity-100 scale-100' : 'opacity-0 scale-0 hidden'} origin-top`}
      >
        {filtrar && (
          <>

            <div className='grid grid-rows-2 grid-cols-3 items-center content-center gap-3 '>
              <div>
                <SelectForm title='Estado' options={estados} onChange={(e) => setState(e.target.value)} value={state} />
              </div>

              <div>
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
              </div>

              <div>
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
              </div>

              <div>
                <SelectForm title='Ejes' options={categorias} onChange={(e) => setCategory(e.target.value)} value={category} />
              </div>

              <div>
                <SelectForm title='Barrio' options={barrios} onChange={(e) => setBarrio(e.target.value)} value={barrio} />
              </div>

              <div>
                <SelectForm title='Circuito' options={circuitos} onChange={(e) => setCircuito(e.target.value)} value={circuito} />
              </div>

            </div>

            <div className='my-4'>
              <p className='text-sm font-semibold mb-2'>Etiquetas</p>
              <div className='flex flex-wrap gap-2'>
                {
                  labels?.map((item) => (
                    <button
                      className={`flex gap-1 px-2 py-1 text-sm border rounded-md dark:text-black ${listLabels.includes(item.id) ? 'bg-green-500 text-white dark:text-white' : 'bg-white dark:bg-gray-300 dark:text-black'}`}
                      key={item.id}
                      onClick={() => { addLabels(item.id) }}
                    >
                      <Icon
                        icon='mdi:tag'
                        className={`w-4 h-4 mt-1 ${listLabels.includes(item.id)
                          ? 'text-white'
                          : 'text-green-600 dark:text-green-400'
                          }`}
                      />
                      {item.nombre.toUpperCase()}
                    </button>
                  ))
                }
              </div>
            </div>

            <div className='my-4'>
              <p className='text-sm font-semibold mb-2'>Organizadores</p>
              <div className='flex flex-wrap gap-2'>
                {
                  organizers?.map((item) => (
                    <button
                      className={`flex gap-1 px-2 py-1 text-sm border rounded-md dark:text-black ${listOrganizers.includes(item.id) ? 'bg-blue-500 text-white dark:text-white' : 'bg-white dark:bg-gray-300 dark:text-black'}`}
                      key={item.id}
                      onClick={() => { addOrganizers(item.id) }}
                    >
                      <Icon
                        icon='mdi:account-tie'
                        className={`w-4 h-4 mt-0.5 ${listOrganizers.includes(item.id)
                            ? 'text-white'
                            : 'text-blue-600 dark:text-purple-400'
                          }`}
                      />
                      {item.nombre.toUpperCase()}
                    </button>
                  ))
                }
              </div>
            </div>

            <div className='flex justify-center mt-4  gap-3'>
              <button
                type='button'
                onClick={handleFilters}
                disabled={buttonFilter}
                className={`${buttonFilter ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-800'} text-white py-2 px-6 rounded-lg mt-2 md:mt-0`}
              >
                {buttonFilter ? 'Seleccione un filtro' : 'Aplicar Filtros'}
              </button>

              <button
                type='button'
                className='bg-red-600 hover:bg-red-800 text-white py-2 px-6 rounded-lg mt-2 md:mt-0'
                onClick={cleanFilters}
              >
                Limpiar filtros
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
