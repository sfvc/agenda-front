import Card from '@/components/ui/Card'
import React, { useState } from 'react'
import Loading from '@/components/Loading'
import columnContact from '@/json/columnsContact.json'

import { set, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { nextStageEvent } from '@/services/eventService'
import { searchContact } from '@/services/contactService'
import { toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import { getContacts } from '@/services/contactService'


export const StagePerform = () => {

    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [contacts, setContact] = useState([])
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

    const onSearch = () => {
        console.log(search)
    }
    const handleChange = async (e) => {
        setSearch(e.target.value)

        if (search.length > 2) {

            const res = await searchContact(search)

            setContact(res.items)
            console.log(contacts);
        }
        else {
            setContact([])
        }
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

                        <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="search" onChange={handleChange} id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ingrese el nombre del invitado" value={search} />
                            <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                        </div>

                        {<div class="w-1/2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            {contacts.map((contact) => {
                                return (
                                    <button
                                        aria-current="true"
                                        key={contact.id}
                                        type="button"
                                        className="w-full px-4 py-2 font-medium text-left rtl:text-right text-white bg-blue-700 border-b border-gray-200 rounded-t-lg cursor-pointer focus:outline-none dark:bg-gray-800 dark:border-gray-600"
                                    >
                                        {contact.nombre} {contact.apellido} | {contact.email}
                                    </button>
                                );
                            })}



                        </div>}


                        {/* <Card noborder>
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

                                       

                                        </div>
                                    </div>
                                </div>
                            </div>


                        </Card> */}


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