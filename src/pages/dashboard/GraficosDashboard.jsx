import * as React from 'react'
import { BarChart, LineChart, PieChart, pieArcLabelClasses } from '@mui/x-charts'
import { Card } from 'flowbite-react'

export default function GraficosDashboard ({ graficos }) {
  const [selectedChart, setSelectedChart] = React.useState('torta')

  const desktopOS = [
    { id: 0, value: 40, label: 'Windows' },
    { id: 1, value: 25, label: 'macOS' },
    { id: 2, value: 15, label: 'Linux' },
    { id: 3, value: 10, label: 'ChromeOS' },
    { id: 4, value: 10, label: 'Others' }
  ]

  const valueFormatter = (item) => `${item.value}`

  const dataset = [
    { x: 'Enero', y: 10 },
    { x: 'Febrero', y: 25 },
    { x: 'Marzo', y: 18 },
    { x: 'Abril', y: 30 },
    { x: 'Mayo', y: 22 },
    { x: 'Junio', y: 27 },
    { x: 'Julio', y: 35 },
    { x: 'Agosto', y: 40 },
    { x: 'Septiembre', y: 28 },
    { x: 'Octubre', y: 33 },
    { x: 'Noviembre', y: 24 },
    { x: 'Diciembre', y: 31 }
  ]

  const colors = [
    '#e11d48', '#f97316', '#facc15', '#22c55e', '#14b8a6', '#3b82f6',
    '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e', '#6b7280', '#10b981'
  ]

  const barDataSeoul = [
    { month: 'Enero', seoul: 80 },
    { month: 'Febrero', seoul: 120 },
    { month: 'Marzo', seoul: 95 },
    { month: 'Abril', seoul: 130 },
    { month: 'Mayo', seoul: 100 }
  ]

  const barDataCatamarca = [
    { month: 'Enero', catamarca: 40 },
    { month: 'Febrero', catamarca: 90 },
    { month: 'Marzo', catamarca: 70 },
    { month: 'Abril', catamarca: 110 },
    { month: 'Mayo', catamarca: 85 }
  ]

  return (
    <Card className='mt-4 p-6 shadow-lg dark:bg-gray-900 dark:text-gray-300'>
      <div className='flex justify-center gap-4 mb-4'>
        <button onClick={() => setSelectedChart('torta')} className='btn bg-blue-500 text-white hover:bg-blue-600'>Gráfico de Torta</button>
        <button onClick={() => setSelectedChart('barra')} className='btn bg-indigo-500 text-white hover:bg-indigo-600'>Gráfico de Barra</button>
        <button onClick={() => setSelectedChart('linea')} className='btn bg-green-500 text-white hover:bg-green-600'>Gráfico de Línea</button>
      </div>

      <div className='md:flex flex-wrap gap-6 justify-center'>
        {selectedChart === 'torta' && (
          <div className='flex-1 min-w-0 flex justify-center'>
            <PieChart
              series={[
                {
                  data: desktopOS,
                  highlightScope: { fade: 'global', highlight: 'item' },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: 'gray'
                  },
                  valueFormatter,
                  arcLabel: (item) => `${item.value}`
                }
              ]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fontWeight: 'bold',
                  fontSize: '16px',
                  fill: '#fff'
                }
              }}
              width={400}
              height={250}
              animate
            />
          </div>
        )}

        {/* Mostrar gráficos de barra */}
        {selectedChart === 'barra' && (
          <>
            <div className='overflow-x-auto'>
              <BarChart
                dataset={barDataSeoul}
                yAxis={[{ scaleType: 'band', dataKey: 'month', labelStyle: { fill: '#ddd' } }]}
                series={[
                  {
                    dataKey: 'seoul',
                    label: 'Lluvias en Seúl',
                    valueFormatter: (value) => `${value} mm`,
                    color: colors[0]
                  }
                ]}
                layout='horizontal'
                width={600}
                height={300}
                grid={{ vertical: false, horizontal: true, stroke: '#555' }}
              />
            </div>

            <div className='overflow-x-auto'>
              <BarChart
                dataset={barDataCatamarca}
                yAxis={[{ scaleType: 'band', dataKey: 'month', labelStyle: { fill: '#ddd' } }]}
                series={[
                  {
                    dataKey: 'catamarca',
                    label: 'Lluvias en Catamarca',
                    valueFormatter: (value) => `${value} mm`,
                    color: colors[1]
                  }
                ]}
                layout='horizontal'
                width={600}
                height={300}
                grid={{ vertical: false, horizontal: true, stroke: '#555' }}
              />
            </div>
          </>
        )}

        {/* Mostrar gráfico de línea */}
        {selectedChart === 'linea' && (
          <div className='flex-1 min-w-0 flex justify-center'>
            <LineChart
              dataset={dataset}
              series={[{ dataKey: 'y', color: '#4f46e5', curve: 'linear' }]}
              height={300}
              margin={{ left: 30, right: 30, top: 30, bottom: 50 }}
              grid={{ vertical: true, horizontal: true, stroke: '#555' }}
              tooltip={{ show: true }}
              lineStyle={{ strokeWidth: 2 }}
              point={{ show: true, fill: '#4f46e5', radius: 4 }}
              animate
            />
          </div>
        )}
      </div>
    </Card>
  )
}
