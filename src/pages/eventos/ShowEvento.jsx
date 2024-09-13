import React, { useEffect, useState } from 'react'
import { Card } from 'flowbite-react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchEventById } from '@/services'
import { formatDate } from '@/components/Format'
import BasicMap from '@/components/basicMap'
import { Icon } from '@iconify/react/dist/iconify.js'
import Loading from '@/components/Loading'
import Modal from '@/components/ui/Modal'
import { AddFile } from '@/components/agenda/forms/addFile'
import { useForm } from 'react-hook-form'
const initialPosition = {
  latitud: -28.46867672033115,
  longitud: -65.77899050151645
}

export const ShowEvento = ({ isActive }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [position, setPosition] = useState(initialPosition)
  const [activeEvento, setActiveEvento] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const {
    formState: { isSubmitting }
} = useForm()

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

  const onClose = () => {
    setIsModalOpen(false)
  }
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
                  show={isModalOpen}
                  onClose={onClose}
                  centered
                  children={<AddFile onClose={onClose} isSubmitting={isSubmitting} />}
                />
                <div className='grid grid-cols-12 grid-rows-3 gap-6'>
                  <div className='md:col-span-4 col-span-12 row-span-3'>
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

                  <div className={`  row-span-3 ${activeEvento.contactos.length === 0 ? 'col-span-8' : 'col-span-4'}`} >
                    <BasicMap
                      editPosition={position}
                      onLocationChange={() => { }}
                      isActive={activeEvento?.estado}
                    />
                  </div>
                  {
                    activeEvento.documentos.length > 0 ?
                      (<div className='lg:col-span-4 col-span-4 row-span-2'>
                        <h1 className='text-xl font-semibold dark:text-white mb-4 md:mb-2'>Documentos del Evento</h1>
                        <div className='grid grid-cols-1 gap-4'>
                          {activeEvento.documentos.map((doc) => (
                            <div key={doc.id || doc.url} className="flex items-center p-4 bg-white rounded-lg shadow dark:bg-gray-700">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600 dark:text-gray-300 mr-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                              </svg>
                              <a href={doc.url} className='text-base text-blue-600 dark:text-blue-300 hover:underline'>
                                {doc.nombre}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>) : (<></>)
                  }
                  <div className='lg:col-span-4 col-span-4 row-span-2'>
                    <h1 className='text-xl font-semibold dark:text-white mb-4 md:mb-2 text-center'>Invitados</h1>
                    <div className='overflow-x-auto'>
                      <div className='inline-block min-w-full align-middle'>
                        <div className='overflow-hidden rounded-lg shadow-lg'>
                          <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800'>
                            <thead className='bg-gray-200 dark:bg-gray-700'>
                              <tr>
                                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300'>Apellido y nombre</th>
                                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300'>Correo Electronico</th>
                              </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700'>
                              {activeEvento.contactos.length > 0 ? (
                                activeEvento.contactos.map((contacto) => (
                                  <tr key={contacto.id}>
                                    <td className='px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-300 uppercase'>{contacto.apellido} {contacto.nombre}</td>
                                    <td className='px-4 py-2 text-sm text-gray-900 dark:text-gray-300'>{contacto.email}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan='2' className='px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-300'>No se encontraron resultados</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
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
