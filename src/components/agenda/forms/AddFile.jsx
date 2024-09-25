import { useState } from 'react'
import { uploadFile } from '@/services/fileServices'
import { documentEvent } from '@/services/eventService'
import { toast } from 'react-toastify'
import Button from '@/components/ui/Button'
import { useParams } from 'react-router-dom'
import { SelectForm } from '@/components/agenda/forms'

const categorias = [
  { id: 'Detalles de Planificación', nombre: 'Detalles de Planificación' },
  { id: 'Documentos A Realizar', nombre: 'Documentos A Realizar' }
]

export const AddFile = ({ onClose, refetch }) => {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { id } = useParams()

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedCategory && selectedFile) {
      setIsSubmitting(true)
      try {
        const formData = new FormData()
        formData.append('file', selectedFile)
        const fileUpload = await uploadFile(formData)

        if (fileUpload) {
          const documentos = [
            {
              nombre: selectedCategory,
              url: fileUpload.url
            }
          ]
          const res = await documentEvent(id, documentos)
          if (res === 200) {
            toast.success('Documento agregado exitosamente')
            refetch()
            onClose()
          }
        }
      } catch (error) {
        console.log('fallo al subir el archivo')
      } finally {
        setIsSubmitting(false)
      }
    } else {
      console.log('Por favor selecciona una categoría y un archivo.')
    }
  }

  return (
    <form className='grid grid-cols-1 md:grid-cols-1 gap-4 grid-rows-2' onSubmit={handleSubmit}>
      <div className='col-span-1'>
        <SelectForm
          title='Categoria'
          options={categorias}
          value={selectedCategory}
          onChange={handleCategoryChange}
        />
      </div>
      <div className='col-span-1'>
        <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white' htmlFor='file_input'>
          Elegir Archivo
        </label>
        <input
          className='block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
          id='file_input'
          type='file'
          onChange={handleFileChange}
        />
      </div>
      <div className='col-span-1'>
        <div className='ltr:text-right rtl:text-left'>
          <Button
            type='submit'
            text={isSubmitting ? 'Guardando...' : 'Guardar'}
            className={`bg-green-500 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700'} text-white items-center text-center py-2 px-6 rounded-lg`}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </form>
  )
}
