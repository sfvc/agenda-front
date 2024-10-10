import React from 'react'
import { ToastContainer } from 'react-toastify'
import Illustration from '@/assets/images/auth/portada-agenda.png'
import LoginForm from '@/components/agenda/forms/LoginForm'

const Login = () => {
  return (
    <>
      <ToastContainer />
      <div className='loginwrapper'>
        <div className='lg-inner-column'>
          <div className='left-column relative z-[1]'>
            <div className='h-full w-full pointer-events-none'>
              <img
                src={Illustration}
                alt='Imagen de agenda'
                className='h-full w-full'
              />
            </div>
          </div>
          <div className='right-column relative'>
            <div className='inner-content h-full flex flex-col bg-[#00273D] dark:bg-slate-800'>
              <div className='auth-box h-full flex flex-col justify-center'>
                <div className='text-center 2xl:mb-10 mb-4'>
                  {/* <img src={LogoAgenda} alt='Logo agenda' className='w-36 md:w-52 pb-6 inline-block mx-auto pointer-events-none' /> */}
                  <h2 className='text-blue-600 dark:text-blue-400 m-4'>Agenda del Intendente</h2>
                  <h4 className='font-medium text-white'>Iniciar Sesión</h4>
                  <div className='text-white text-base'>
                    Completa los datos para ingresar al sistema
                  </div>
                </div>
                <LoginForm />
              </div>
              <div className='auth-footer text-center'>
                Copyright &copy; <span>{(new Date().getFullYear())} Municipalidad de la Ciudad de San Fernando Del Valle de Catamarca.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
