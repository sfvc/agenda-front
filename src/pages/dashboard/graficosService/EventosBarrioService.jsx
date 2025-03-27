import { useEffect, useState } from 'react'
import graficosApi from '../../../api/graficosApi'

export const EventosBarrioService = () => {
  const [eventosBarrio, setEventosBarrio] = useState([])

  useEffect(() => {
    const fetchEventosPorBarrio = async () => {
      try {
        const response = await graficosApi.get('/eventos_por_barrio')
        const eventosData = Object.entries(response.data).map(([barrio, valores]) => ({
          barrio,
          asistio: valores.true || 0,
          noAsistio: valores.false || 0
        }))
        setEventosBarrio(eventosData)
      } catch (error) {
        console.error('Error obteniendo eventos por barrio:', error)
      }
    }

    fetchEventosPorBarrio()
  }, [])

  return eventosBarrio
}
