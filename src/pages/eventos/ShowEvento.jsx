/* eslint-disable react/jsx-indent */
import React, { useState, useEffect } from 'react'
import { Card } from 'flowbite-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { fetchEventById } from '@/services/eventService'
import { formatDate } from '@/components/Format'
import { AddFile } from '@/components/agenda/forms/AddFile'
import { useSelector } from 'react-redux'
import { Icon } from '@iconify/react/dist/iconify.js'
import BasicMap from '@/components/basicMap'
import Loading from '@/components/Loading'
import Modal from '@/components/ui/Modal'

const initialPosition = {
  latitud: -28.46867672033115,
  longitud: -65.77899050151645
}

export const ShowEvento = () => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [position, setPosition] = useState(initialPosition)
  const [activeEvento, setActiveEvento] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  const { user } = useSelector((state) => state.auth)
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialPage = parseInt(queryParams.get('page')) || 1
  const [currentPage] = useState(initialPage)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const getEvent = async () => {
    setIsLoading(true)
    try {
      const evento = await fetchEventById(id)
      setActiveEvento(evento)
      if (typeof evento.ubicacion === 'string') {
        setPosition(JSON.parse(evento.ubicacion))
      } else {
        setPosition(evento.ubicacion)
      }
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setIsLoading(false)
    }
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

  useEffect(() => {
    getEvent()
  }, [id])

  return (
    <>
      {isLoading
        ? (
          <Loading className='mt-28 md:mt-64' />
          )
        : (
            activeEvento && (
            <>
              <Card>

                <Modal
                  title='Agregar Documentación'
                  label='Agregar documentos'
                  labelClass='bg-blue-600 hover:bg-blue-800 text-white items-center text-center py-2 px-6 rounded-lg w-60'
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  centered
                  // eslint-disable-next-line react/no-children-prop
                  children={
                    <AddFile
                      refetch={getEvent}
                      onClose={handleCloseModal}
                    />
                  }
                />

                <div className='grid grid-cols-1 md:grid-cols-12 grid-rows-4 gap-6'>
                  <div className='col-span-4 row-span-4'>
                    <Card>
                      <ul className='list space-y-8'>
                        <li className='flex space-x-3 rtl:space-x-reverse'>
                          <div className='flex-none text-2xl text-slate-600 dark:text-slate-300'>
                            <Icon icon='heroicons:clipboard-document-check' />
                          </div>
                          <div className='flex-1'>
                            <div className='uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]'>
                              ID
                            </div>
                            <span
                              className='text-base text-slate-600 dark:text-slate-50'
                            >
                              N° {activeEvento.id}
                            </span>
                          </div>
                        </li>

                        {activeEvento?.nombre_solicitante && (
                          <li className='flex space-x-3 rtl:space-x-reverse'>
                            <div className='flex-none text-2xl text-slate-600 dark:text-slate-300'>
                              <Icon icon='heroicons:user' />
                            </div>
                            <div className='flex-1'>
                              <div className='uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]'>
                                NOMBRE DEL SOLICITANTE
                              </div>
                              <span
                                className='capitalize text-base text-slate-600 dark:text-slate-50'
                              >
                                {activeEvento.nombre_solicitante || '-'}
                              </span>
                            </div>
                          </li>
                        )}

                        {activeEvento?.summary && (
                          <li className='flex space-x-3 rtl:space-x-reverse'>
                            <div className='flex-none text-2xl text-slate-600 dark:text-slate-300'>
                              <Icon icon='heroicons:clipboard' />
                            </div>
                            <div className='flex-1'>
                              <div className='uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]'>
                                NOMBRE DEL EVENTO
                              </div>
                              <span
                                className='capitalize text-base text-slate-600 dark:text-slate-50'
                              >
                                {activeEvento.summary || '-'}
                              </span>
                            </div>
                          </li>
                        )}

                        <li className='flex space-x-3 rtl:space-x-reverse'>
                          <div className='flex-none text-2xl text-slate-600 dark:text-slate-300'>
                            <Icon icon='heroicons:map-pin' />
                          </div>
                          <div className='flex-1'>
                            <div className='uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]'>
                              LOCALIZACIÓN
                            </div>
                            <span
                              className='capitalize text-base text-slate-600 dark:text-slate-50'
                            >
                              {activeEvento.location || parseUbicacion(activeEvento.ubicacion)}
                            </span>
                          </div>
                        </li>

                        {activeEvento?.email_solicitante && (
                          <li className='flex space-x-3 rtl:space-x-reverse'>
                            <div className='flex-none text-2xl text-slate-600 dark:text-slate-300'>
                              <Icon icon='heroicons:envelope' />
                            </div>
                            <div className='flex-1'>
                              <div className='uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]'>
                                EMAIL
                              </div>
                              <span
                                className='text-base text-slate-600 dark:text-slate-50'
                              >
                                {activeEvento.email_solicitante || '-'}
                              </span>
                            </div>
                          </li>
                        )}

                        {activeEvento?.telefono_solicitante && (
                          <li className='flex space-x-3 rtl:space-x-reverse'>
                            <div className='flex-none text-2xl text-slate-600 dark:text-slate-300'>
                              <Icon icon='heroicons:phone-arrow-up-right' />
                            </div>
                            <div className='flex-1'>
                              <div className='uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]'>
                                TELÉFONO
                              </div>
                              <p className='text-base text-slate-600 dark:text-slate-50'>
                                {activeEvento.telefono_solicitante || '-'}
                              </p>
                            </div>
                          </li>
                        )}

                        {activeEvento?.descripcion && (
                          <li className='flex space-x-3 rtl:space-x-reverse'>
                            <div className='flex-none text-2xl text-slate-600 dark:text-slate-300'>
                              <Icon icon='heroicons:newspaper' />
                            </div>
                            <div className='flex-1'>
                              <div className='uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]'>
                                DESCRIPCION
                              </div>
                              <span
                                className='text-base text-slate-600 dark:text-slate-50'
                              >
                                {activeEvento.descripcion || '-'}
                              </span>
                            </div>
                          </li>
                        )}

                        <li className='flex space-x-3 rtl:space-x-reverse'>
                          <div className='flex-none text-2xl text-slate-600 dark:text-slate-300'>
                            <Icon icon='heroicons:calendar-days' />
                          </div>
                          <div className='flex-1'>
                            <div className='uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]'>
                              FECHA
                            </div>
                            <div className='text-base text-slate-600 dark:text-slate-50'>
                              {formatDate(activeEvento.fecha)}
                            </div>
                          </div>
                        </li>

                        <li className='flex space-x-3 rtl:space-x-reverse'>
                          <div className='flex-none text-2xl text-slate-600 dark:text-slate-300'>
                            <Icon icon='heroicons:arrow-top-right-on-square' />
                          </div>
                          <div className='flex-1'>
                            <div className='uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]'>
                              ESTADO
                            </div>
                            <div className='text-base text-slate-600 dark:text-slate-50'>
                              {activeEvento?.estado || '-'}
                            </div>
                          </div>
                        </li>

                        <li className='flex space-x-3 rtl:space-x-reverse'>
                          <div className='flex-none text-2xl text-slate-600 dark:text-slate-300'>
                            <Icon icon='heroicons:building-storefront' />
                          </div>
                          <div className='flex-1'>
                            <div className='uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]'>
                              EJE
                            </div>
                            <span
                              className='text-base text-slate-600 dark:text-slate-50'
                            >
                              {activeEvento.categoria?.nombre || '-'}
                            </span>
                          </div>
                        </li>

                        <li className='flex space-x-3 rtl:space-x-reverse'>
                          <div className='flex-none text-2xl text-slate-600 dark:text-slate-300'>
                            <Icon icon='heroicons:map' />
                          </div>
                          <div className='flex-1'>
                            <div className='uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]'>
                              BARRIO
                            </div>
                            <div className='text-base text-slate-600 dark:text-slate-50'>
                              {activeEvento?.barrio || '-'}
                            </div>
                          </div>
                        </li>

                        <li className='flex space-x-3 rtl:space-x-reverse'>
                          <div className='flex-none text-2xl text-slate-600 dark:text-slate-300'>
                            <Icon icon='heroicons:paper-airplane' />
                          </div>
                          <div className='flex-1'>
                            <div className='uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]'>
                              SUB-BARRIO
                            </div>
                            <div className='text-base text-slate-600 dark:text-slate-50'>
                              {activeEvento?.subbarrio || '-'}
                            </div>
                          </div>
                        </li>

                        <li className='flex space-x-3 rtl:space-x-reverse'>
                          <div className='flex-none text-2xl text-slate-600 dark:text-slate-300'>
                            <Icon icon='heroicons:ellipsis-horizontal-circle' />
                          </div>
                          <div className='flex-1'>
                            <div className='uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]'>
                              CIRCUITO ELECTORAL
                            </div>
                            <div className='text-base text-slate-600 dark:text-slate-50'>
                              {activeEvento?.circuito || '-'}
                            </div>
                          </div>
                        </li>

                        {activeEvento?.detalle_planificacion && (
                          <li className='flex space-x-3 rtl:space-x-reverse'>
                            <div className='flex-none text-2xl text-slate-600 dark:text-slate-300'>
                              <Icon icon='heroicons:document-magnifying-glass' />
                            </div>
                            <div className='flex-1'>
                              <div className='uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]'>
                                DETALLE DE PLANIFICACION
                              </div>
                              <div className='text-base text-slate-600 dark:text-slate-50'>
                                {activeEvento.detalle_planificacion}
                              </div>
                            </div>
                          </li>
                        )}
                          <li className='flex space-x-3 rtl:space-x-reverse'>
                            <div className='flex-none text-2xl text-slate-600 dark:text-slate-300'>
                              <Icon icon='heroicons:hand-raised' />
                            </div>
                            <div className='flex-1'>
                              <div className='uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]'>
                                ASISTIÓ EL INTENDENTE
                              </div>
                              <div className='text-base text-slate-600 dark:text-slate-50'>
                                {activeEvento.intendente_fue ? 'Sí' : 'No'}
                              </div>
                            </div>
                          </li>
                      </ul>

                      {activeEvento.etiquetas.length > 0
                        ? <div className='w-full flex flex-wrap items-start text-sm font-medium mt-5'>
                          {activeEvento.etiquetas.map((etiqueta) => {
                            return (
                              <span key={etiqueta.id} className='bg-base-100 border text-md font-medium me-2 group font-mono p-2 rounded-lg dark:bg-purple-900 dark:text-purple-300 flex uppercase m-1'>
                                <p className='text-blue-500 font-semibold'>
                                  <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-5'>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25' />
                                  </svg>
                                </p>
                                {etiqueta.nombre}
                              </span>
                            )
                          })}
                          </div>
                        : null}
                    </Card>
                  </div>

                  <div className={`row-span-12 md:row-span-4 ${activeEvento.contactos.length === 0 ? 'col-span-8' : 'col-span-4'}`}>
                    <BasicMap
                      editPosition={position}
                      onLocationChange={() => { }}
                      isActive={activeEvento?.estado}
                      handleNeight={() => null}
                      handleCircuit={() => null}
                      handleSub={() => null}
                    />
                  </div>

                  {activeEvento.documentos.length > 0 && (
                    <div className='col-span-4  row-span-4 max-h-80 overflow-y-auto'>
                      <h1 className='text-xl font-semibold dark:text-white mb-4 md:mb-2 text-center'>
                        Documentos del Evento
                      </h1>
                      <div className='grid grid-cols-1 gap-4'>
                        {activeEvento.documentos.map((doc) => (
                          <div key={doc.id || doc.url} className='flex items-center p-4 bg-white rounded-lg shadow dark:bg-gray-700'>
                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6 text-gray-600 dark:text-gray-300 mr-4'>
                              <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z' />
                            </svg>
                            <a href={doc.url} className='text-base text-blue-600 dark:text-blue-300 hover:underline'>
                              {doc.nombre}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  {activeEvento.contactos.length > 0 && (
                    <div className='md:col-span-4 col-span-1 row-span-2 max-h-80 overflow-y-auto'>
                      <h1 className='text-xl font-semibold dark:text-white mb-4 md:mb-2 text-center'>Invitados</h1>
                      <div className='overflow-x-auto'>
                        <div className='inline-block min-w-full align-middle'>
                          <div className='overflow-hidden rounded-lg shadow-lg'>
                            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800'>
                              <thead className='bg-gray-200 dark:bg-gray-700'>
                                <tr>
                                  <th className='px-4 py-2 text-center font-medium text-gray-500 dark:text-gray-300'>Apellido y Nombre</th>
                                  <th className='px-4 py-2 text-center font-medium text-gray-500 dark:text-gray-300'>Email</th>
                                  <th className='px-4 py-2 text-center font-medium text-gray-500 dark:text-gray-300'>Teléfono</th>
                                </tr>
                              </thead>
                              <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                                {activeEvento.contactos.map((contacto) => (
                                  <tr key={contacto.id}>
                                    <td className='px-4 py-2 text-center font-medium text-gray-900 dark:text-gray-100'>{contacto.apellido} {contacto.nombre}</td>
                                    <td className='px-4 py-2 text-center font-medium text-gray-900 dark:text-gray-100'>{contacto.email}</td>
                                    <td className='px-4 py-2 text-center font-medium text-gray-900 dark:text-gray-100'>{contacto.telefono}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                  <div className='mt-4 flex justify-end items-end gap-4 '>
                    <button className='btn-danger items-center text-center py-2 px-6 rounded-lg' onClick={() => navigate(`/eventos?page=${currentPage}`)}>
                      Volver
                    </button>
                {user.rol !== 'visualizador' && (
                    <button
                      type='button'
                      onClick={handleOpenModal}
                      className='bg-blue-600 hover:bg-blue-800 text-white py-2 px-6 rounded-lg max-h-10 min-w-max'
                    >
                      Agregar Documentos
                    </button>
                )}
                  </div>
              </Card>
            </>
            )
          )}
    </>
  )
}
