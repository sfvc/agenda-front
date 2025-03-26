import React, { useState } from 'react'
import graficosApi from '../../../api/graficosApi'

export const EventosEjeService = ({ setEje }) => {
  const [year, setYear] = useState()
  const [mes, setMes] = useState()

  // Función para validar el rango de fecha
  const isValidYearAndMonth = (year, month) => {
    if (year < 2024 || year > 2025) {
      return false
    }
    if (year === 2024 && month < 10) {
      return false
    }
    if (year === 2025 && month > 12) {
      return false
    }
    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isValidYearAndMonth(year, mes)) {
      alert('Por favor, ingrese un rango de fecha válido (desde agosto 2024 hasta diciembre 2025).')
      return
    }

    try {
      const response = await graficosApi.get(`/visitas_por_eje?year=${year}&mes=${mes}`)

      const dataFormatted = Object.entries(response.data).map(([key, value], index) => ({
        id: index,
        label: key.trim(),
        value
      }))

      setEje(dataFormatted)
    } catch (error) {
      console.error('Error obteniendo datos de visitas por eje:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex gap-4 justify-center'>
      <input
        type='number'
        value={mes}
        className='text-black p-2 border rounded'
        onChange={(e) => setMes(e.target.value)}
        placeholder='Mes'
        min='1' max='12'
      />
      <input
        type='number'
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder='Año'
        className='text-black p-2 border rounded'
        min='2024'
        max='2025'
      />
      <button type='submit' className='btn bg-blue-500 text-white hover:bg-blue-600'>
        Consultar
      </button>
    </form>
  )
}
