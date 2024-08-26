import React from 'react'
import { Link } from 'react-router-dom'
import useDarkMode from '@/hooks/useDarkMode'
import useSemiDark from '@/hooks/useSemiDark'
import logoCatamarcaClaro from '@/assets/images/logo/logo_CATACAPI_claro.png'
import logoCatamarcaOscuro from '@/assets/images/logo/logo_CATACAPI_oscuro.png'

function Error () {
  const [isDark] = useDarkMode()
  const [isSemiDark] = useSemiDark()

  return (
    <div className='min-h-screen flex flex-col justify-center items-center text-center py-20 dark:bg-slate-900'>
      <div className='logo-icon'>
        {!isDark && !isSemiDark
          ? (
            <img src={logoCatamarcaOscuro} alt='Logo Capital' className='w-56 rounded-md' />
            )
          : (
            <img src={logoCatamarcaClaro} alt='Logo Capital' className='w-56 rounded-md' />
            )}
      </div>
      <div className='max-w-[546px] mx-auto w-full mt-12'>
        <h4 className='text-slate-900 mb-4'>
          Página no encontrada
        </h4>
        <div className='dark:text-white text-base font-normal mb-10'>
          Es posible que la página que está buscando haya sido eliminada debido a un cambio de nombre o no esté disponible temporalmente.
        </div>
      </div>
      <div className='max-w-[300px] mx-auto w-full'>
        <Link
          to='/'
          className='btn btn-dark dark:bg-slate-800 block text-center'
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export default Error
