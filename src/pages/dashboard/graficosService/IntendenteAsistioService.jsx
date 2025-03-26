import { useEffect, useState } from 'react'
import graficosApi from '../../../api/graficosApi'

export const IntendenteAsistioService = () => {
  const [asistencia, setAsistencia] = useState([])

  useEffect(() => {
    const fetchAsistencia = async () => {
      try {
        const response = await graficosApi.get('/asistencia_intendente')
        const asistenciaData = Object.entries(response.data).map(([key, values]) => ({
          circuito: key,
          asistio: values.true,
          noAsistio: values.false
        }))
        setAsistencia(asistenciaData)
      } catch (error) {
        console.error('Error obteniendo asistencia:', error)
      }
    }

    fetchAsistencia()
  }, [])

  return asistencia
}
