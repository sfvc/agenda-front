import Card from '@/components/ui/Card'
import Loading from '@/components/Loading'
import Pagination from '@/components/ui/Pagination'
import RichTextEditor from './RichTextEditor'
import { useState } from 'react'
export const Prensa=()=>{

    const [isLoading,setIsLoading] = useState(false)
    return (
        <>{
            isLoading ? <Loading className='mt-28 md:mt-64' />:
            (
                <>
                <Card>
                    <div className='mb-4 md:flex md:justify-between'>
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Prensa</h1>
                  {/* <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                    <div className='flex gap-2 items-center'>
                      <button
                        type='button'
                        onClick={addUser}
                        className='bg-blue-600 hover:bg-blue-800 text-white items-center text-center py-2 px-6 rounded-lg'
                      >
                        Agregar
                      </button>
                    </div>
                  </div> */}
                </div>
                </Card>
                <Card noborder>
{/* <RichTextEditor/> */}
                </Card>
                </>
            )
        }</>)
}