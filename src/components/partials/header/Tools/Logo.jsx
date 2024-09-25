import React from 'react'
import { Link } from 'react-router-dom'
import useDarkMode from '@/hooks/useDarkMode'
import useSemiDark from '@/hooks/useSemiDark'
import logoCatamarcaClaro from '@/assets/images/logo/logo_CATACAPI_claro.png'
import logoCatamarcaOscuro from '@/assets/images/logo/logo_CATACAPI_oscuro.png'

const Logo = () => {
  const [isDark] = useDarkMode()
  // semi dark
  const [isSemiDark] = useSemiDark()

  return (
    <div>
      <Link to='/eventos'>
        <div className='flex items-center space-x-4'>
          <div className='logo-icon'>
            {!isDark && !isSemiDark
              ? (
                <img src={logoCatamarcaOscuro} alt='Logo Capital' className='w-32 rounded-md' />
                )
              : (
                <img src={logoCatamarcaClaro} alt='Logo Capital' className='w-32 rounded-md' />
                )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Logo
