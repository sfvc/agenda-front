import { LineChart } from '@mui/x-charts'
import { EvolucionEventosService } from '../graficosService/EvolucionEventosService'
import Loading from '@/components/Loading'

const lineParams = {
  height: 500,
  margin: {
    left: 30,
    right: 30,
    top: 50,
    bottom: 50
  },
  grid: {
    vertical: true,
    horizontal: true,
    stroke: '#555'
  },
  tooltip: {
    show: true
  },
  point: {
    show: true,
    fill: '#4f46e5',
    radius: 4
  }
}

export const GraficoLinea = () => {
  const evolucionEventos = EvolucionEventosService()

  if (!evolucionEventos || evolucionEventos.length === 0) {
    return <Loading />
  }

  return (
    <div className='flex-1 min-w-0 flex justify-center'>
      <LineChart
        dataset={evolucionEventos}
        xAxis={[{ scaleType: 'band', dataKey: 'fecha', labelStyle: { fill: '#ddd' } }]}
        series={[
          {
            dataKey: 'eventos',
            label: 'Eventos por Mes',
            valueFormatter: (value) => `${value}`,
            color: '#4f46e5',
            curve: 'linear',
            labelStyle: { fill: '#000', fontSize: '12px', fontWeight: 'bold' }
          }
        ]}
        {...lineParams}
      />
    </div>
  )
}
