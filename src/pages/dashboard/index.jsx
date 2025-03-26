import React, { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import EstadisticasDashboard from './EstadisticasDashboard'
import GraficosDashboard from './GraficosDashboard'
import { fetchStats } from '../../services/eventService'

const Dashboard = () => {
  const [estadisticas, setEstadisticas] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const responseEventos = await fetchStats()
      setEstadisticas(responseEventos)
    }

    fetchData()
  }, [])

  return (
    <>
      <div>
        <Card title='Agenda'>
          <div className='flex justify-between'>
            <p className='text-lg mx-0 my-auto hidden md:flex'>Dashboard</p>
          </div>
        </Card>
        <div className='mt-4 grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-4'>
          <EstadisticasDashboard
            estadisticas={estadisticas}
          />
        </div>
        <GraficosDashboard />
      </div>
    </>
  )
}

export default Dashboard
