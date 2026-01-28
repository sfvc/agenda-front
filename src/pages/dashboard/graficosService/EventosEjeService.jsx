import React, { useState } from 'react'
import graficosApi from '../../../api/graficosApi'

export const EventosEjeService = ({ setEje }) => {
  const [year, setYear] = useState('')
  const [mes, setMes] = useState('')

  const isValidYearAndMonth = (year, month) => {
    const y = Number(year)
    const m = Number(month)

    if (y < 2024 || y > 2026) return false
    if (y === 2024 && m < 10) return false
    if (y === 2026 && m > 12) return false
    return m >= 1 && m <= 12
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isValidYearAndMonth(year, mes)) {
      alert('Por favor, ingrese un rango de fecha válido (desde octubre 2024 hasta diciembre 2026).')
      return
    }

    try {
      const response = await graficosApi.get(`/visitas_por_organizador?year=${year}&mes=${mes}`)

      // 👇 SOLO data, nunca metadata
      const rawData = response.data?.data ?? {}

      const dataFormatted = Object.entries(rawData).map(([key, value], index) => ({
        id: index,
        label: key,
        value: Number(value)
      }))

      setEje(dataFormatted)
    } catch (error) {
      console.error('Error obteniendo datos de visitas por eje:', error)
      setEje([])
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex gap-4 justify-center'>
      <input
        type='number'
        value={mes}
        onChange={(e) => setMes(e.target.value)}
        placeholder='Mes'
        min='1'
        max='12'
        className='text-black p-2 border rounded'
      />
      <input
        type='number'
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder='Año'
        min='2024'
        max='2026'
        className='text-black p-2 border rounded'
      />
      <button type='submit' className='btn bg-blue-500 text-white hover:bg-blue-600'>
        Consultar
      </button>
    </form>
  )
}
