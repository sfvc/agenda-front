import React, { lazy, useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Create, ShowEvento, Eventos, StageConsider, StagePerform } from './pages/eventos'
import { Categorias } from './pages/Categorias'
import { Contactos } from './pages/contact/Contactos'
import { CreateContactos } from './pages/contact/CreateContact'
import { Usuarios } from './pages/user/Usuarios'
import { CreateUser } from './pages/user/CreateUser'
import { renewToken } from '@/services/userService'
import Layout from './layout/Layout'
import Error from './pages/404'
import Login from './pages/auth/Login'
import Loading from '@/components/Loading'
const Dashboard = lazy(() => import('./pages/dashboard'))

function App () {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      renewToken()
        .then(() => {
          setStatus('authorized')
        })
        .catch(() => {
          setStatus('non-authorized')
          localStorage.removeItem('token')
        })
    } else {
      setStatus('non-authorized')
    }
  }, [])

  if (status === 'loading') {
    return <Loading />
  }

  return (
    <main className='App relative'>
      <Routes>
        {/* {status === 'non-authorized'
          ? (
            <>

            </>
            )
          : ( */}
        <>
          <Route path='/login' element={<Login />} />
          <Route path='/*' element={<Navigate to='/login' />} />
          <Route path='/' element={<Navigate to='/eventos' />} />
          <Route path='/*' element={<Layout />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='*' element={<Navigate to='/404' />} />

            {/* Eventos */}
            <Route path='eventos' element={<Eventos />} />
            <Route path='eventos/crear' element={<Create />} />
            <Route path='eventos/editar/:id' element={<Create />} />
            <Route path='eventos/ver/:id' element={<ShowEvento />} />
            <Route path='eventos/estado_considerar/:id' element={<StageConsider />} />
            <Route path='eventos/estado_realizar/:id' element={<StagePerform />} />
            <Route path='eventos/estado_realizado/:id' element={<StagePerform />} />

            {/* Otras páginas */}
            <Route path='categorias' element={<Categorias />} />

            {/* Contactos */}
            <Route path='contactos' element={<Contactos />} />
            <Route path='contactos/crear' element={<CreateContactos />} />
            <Route path='contactos/editar/:id' element={<CreateContactos />} />

            {/* Usuarios */}
            <Route path='usuarios' element={<Usuarios />} />
            <Route path='usuarios/crear' element={<CreateUser />} />
            <Route path='usuarios/editar/:id' element={<CreateUser />} />
          </Route>

          <Route path='/404' element={<Error />} />
        </>
        {/* )} */}
      </Routes>
    </main>
  )
}

export default App
