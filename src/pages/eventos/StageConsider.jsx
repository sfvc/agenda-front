import Card from '@/components/ui/Card'
import React, { useState } from 'react'
import Loading from '@/components/Loading'
import Textinput from '@/components/ui/Textinput'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { nextStageEvent } from '@/services/eventService'
import Button from '@/components/ui/Button'
import { toast } from 'react-toastify'
const initialForm = {
  detalle_planificacion: ''
}

export const StageConsider = () => {
  const navigate = useNavigate()
  const [currentPage] = useState(1)
  const [isLoading] = useState(false)
  const [, setFormData] = useState(initialForm)
  const { id } = useParams()
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit
  } = useForm()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const onSubmit = async (items) => {
    try {
      await nextStageEvent(id, items)
      navigate(`/eventos?page=${currentPage}`)
      toast.success('El evento paso al estado A CONSIDERAR')
    } catch (error) {
      console.error(error)
      toast.error('Hubo un error al intentar pasar el evento')
    }
  }

  return (
    <>
      {
        isLoading
          ? <Loading className='mt-28 md:mt-64' />
          : (
            <>
              <Card noborder>
                <div className='mb-4 md:flex md:justify-between'>
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Pasar evento a considerar</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor='detalle_planificacion' className='form-label'>
                      Detalles de Planificación
                    </label>
                    <Textinput
                      name='detalle_planificacion'
                      type='text'
                      placeholder='Ingrese los detalles'
                      register={register}
                      onChange={handleChange}
                      errors={errors.detalle_planificacion}
                    />
                  </div>
                </form>
              </Card>

              <div className='flex justify-end gap-4 mt-8'>
                <div className='ltr:text-right rtl:text-left'>
                  <button
                    className='btn-danger items-center text-center py-2 px-6 rounded-lg'
                    onClick={() => navigate(`/eventos?page=${currentPage}`)}
                  >
                    Volver
                  </button>
                </div>
                <div className='ltr:text-right rtl:text-left'>
                  <Button
                    type='submit'
                    text={isSubmitting ? 'Guardando' : 'Guardar'}
                    className={`bg-green-500 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700'} text-white items-center text-center py-2 px-6 rounded-lg`}
                    disabled={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                  />
                </div>
              </div>
            </>
            )
    }
    </>
  )
}
