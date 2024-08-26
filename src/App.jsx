import React, { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Create, ShowEvento, Eventos } from './pages/eventos'
import { Categorias } from './pages/Categorias'
import Layout from './layout/Layout'
import Error from './pages/404'
const Dashboard = lazy(() => import('./pages/dashboard'))

function App () {
  return (
    <main className='App relative'>
      <Routes>
        {
           (
             <>
               <Route path='/' element={<Navigate to='/eventos' />} />

               <Route path='/*' element={<Layout />}>
                 <Route path='dashboard' element={<Dashboard />} />
                 <Route path='*' element={<Navigate to='/404' />} />

                 {/* Eventos */}
                 <Route path='eventos' element={<Eventos />} />
                 <Route path='eventos/crear' element={<Create />} />
                 <Route path='eventos/editar/:id' element={<Create />} />
                 <Route path='eventos/ver/:id' element={<ShowEvento />} />

                 {/* Otras paginas */}
                 <Route path='categorias' element={<Categorias />} />
               </Route>

               <Route path='/404' element={<Error />} />
             </>
              )
        }
      </Routes>
    </main>
  )
}

export default App
