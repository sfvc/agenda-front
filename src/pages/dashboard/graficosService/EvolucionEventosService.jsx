import { useEffect, useState } from 'react'
import graficosApi from '../../../api/graficosApi'

export const EvolucionEventosService = () => {
  const [evolucionEventos, setEvolucionEventos] = useState([])

  useEffect(() => {
    const fetchEvolucionEventos = async () => {
      try {
        const response = await graficosApi.get('/evolucion_eventos')
        const evolucionData = Object.entries(response.data).map(([fecha, cantidad]) => {
          const [year, month] = fecha.split('-')
          return {
            fecha: `${month}/${year}`,
            eventos: isNaN(cantidad) ? 0 : cantidad
          }
        })
        setEvolucionEventos(evolucionData)
      } catch (error) {
        console.error('Error obteniendo evolución de eventos:', error)
      }
    }

    fetchEvolucionEventos()
  }, [])

  return evolucionEventos
}
