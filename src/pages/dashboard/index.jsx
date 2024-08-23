import React from 'react'
import Card from '@/components/ui/Card'

const Dashboard = () => {
  return (
    <>
      <div>
        <Card title='Agenda'>
          <div className='flex justify-between'>
            <p className='text-lg mx-0 my-auto hidden md:flex'>Dashboard</p>
          </div>
        </Card>
      </div>
    </>
  )
}

export default Dashboard
