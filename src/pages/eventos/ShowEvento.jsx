import React, { useEffect, useState } from 'react'
import { Card } from 'flowbite-react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchEventById } from '@/services'
import { formatDate } from '@/components/Format'
import BasicMap from '@/components/basicMap'
import { Icon } from '@iconify/react/dist/iconify.js'
import Loading from '@/components/Loading'

const initialPosition={
  latitud:-28.46867672033115,
  longitud:-65.77899050151645
}

export const ShowEvento = ({ isActive }) => {
  const [position, setPosition]= useState(initialPosition)
  const [activeEvento, setActiveEvento] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getEvent = async () => {
      setIsLoading(true)
      try {
        const evento = await fetchEventById(id)
        setActiveEvento(evento)
        setPosition(JSON.parse(evento.ubicacion))
      } catch (error) {
        console.error('Error fetching event:', error)
      } finally {
        setIsLoading(false)
      }
    }

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
                  <div className='grid grid-cols-12 gap-6'>
                    <div className='lg:col-span-4 col-span-12'>
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

                          <li className='flex space-x-3 rtl:space-x-reverse'>
                            <div className='flex-none text-2xl text-slate-600 dark:text-slate-300'>
                              <Icon icon='heroicons:user' />
                            </div>
                            <div className='flex-1'>
                              <div className='uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]'>
                                NOMBRE
                              </div>
                              <span
                                className='capitalize text-base text-slate-600 dark:text-slate-50'
                              >
                                {activeEvento.nombre_solicitante}
                              </span>
                            </div>
                          </li>

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
                                {activeEvento.email_solicitante}
                              </span>
                            </div>
                          </li>

                          <li className='flex space-x-3 rtl:space-x-reverse'>
                            <div className='flex-none text-2xl text-slate-600 dark:text-slate-300'>
                              <Icon icon='heroicons:phone-arrow-up-right' />
                            </div>
                            <div className='flex-1'>
                              <div className='uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]'>
                                Teléfono
                              </div>
                              <p className='text-base text-slate-600 dark:text-slate-50'>
                                {activeEvento.telefono_solicitante}
                              </p>
                            </div>
                          </li>

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
                                CATEGORIA
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
                              <Icon icon='heroicons:information-circle' />
                            </div>
                            <div className='flex-1'>
                              <div className='uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]'>
                                DETALLE DE PLANIFICACION
                              </div>
                              <span
                                className='text-base text-slate-600 dark:text-slate-50'
                              >
                                {activeEvento.detalle_planificacion || '-'}
                              </span>
                            </div>
                          </li>
                        </ul>
                      </Card>
                    </div>

                    <div className='lg:col-span-8 col-span-12'>
                      <BasicMap
                        editPosition={position}
                        onLocationChange={() => {}}
                        isActive={activeEvento?.estado}
                      />
                    </div>
                  </div>

                  <div className='mt-4 flex justify-end gap-4'>
                    <button className='btn-danger items-center text-center py-2 px-6 rounded-lg' onClick={() => navigate('/eventos')}>
                      Volver
                    </button>
                  </div>
                </Card>
              </>
            )
          )}
    </>
  )
}
