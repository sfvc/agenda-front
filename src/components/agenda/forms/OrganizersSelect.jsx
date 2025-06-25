/* eslint-disable react/jsx-closing-tag-location */
import { useEffect, useState } from 'react'
import { createOrganizers, fetchOrganizersBySelect } from '@/services/organizersService'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import Textinput from '@/components/ui/Textinput'

export const OrganizersSelect = ({ handleOrganizers, oldOrganizers }) => {
  const [search, setSearch] = useState('')
  const [buttonFilter, setButtonFilter] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)
  const [organizers, setOrganizers] = useState([])
  const [organizadores, setOrganizadores] = useState(oldOrganizers.length === 0 ? [] : oldOrganizers)

  const {
    register
  } = useForm()

  const onSubmit = async () => {
    setButtonFilter(true)
    try {
      await createOrganizers({ nombre: search })
      toast.success('organizador creado exitosamente')
      setIsEmpty(true)
      setButtonFilter(false)
    } catch (error) {
      toast.error('Hubo un error al crear el organizador')
      setButtonFilter(false)
    }
  }

  useEffect(() => {
    handleOrganizers(organizadores)
  }, [organizadores])

  useEffect(() => {
    if (search.length === 0) {
      setIsEmpty(true)
    }
  }, [search])

  const searchOrganizers = async () => {
    try {
      const response = await fetchOrganizersBySelect(search)
      if (response.length === 0) {
        toast.info('No existen organizadores con ese nombre, puedes crearlo si deseas', 3000)
        setIsEmpty(false)
      } else {
        setOrganizers(response)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addOrganizers = (e) => {
    const exists = organizadores.some((organizador) => organizador.id === e.id)
    if (!exists) {
      setOrganizadores([...organizadores, { id: e.id, nombre: e.nombre }])
      setOrganizers([])
    } else {
      toast.error('El organizador ya está seleccionada para el evento')
      setOrganizers([])
    }
    setSearch('')
  }

  const deletOrganizers = (e) => {
    setOrganizadores((prevItems) => prevItems.filter(item => item.id !== e))
  }

  return (
    <>
      <div className='flex flex-col justify-center items-start my-5 '>
        <div className='flex gap-5 justify-center items-end '>
          <div>
            <label htmlFor='organizador' className='form-label'>
              Organizadores
              <strong className='obligatorio'>(*)</strong>
            </label>
            <Textinput
              name='organizador'
              type='text'
              register={register}
              placeholder='Buscar organizador y seleccionarlo'
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </div>
          <button
            type='button'
            onClick={searchOrganizers}
            disabled={search.length === 0}
            className={`${search.length === 0 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-800'} text-white py-2 px-6 rounded-lg mt-2 md:mt-0`}
          >
            Buscar
          </button>
          <button
            type='button'
            onClick={onSubmit}
            disabled={!!isEmpty}
            className={`${isEmpty ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-800'} text-white py-2 px-6 rounded-lg mt-2 md:mt-0`}
          >
            {buttonFilter
              ? (
                  'Cargando...'
                )
              : (
                <>
                  <span className='block md:hidden'>Crear</span>
                  <span className='hidden md:block'>Crear Organizador</span>
                </>
                )}
          </button>
        </div>

        {organizers.length > 0
          ? <div className='w-52 flex flex-col justify-center items-start text-sm font-medium text-gray-900 bg-white  border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white  z-100 '>
            {organizers.map((label) => {
              return (
                <button
                  key={label.id}
                  onClick={() => addOrganizers(label)}
                  aria-current='true'
                  type='button'
                  className='px-4 py-2 w-full font-medium text-start rtl:text-right dark:text-white bg-grey-700  rounded-lg cursor-pointer z-100 hover:bg-green-500 hover:text-white dark:hover:text-green-500 dark:hover:bg-green-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 '
                >
                  {label.nombre}
                </button>
              )
            })}
          </div>
          : null}
        {organizadores.length > 0
          ? <div className='w-full flex flex-wrap items-center text-sm font-medium mt-5'>
            {organizadores.map((organizador) => {
              return (
                <span className='bg-base-100 border  text-md font-medium me-2 group font-mono  p-2 rounded-lg dark:bg-blue-900 dark:text-blue-300 flex uppercase' key={organizador.id}>{organizador.nombre}
                  <button className='ml-2 text-black dark:text-white justify-center items-center transition duration-150 ease-out' onClick={() => deletOrganizers(organizador.id)}>
                    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='size-5 text-red-500'>
                      <path strokeLinecap='round' strokeLinejoin='round' d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0' />
                    </svg>
                  </button>
                </span>
              )
            })}
            <button className='bg-red-600 hover:bg-red-800 text-white py-2 px-6 rounded-lg mt-2 md:mt-0 flex justify-around' onClick={() => setOrganizadores([])}>
              Limpiar Organizadores
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='size-5'>
                <path strokeLinecap='round' strokeLinejoin='round' d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0' />
              </svg>
            </button>
          </div>
          : null}
      </div>

    </>
  )
}
