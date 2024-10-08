import Tooltip from '@/components/ui/Tooltip'
import React from 'react'

const RejectButton = ({ evento, onReject }) => {
  return (
    <Tooltip content='Rechazar' placement='top' arrow animation='shift-away'>
      <button
        className='bg-red-500 text-white p-2 rounded-lg hover:bg-red-700'
        onClick={() => onReject(evento.id)}
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
}

export default RejectButton
