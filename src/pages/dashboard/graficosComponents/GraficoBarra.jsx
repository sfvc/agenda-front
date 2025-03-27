import { useState } from 'react'
import { BarChart } from '@mui/x-charts'
import { IntendenteAsistioService } from '../graficosService/IntendenteAsistioService'
import { EventosBarrioService } from '../graficosService/EventosBarrioService'

const barParams = {
  height: 500,
  width: 1000,
  grid: {
    vertical: true,
    horizontal: true,
    stroke: '#555'
  }
}

export const GraficoBarra = () => {
  const [mostrarGrafico, setMostrarGrafico] = useState(null)
  const asistenciaIntendente = IntendenteAsistioService()
  const eventosBarrio = EventosBarrioService()

  return (
    <div className='text-center'>
      <div className='flex justify-center gap-4 mb-6'>
        <button
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            mostrarGrafico === 'intendente'
              ? 'bg-cyan-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-cyan-300'
          }`}
          onClick={() => setMostrarGrafico('intendente')}
        >
          Asistencia del Intendente por Circuito
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            mostrarGrafico === 'eventos'
              ? 'bg-fuchsia-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-fuchsia-300'
          }`}
          onClick={() => setMostrarGrafico('eventos')}
        >
          Eventos por Barrio
        </button>
      </div>

      {mostrarGrafico === 'intendente' && (
        <div className='overflow-x-auto'>
          <h3 className='text-lg font-semibold mb-4 text-black'>Asistencia del Intendente por Circuito</h3>
          <BarChart
            dataset={asistenciaIntendente}
            xAxis={[{ scaleType: 'band', dataKey: 'circuito', labelStyle: { fill: '#ddd' } }]}
            series={[
              {
                dataKey: 'asistio',
                label: 'Asistió',
                valueFormatter: (value) => `${value}`,
                color: '#4CAF50'
              },
              {
                dataKey: 'noAsistio',
                label: 'No Asistió',
                valueFormatter: (value) => `${value}`,
                color: '#E53935'
              }
            ]}
            layout='vertical'
            {...barParams}
          />
        </div>
      )}

      {mostrarGrafico === 'eventos' && (
        <div className='overflow-x-auto'>
          <h3 className='text-lg font-semibold mb-4 text-black'>Eventos por Barrio</h3>
          <BarChart
            dataset={eventosBarrio}
            yAxis={[{ scaleType: 'band', dataKey: 'barrio', labelStyle: { fill: '#ddd' } }]}
            margin={{ left: 200 }}
            series={[
              {
                dataKey: 'eventos',
                label: 'Eventos',
                valueFormatter: (value) => `${value}`,
                color: '#3B82F6'
              }
            ]}
            layout='horizontal'
            {...barParams}
          />
        </div>
      )}
    </div>
  )
}
