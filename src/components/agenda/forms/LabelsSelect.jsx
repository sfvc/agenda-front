import Textinput from '@/components/ui/Textinput'
import { useEffect, useState } from 'react'
import { createLabels, fetchLabelsBySelect } from '@/services/labelsService'
import { toast } from 'react-toastify'
export const LabelsSelect = ({ handleLabels ,oldLabels}) => {

    const [search, setSearch] = useState('')
    const [buttonFilter, setButtonFilter] = useState(false)
    const [isEmpty, setIsEmpty] = useState(true)
    const [labels, setLabels] = useState([])
    const [etiquetas, setEtiquetas] = useState(oldLabels.length === 0? []:oldLabels)


    const onSubmit = async () => {
        setButtonFilter(true)
        try {
            await createLabels({ 'nombre': search })
            toast.success('Etiqueta creada exitosamente')
            setIsEmpty(true)
            setButtonFilter(false)
        } catch (error) {
            console.log(error)
            toast.error('Hubo un error al crear la etiqueta')
            setButtonFilter(false)
        }

    }

    useEffect(() => {
        handleLabels(etiquetas)
    }, [etiquetas])

    useEffect(() => {
        if (search.length === 0) {
            setIsEmpty(true)
        }
    }, [search])

    const searchLabels = async () => {
        try {
            const response = await fetchLabelsBySelect(search)
            if (response.length === 0) {
                toast.info('No existen etiquetas con esa busqueda,puede crearla si desea', 3000)
                setIsEmpty(false)
            } else {
                setLabels(response)

            }

        } catch (error) {
            console.log(error)
        }

    }

    const addLabels = (e) => {

        const exists = etiquetas.some((etiqueta) => etiqueta.id === e.id)
        if (!exists) {
            setEtiquetas([...etiquetas, { id: e.id, nombre: e.nombre }])
            setLabels([])
        } else {
            toast.error('La etiqueta ya esta selecionada para el evento')
            setLabels([])
        }
        setSearch("")
    }

    const deletLabel = (e) => {
        setEtiquetas((prevItems) => prevItems.filter(item => item.id !== e))
    }

    return (
        <>
            <div className='flex flex-col justify-center items-start my-5 ' >
                <div className='flex gap-5 justify-center items-end '>
                    <div>
                        <label htmlFor='etiqueta' className='form-label'>
                            Etiquetas
                        </label>
                        <input
                            name='etiqueta'
                            type='text'
                            placeholder='Escriba una etiqueta para buscar y luego seleccione'

                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                    </div>
                    <button
                        type='button'
                        onClick={searchLabels}
                        disabled={search.length === 0 ? true : false}
                        className={`${search.length === 0 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-800'} text-white py-2 px-6 rounded-lg mt-2 md:mt-0`}
                    >
                        Buscar
                    </button>
                    <button
                        type='button'
                        onClick={onSubmit}
                        disabled={isEmpty ? true : false}
                        className={`${isEmpty ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-800'} text-white py-2 px-6 rounded-lg mt-2 md:mt-0`}
                    >
                        {buttonFilter ? "Cargando..." : "Crear etiqueta"}
                    </button>
                </div>

                {labels.length > 0 ?
                    <div className='w-52 flex flex-col justify-center items-start text-sm font-medium text-gray-900 bg-white  border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white  z-100 '>
                        {labels.map((label) => {
                            return (
                                <button
                                    key={label.id}
                                    onClick={() => addLabels(label)}
                                    aria-current='true'
                                    type='button'
                                    className='px-4 py-2 w-full font-medium text-start rtl:text-right dark:text-white bg-grey-700  rounded-lg cursor-pointer z-100 hover:bg-green-500 hover:text-white dark:hover:text-green-500 dark:hover:bg-green-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 '
                                >
                                    {label.nombre}
                                </button>
                            )
                        })}
                    </div>
                    : null
                }
                {etiquetas.length > 0 ?
                    <div className='w-full flex flex-wrap items-center text-sm font-medium mt-5'>
                        {etiquetas.map((etiqueta) => {
                            return (
                                <span className="bg-base-100 border  text-md font-medium me-2 group font-mono  p-2 rounded-lg dark:bg-purple-900 dark:text-purple-300 flex uppercase">@{etiqueta.nombre}  <button className='ml-2 text-black group-hover:flex hidden dark:text-white justify-center items-center transition duration-150 ease-out hover:ease-in' onClick={() => deletLabel(etiqueta.id)}> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                </button></span>
                            )
                        })}
                        <button className='bg-red-600 hover:bg-red-800 text-white py-2 px-6 rounded-lg mt-2 md:mt-0 flex justify-around' onClick={() => setEtiquetas([])}>
                            Limpiar etiquetas <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </div>
                    : null
                }
            </div>

        </>
    )
}