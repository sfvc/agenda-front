/* eslint-disable react/no-children-prop */
import Tooltip from '@/components/ui/Tooltip'
import Modal from '@/components/ui/Modal'
import React, { useState } from 'react'

const DeleteButton = ({ evento, onDelete, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const confirmReject = async () => {
    await onDelete(evento.id)
    await refetch()
    handleCloseModal()
  }

  return (
    <>
      <Tooltip content='Eliminar' placement='top' arrow animation='shift-away'>
        <button
          className='bg-red-500 text-white p-2 rounded-lg hover:bg-red-700'
          onClick={handleOpenModal}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='icon icon-tabler icon-tabler-trash'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path stroke='none' d='M0 0h24v24H0z' fill='none' />
            <path d='M4 7l16 0' />
            <path d='M10 11l0 6' />
            <path d='M14 11l0 6' />
            <path d='M5 7l1 12.5a1 1 0 0 0 1 0.5h10a1 1 0 0 0 1 -0.5l1 -12.5' />
            <path d='M9 7l0 -3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1l0 3' />
          </svg>
        </button>
      </Tooltip>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title='Eliminar Contenido'
        labelClass='bg-red-600 hover:bg-red-800 text-white items-center text-center py-2 px-6 rounded-lg'
        centered
        children={
          <div className='text-center'>
            <p>¿Estás seguro de que deseas eliminar este contenido?</p>
            <div className='flex justify-end mt-4'>
              <button
                className='bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg mr-2'
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
              <button
                className='bg-green-500 hover:bg-green-700 text-white p-2 rounded-lg'
                onClick={confirmReject}
              >
                Confirmar
              </button>
            </div>
          </div>
        }
      />
    </>
  )
}

export default DeleteButton
