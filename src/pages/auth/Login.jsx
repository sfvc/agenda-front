import React from 'react'
import LoginForm from '@/components/agenda/auth/login-form'
import { ToastContainer } from 'react-toastify'
import Illustration from '@/assets/images/auth/portada-agenda.jpg'
import logoAgenda from '@/assets/images/logo/logo_CATACAPI_oscuro.png'

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
                alt='Imagen de la Agenda'
                className='h-full w-full'
              />
            </div>
          </div>
          <div className='right-column relative'>
            <div className='inner-content h-full flex flex-col bg-[#00273D] dark:bg-slate-800'>
              <div className='auth-box h-full flex flex-col justify-center'>
                <div className='text-center 2xl:mb-10 mb-4'>
                  <img src={logoAgenda} alt='Logo Agenda' className='w-36 md:w-52 pb-6 inline-block mx-auto pointer-events-none' />
                  <h4 className='font-medium text-white'>Iniciar Sesión</h4>
                  <div className='text-white text-base'>
                    Completa los datos para ingresar al sistema
                  </div>
                </div>
                <LoginForm />
              </div>
              <div className='auth-footer text-center'>
                {/* Copyright &copy; <span>{(new Date().getFullYear())} Municipalidad de San Fernando del Valle de Catamarca</span> */}
                Copyright &copy; <span>{(new Date().getFullYear())} Dirección de Modernización.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
