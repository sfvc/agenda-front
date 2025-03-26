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
          className='px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-700'
          onClick={() => setMostrarGrafico('intendente')}
        >
          Asistencia del Intendente
        </button>
        <button
          className='px-4 py-2 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-700'
          onClick={() => setMostrarGrafico('eventos')}
        >
          Eventos por Barrio
        </button>
      </div>

      {mostrarGrafico === 'intendente' && (
        <div className='overflow-x-auto'>
          <h3 className='text-lg font-semibold mb-4'>Asistencia del Intendente</h3>
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
          <h3 className='text-lg font-semibold mb-4'>Eventos en Distintos Barrios</h3>
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
