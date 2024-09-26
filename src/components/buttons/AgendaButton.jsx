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
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='icon icon-tabler icons-tabler-outline icon-tabler-info-square'><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path d='M12 9h.01' /><path d='M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z' /><path d='M11 12h1v4h1' /></svg>
            </button>
          </Tooltip>
        )
      case 'A_CONSIDERAR':
        return (
          <Tooltip content='A realizar' placement='top' arrow animation='shift-away'>
            <button
              className='bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-700'
              onClick={() => onDelete(evento.id)}
            >
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='icon icon-tabler icons-tabler-outline icon-tabler-thumb-up'><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path d='M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3' /></svg>
            </button>
          </Tooltip>
        )
      case 'A_REALIZAR':
        return (
          <Tooltip content='Realizado' placement='top' arrow animation='shift-away'>
            <button
              className='bg-green-500 text-white p-2 rounded-lg hover:bg-green-700'
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
    }
  }

  return <>{renderButton()}</>
}

export default AgendaButton
