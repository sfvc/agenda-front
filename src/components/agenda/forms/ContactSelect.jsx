import { useEffect, useState } from 'react'
import { searchContactName } from '@/services/contactService'
import { toast } from 'react-toastify'
import Loading from '@/components/Loading'
import Textinput from '@/components/ui/Textinput'
import { useForm } from 'react-hook-form'

export const ContactSelect = ({ handleContact, oldContacts }) => {
  const [isLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [contacts, setContacts] = useState(oldContacts.length === 0 ? [] : oldContacts)
  const [find, setFind] = useState([])

  const {
    register
  } = useForm()

  const searchContact = async () => {
    try {
      const response = await searchContactName(search)
      if (response.length === 0) {
        toast.warning('No existen Contactos con esa búsqueda', 3000)
      } else {
        setFind(response.items)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const addContact = (e) => {
    const exists = contacts.some((contact) => contact.id === e.id)
    if (!exists) {
      setContacts([...contacts, { id: e.id, nombre: e.nombre }])
      setFind([])
    } else {
      toast.error('La etiqueta ya esta selecionada para el evento')
      setFind([])
    }
    setSearch('')
  }

  const deletContact = (e) => {
    setContacts((prevItems) => prevItems.filter(item => item.id !== e))
  }

  useEffect(() => {
    handleContact(contacts)
  }, [contacts, handleContact])

  useEffect(() => {
    if (oldContacts && oldContacts.length > 0) {
      setContacts(oldContacts)
    }
  }, [oldContacts])

  return (
    <>

      {isLoading
        ? (<Loading className='mt-28 md:mt-64' />)
        : <div className='flex flex-col justify-center items-start my-5 '>
          <div className='flex gap-5 justify-center items-end '>
            <div>
              <label htmlFor='contactos' className='form-label'>
                Agregar Contactos
              </label>
              <Textinput
                name='contactos'
                type='text'
                register={register}
                placeholder='Escriba un contacto para buscar y luego seleccione'
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </div>
            <button
              type='button'
              onClick={searchContact}
              disabled={search.length === 0}
              className={`${search.length === 0 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-800'} text-white py-2 px-6 rounded-lg mt-2 md:mt-0`}
            >
              Buscar
            </button>

          </div>

          {find.length > 0
            ? <div className='w-52 flex flex-col justify-center items-start text-sm font-medium text-gray-900 bg-white  border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white  z-100 '>
              {find.map((find) => {
                return (
                  <button
                    key={find.id}
                    onClick={() => addContact(find)}
                    aria-current='true'
                    type='button'
                    className='px-4 py-2 w-full font-medium text-start rtl:text-right dark:text-white bg-grey-700  rounded-lg cursor-pointer z-100 hover:bg-green-500 hover:text-white dark:hover:text-green-500 dark:hover:bg-green-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 '
                  >
                    {find.nombre} {find.apellido}
                  </button>
                )
              })}
            </div>
            : null}
          {contacts.length > 0
            ? <div className='w-full flex flex-wrap items-center text-sm font-medium mt-5'>
              {contacts.map((contactos) => {
                return (
                  <span className='bg-base-100 border  text-md font-medium me-2 group font-mono  p-2 rounded-lg dark:bg-purple-900 dark:text-purple-300 flex uppercase' key={contactos.id}>
                    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='size-4'>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z' />
                    </svg> {contactos.nombre}
                    <button className='ml-2 text-black group-hover:flex hidden dark:text-white justify-center items-center transition duration-150 ease-out hover:ease-in' onClick={() => deletContact(contactos.id)}>
                      <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='size-5'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0' />
                      </svg>
                    </button>
                  </span>
                )
              })}
              <button className='bg-red-600 hover:bg-red-800 text-white py-2 px-6 rounded-lg mt-2 md:mt-0 flex justify-around gap-2' onClick={() => setContacts([])}>
                Borrar contactos
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='size-5'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0' />
                </svg>
              </button>
            </div>
            : null}
        </div>}
    </>

  )
}
