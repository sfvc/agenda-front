import { useState } from 'react'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts'
import { EventosEjeService } from '../graficosService/EventosEjeService'
import { EventosCategoriaService } from '../graficosService/EventosCategoriaService'
import Loading from '@/components/Loading'

const pieParams = {
  height: 500,
  width: 500,
  slotProps: {
    legend: { hidden: true },
    tooltip: {
      trigger: 'item',
      className: 'custom-tooltip',
      sx: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        color: 'white',
        borderRadius: '8px',
        padding: '8px 12px'
      }
    }
  }
}

const getPieSize = () => {
  return window.innerWidth < 768 ? { height: 300, width: 300 } : { height: 500, width: 500 }
}

const pieColors = [
  '#e16d48', '#f9c316', '#facc15', '#22c55e', '#14b8a6', '#3b82f6',
  '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e', '#6b7280', '#10b981',
  '#fff500', '#ffa347', '#4682b4', '#32cd32', '#8a2be2', '#ff1493',
  '#ff4500', '#ff6347', '#dc143c', '#ff69b4', '#20b2aa', '#4169e1',
  '#00ced1', '#ff8c00', '#8fbc8f', '#b8860b', '#c71585', '#2e8b57',
  '#d2691e', '#ffdab9', '#708090', '#00ff7f', '#556b2f', '#ff00ff'
]

export const GraficoTorta = () => {
  const [selectedPieChart, setSelectedPieChart] = useState('categoria')
  const eventosCategoria = EventosCategoriaService()
  const [eje, setEje] = useState([])

  const valueFormatter = (item) => `${item.value}`

  const eventosCategoriaOrdenados = eventosCategoria?.length
    ? [...eventosCategoria].sort((a, b) => b.value - a.value)
    : []

  const ejeOrdenado = eje.length ? [...eje].sort((a, b) => b.value - a.value) : []
  console.log(eventosCategoriaOrdenados)

  if (!eventosCategoria || eventosCategoria.length === 0) {
    return <Loading />
  }

  return (
    <div className='flex-1 min-w-0 flex flex-col items-center'>
      <div className='flex gap-4 mb-4'>
        <button
          onClick={() => setSelectedPieChart('categoria')}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${selectedPieChart === 'categoria'
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-red-300'
            }`}
        >
          Eventos por Eje
        </button>
        <button
          onClick={() => setSelectedPieChart('mes')}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${selectedPieChart === 'mes'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-purple-300'
            }`}
        >
          Eventos por Mes y Año
        </button>
      </div>

      {selectedPieChart === 'categoria' && (
        <div className='flex flex-wrap justify-center items-center'>
          <div className='relative'>
            <PieChart
              series={[
                {
                  data: eventosCategoriaOrdenados,
                  highlightScope: { fade: 'global', highlight: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  valueFormatter
                }
              ]}
              colors={pieColors}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  display: 'none'
                }
              }}
              {...pieParams}
              {...getPieSize()}
            />
          </div>

          <div className='ml-6'>
            <ul className='space-y-2'>
              {eventosCategoriaOrdenados.map((item, index) => (
                <li key={index} className='flex items-center'>
                  <span
                    className='w-4 h-4 rounded-full inline-block mr-2'
                    style={{ backgroundColor: pieColors[index] || '#ccc' }}
                  />
                  {item.label} ({item.value})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {selectedPieChart === 'mes' && (
        <div>
          <div className='mb-4'>
            <EventosEjeService setEje={setEje} />
          </div>

          {eje.length === 0
            ? (
              <div className='text-center text-gray-500'>
                Consultá por fecha para traer los eventos realizados por mes y año.
              </div>
              )
            : (
              <div className='flex flex-wrap justify-center items-center'>
                <div className='relative'>
                  <PieChart
                    series={[
                      {
                        data: ejeOrdenado,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        valueFormatter
                      }
                    ]}
                    colors={pieColors}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        display: 'none'
                      }
                    }}
                    {...pieParams}
                    {...getPieSize()}
                  />
                </div>

                <div className='ml-6'>
                  <ul className='space-y-2'>
                    {ejeOrdenado.map((item, index) => (
                      <li key={index} className='flex items-center'>
                        <span
                          className='w-4 h-4 rounded-full inline-block mr-2'
                          style={{ backgroundColor: pieColors[index] || '#ccc' }}
                        />
                        {item.label} ({item.value})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              )}
        </div>
      )}
    </div>
  )
}
