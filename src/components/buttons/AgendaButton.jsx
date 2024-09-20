import React from 'react'
import Tooltip from '@/components/ui/Tooltip'

const AgendaButton = ({ evento, onDelete }) => {
  if (!evento) {
    return null
  }

  const renderButton = () => {
    switch (evento.estado) {
      case 'PENDIENTE':
        return (
          <Tooltip content='A Considerar' placement='top' arrow animation='shift-away'>
            <button
              className='bg-warning-500 text-white p-2 rounded-lg hover:bg-warning-700'
              onClick={() => onDelete(evento.id)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='icon icon-tabler icon-tabler-check'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                strokeWidth='2'
                stroke='currentColor'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                <path d='M5 12l5 5l10 -10' />
              </svg>
            </button>
          </Tooltip>
        )
      case 'A_CONSIDERAR':
        return (
          <Tooltip content='A realizar' placement='top' arrow animation='shift-away'>
            <button
              className='bg-green-500 text-white p-2 rounded-lg hover:bg-green-700'
              onClick={() => onDelete(evento.id)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='icon icon-tabler icon-tabler-arrow-back-up'
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
                <path d='M9 14l-4 -4l4 -4' />
                <path d='M5 10h11a4 4 0 1 1 0 8h-1' />
              </svg>
            </button>
          </Tooltip>
        )
      case 'A_REALIZAR':
        return (
          <Tooltip content='A considerar' placement='top' arrow animation='shift-away'>
            <button
              className='bg-danger-500 text-white p-2 rounded-lg hover:bg-danger-700'
              onClick={() => onDelete(evento.id)}
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
        )
      case 'REALIZADO': // Nuevo estado agregado
        return (
          <Tooltip content='Evento realizado' placement='top' arrow animation='shift-away'>
            <button
              className='bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700'
              onClick={() => onDelete(evento.id)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='icon icon-tabler icon-tabler-checklist'
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
                <path d='M9 6l2 2l4 -4' />
                <path d='M9 12l2 2l4 -4' />
                <path d='M4 6h3' />
                <path d='M4 12h3' />
                <path d='M4 18h16' />
              </svg>
            </button>
          </Tooltip>
        )
    }
  }

  return <>{renderButton()}</>
}

export default AgendaButton
