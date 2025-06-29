import React, { lazy, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Create, ShowEvento, Eventos, StageConsider, StagePerform } from './pages/eventos'
import { Categorias } from './pages/Categorias'
import { Contactos } from './pages/contact/Contactos'
import { CreateContactos } from './pages/contact/CreateContact'
import { Usuarios } from './pages/user/Usuarios'
import { Groups } from './pages/groups/Groups'
import { CreateGroup } from './pages/groups/CreateGroup'
import { CreateUser } from './pages/user/CreateUser'
import { useAuthStore } from './thunks/useAuthStore'
import { Labels } from './pages/Labels'
import { Organizers } from './pages/Organizers'
import Layout from './layout/Layout'
import Error from './pages/404'
import Login from './pages/auth/Login'
import Loading from '@/components/Loading'
import ProtectedRoute from './components/ProtectedRoute'
const Dashboard = lazy(() => import('./pages/dashboard'))

function App () {
  const { status, checkAuthToken } = useAuthStore()

  useEffect(() => {
    checkAuthToken()
  }, [])

  if (status === 'checking') {
    return (
      <Loading />
    )
  }

  return (
    <main className='App relative'>
      <Routes>
        {
          (status === 'not-authenticated')
            ? (
              <>
                {/* Login */}
                <Route path='/login' element={<Login />} />
                <Route path='/*' element={<Navigate to='/login' />} />
              </>
              )
            : (
              <>
                <Route path='/' element={<Navigate to='/eventos' />} />
                <Route path='/*' element={<Layout />}>
                  <Route
                    path='dashboard' element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path='*' element={<Navigate to='/404' />} />
                  {/* Eventos */}
                  <Route
                    path='eventos' element={
                      <ProtectedRoute>
                        <Eventos />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path='eventos/crear' element={
                      <ProtectedRoute>
                        <Create />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path='eventos/editar/:id' element={
                      <ProtectedRoute>
                        <Create />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path='eventos/ver/:id' element={
                      <ProtectedRoute>
                        <ShowEvento />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path='eventos/estado_considerar/:id' element={
                      <ProtectedRoute>
                        <StageConsider />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path='eventos/estado_realizar/:id' element={
                      <ProtectedRoute>
                        <StagePerform />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path='eventos/estado_realizado/:id' element={
                      <ProtectedRoute>
                        <StagePerform />
                      </ProtectedRoute>
                    }
                  />

                  {/* Otras páginas */}
                  <Route
                    path='categorias' element={
                      <ProtectedRoute>
                        <Categorias />
                      </ProtectedRoute>
                    }
                  />

                  {/* Contactos */}
                  <Route
                    path='contactos' element={
                      <ProtectedRoute>
                        <Contactos />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path='contactos/crear' element={
                      <ProtectedRoute>
                        <CreateContactos />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path='contactos/editar/:id' element={
                      <ProtectedRoute>
                        <CreateContactos />
                      </ProtectedRoute>
                    }
                  />

                  {/* Usuarios */}
                  <Route path='usuarios' element={<Usuarios />} />
                  <Route path='usuarios/crear' element={<CreateUser />} />
                  <Route path='usuarios/editar/:id' element={<CreateUser />} />

                  {/* Grupos */}
                  <Route path='grupos' element={<Groups />} />
                  <Route path='grupos/crear' element={<CreateGroup />} />
                  <Route path='grupos/editar/:id' element={<CreateGroup />} />

                  {/* Etiquetas */}
                  <Route path='etiquetas' element={<Labels />} />

                  {/* Organizadores */}
                  <Route path='organizadores' element={<Organizers />} />
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
