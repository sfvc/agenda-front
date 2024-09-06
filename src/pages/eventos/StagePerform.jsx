import Card from '@/components/ui/Card'
import React, { useState } from 'react'
import Loading from '@/components/Loading'
import columnContact from '@/json/columnsContact.json'
import Textinput from '@/components/ui/Textinput'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { nextStageEvent } from '@/services/eventService'
import Button from '@/components/ui/Button'
import { toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import { getContacts } from '@/services/contactService'

export const StagePerform = () => {

    const navigate = useNavigate()

    // const [, setFormData] = useState(initialForm)
    const { id } = useParams()
    const [currentPage, setCurrentPage] = useState(1)
    const { data: contactos, isLoading } = useQuery({
        queryKey: ['contactos', currentPage],
        queryFn: () => getContacts(currentPage),
        keepPreviousData: true
    })
    if (isLoading) {
        return <Loading />
    }
    return (

        <>
            {
                isLoading ? <Loading className='mt-28 md:mt-64' /> : (
                    <>
                        <Card>
                            <div className='mb-4 md:flex md:justify-between'>
                                <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Pasar evento a Realizar</h1>
                            </div>
                        </Card>

                        <Card noborder>
                            <div className='w-1/2'>
                                <p className='uppercase'>Selecione los invitados</p>
                                <div className='overflow-x-auto -mx-6'>
                                    <div className='inline-block min-w-full align-middle'>
                                        <div className='overflow-hidden '>
                                            <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                                <thead className='bg-slate-200 dark:bg-slate-700'>
                                                    <tr>
                                                        {columnContact.map((column, i) => (
                                                            <th key={i} scope='col' className='table-th'>
                                                                {column.label}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className='bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700'>
                                                    {
                                                        (contactos.items.length > 0)
                                                            ? (contactos.items.map((contacto) => {
                                                                return (
                                                                    <tr key={contacto.id}>
                                                                        <td className='table-td'>{contacto.apellido} {contacto.nombre}</td>

                                                                        <td className='table-td'>{contacto.email}</td>
                                                                        <td className='table-td'>{contacto.telefono}</td>
                                                                        <td className='table-td'>
                                                                        <input type="checkbox"/> Agregar
                                                                        </td>

                                                                    </tr>
                                                                )
                                                            }))
                                                            : (<tr><td colSpan='10' className='text-center py-2 dark:bg-gray-800'>No se encontraron resultados</td></tr>)
                                                    }
                                                </tbody>

                                            </table>

                                            {/* Paginado */}
                                            {/* <div className='flex justify-center mt-8'>
                                            <Pagination
                                                paginate={{
                                                    current: contactos.current,
                                                    totalPages: contactos.totalPages
                                                }}
                                                onPageChange={(page) => setCurrentPage(page)}
                                                text
                                            />
                                        </div> */}

                                        </div>
                                    </div>
                                </div>
                            </div>


                        </Card>


                        <div className='flex justify-end gap-4 mt-8'>
                            <div className='ltr:text-right rtl:text-left'>
                                <button
                                    className='btn-danger items-center text-center py-2 px-6 rounded-lg'
                                    onClick={() => navigate('/eventos')}
                                >
                                    Volver
                                </button>
                            </div>
                            <div className='ltr:text-right rtl:text-left'>
                                {/* <Button
                                        type='submit'
                                        text={isSubmitting ? 'Guardando' : 'Guardar'}
                                        className={`bg-green-500 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700'} text-white items-center text-center py-2 px-6 rounded-lg`}
                                        disabled={isSubmitting}
                                        onClick={handleSubmit(onSubmit)}
                                    /> */}
                            </div>
                        </div>
                    </>
                )
            }

        </>
    )
}