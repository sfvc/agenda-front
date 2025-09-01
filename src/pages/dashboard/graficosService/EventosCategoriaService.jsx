import { useState, useEffect } from 'react'
import graficosApi from '../../../api/graficosApi'

export const EventosCategoriaService = () => {
  const [torta, setTorta] = useState([])

  useEffect(() => {
    const fetchTorta = async () => {
      try {
        const response = await graficosApi.get('/eventos_por_organizador')
        const dataFormatted = Object.entries(response.data).map(([key, value], index) => ({
          id: index,
          label: key.trim(),
          value
        }))
        setTorta(dataFormatted)
      } catch (error) {
        console.error('Error obteniendo categorías:', error)
      }
    }

    fetchTorta()
  }, [])

  return torta
}
