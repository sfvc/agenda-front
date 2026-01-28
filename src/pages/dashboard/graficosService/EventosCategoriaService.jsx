import { useState, useEffect } from 'react'
import graficosApi from '../../../api/graficosApi'

export const EventosCategoriaService = () => {
  const [torta, setTorta] = useState([])

  useEffect(() => {
    const fetchTorta = async () => {
      try {
        const response = await graficosApi.get('/eventos_por_organizador')

        // 👇 SOLO data, NO metadata
        const rawData = response.data?.data ?? {}

        const dataFormatted = Object.entries(rawData).map(([key, value], index) => ({
          id: index,
          label: key,
          value: Number(value)
        }))

        setTorta(dataFormatted)
      } catch (error) {
        console.error('Error obteniendo categorías:', error)
        setTorta([])
      }
    }

    fetchTorta()
  }, [])

  return torta
}
