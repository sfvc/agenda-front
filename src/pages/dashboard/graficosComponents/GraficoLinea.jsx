import { LineChart } from '@mui/x-charts'
import { EvolucionEventosService } from '../graficosService/EvolucionEventosService'

export const GraficoLinea = () => {
  const evolucionEventos = EvolucionEventosService()

  return (
    <div className='flex-1 min-w-0 flex justify-center'>
      <LineChart
        dataset={evolucionEventos}
        xAxis={[{ scaleType: 'band', dataKey: 'fecha', labelStyle: { fill: '#ddd' } }]}
        series={[
          {
            dataKey: 'eventos',
            label: 'Eventos por mes',
            valueFormatter: (value) => `${value}`,
            color: '#4f46e5',
            curve: 'linear',
            labelStyle: { fill: '#000', fontSize: '12px', fontWeight: 'bold' }
          }
        ]}
        height={300}
        margin={{ left: 30, right: 30, top: 50, bottom: 50 }}
        grid={{ vertical: true, horizontal: true, stroke: '#555' }}
        tooltip={{ show: true }}
        lineStyle={{ strokeWidth: 2 }}
        point={{ show: true, fill: '#4f46e5', radius: 4 }}
        animate
      />
    </div>
  )
}
