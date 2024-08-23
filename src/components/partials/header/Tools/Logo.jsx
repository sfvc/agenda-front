import React from 'react'
import { Link } from 'react-router-dom'
import useWidth from '@/hooks/useWidth'

import logoCatamarca from '@/assets/images/logo/logo_CATACAPI_color.png'
const Logo = () => {
  const { width, breakpoints } = useWidth()

  return (
    <div>
      <Link to='/eventos'>
        {width >= breakpoints.xl
          ? (
            <img src={logoCatamarca} alt='' className='w-32 rounded-md' />
            )
          : (
            <img src={logoCatamarca} alt='' className='w-32 rounded-md' />
            )}
      </Link>
    </div>
  )
}

export default Logo
