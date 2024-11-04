import React, { useMemo, useEffect, useState } from 'react'
import Icon from '@/components/ui/Icon'
import { getEventos } from '../../services/eventService'

const estados = [
  { id: 'PENDIENTE', nombre: 'Pendiente', bg: 'bg-cyan-500', text: 'text-cyan-500', icon: 'heroicons-solid:clock' },
  { id: 'A_CONSIDERAR', nombre: 'A Considerar', bg: 'bg-warning-500', text: 'text-yellow-500', icon: 'heroicons-solid:question-mark-circle' },
  { id: 'A_REALIZAR', nombre: 'A Realizar', bg: 'bg-indigo-500', text: 'text-indigo-500', icon: 'heroicons-solid:megaphone' },
  { id: 'REALIZADO', nombre: 'Realizado', bg: 'bg-green-500', text: 'text-green-500', icon: 'heroicons-solid:check' },
  { id: 'RECHAZADO', nombre: 'Rechazado', bg: 'bg-red-500', text: 'text-red-500', icon: 'heroicons-solid:x' }
]

const EstadisticasDashboard = ({ estadisticas }) => {
  const [, setEventosActivos] = useState(0)

  // Asignar directamente el objeto estadisticas al objeto totalsByEstado
  const totalsByEstado = useMemo(() => ({
    totales: Object.values(estadisticas).reduce((acc, val) => acc + val, 0), // Suma total de eventos
    ...estadisticas
  }), [estadisticas])

  useEffect(() => {
    const fetchActiveEvents = async () => {
      const response = await getEventos()
      setEventosActivos(response.total)
    }

    fetchActiveEvents()
  }, [])

  const statistics = [
    {
      title: 'Eventos Totales',
      count: totalsByEstado.totales || 0,
      bg: 'bg-info-500',
      text: 'text-info-500',
      icon: 'heroicons-solid:calendar-days'
    },
    ...estados.map(estado => ({
      title: `Eventos ${estado.nombre}`,
      count: totalsByEstado[estado.id] || 0,
      bg: estado.bg,
      text: estado.text,
      icon: estado.icon
    }))
  ]

  return (
    <>
      {statistics.map((item, i) => (
        <div
          key={i}
          className={`${item.bg} rounded-md p-4 bg-opacity-[0.15] dark:bg-opacity-50 text-center`}
        >
          <div
            className={`${item.text} mx-auto h-10 w-10 flex flex-col items-center justify-center rounded-full bg-white text-2xl mb-4`}
          >
            <Icon icon={item.icon} />
          </div>
          <span className='block text-sm text-slate-600 font-medium dark:text-white mb-1'>
            {item.title}
          </span>
          <span className='block mb- text-2xl text-slate-900 dark:text-white font-medium'>
            {item.count}
          </span>
        </div>
      ))}
    </>
  )
}

export default EstadisticasDashboard
