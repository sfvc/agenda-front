import * as React from 'react'
import { useState } from 'react'
import { Card } from 'flowbite-react'
import { GraficoTorta } from './graficosComponents/GraficoTorta'
import { GraficoBarra } from './graficosComponents/GraficoBarra'
import { GraficoLinea } from './graficosComponents/GraficoLinea'

export default function GraficosDashboard () {
  const [selectedChart, setSelectedChart] = useState('torta')

  return (
    <Card className='mt-4 p-6 shadow-lg dark:bg-gray-300 dark:text-black'>
      <div className='flex justify-center gap-4 mb-4'>
        <button onClick={() => setSelectedChart('torta')} className='btn bg-orange-500 text-white hover:bg-orange-600'>Eventos</button>
        <button onClick={() => setSelectedChart('barra')} className='btn bg-green-500 text-white hover:bg-green-600 '>Asistencia</button>
        <button onClick={() => setSelectedChart('linea')} className='btn bg-indigo-500 text-white hover:bg-indigo-600'>Cantidad</button>
      </div>

      <div className='md:flex flex-wrap gap-6 justify-center'>
        {selectedChart === 'torta' && (
          <GraficoTorta />
        )}

        {selectedChart === 'barra' && (
          <GraficoBarra />
        )}

        {selectedChart === 'linea' && (
          <GraficoLinea />
        )}
      </div>
    </Card>
  )
}
