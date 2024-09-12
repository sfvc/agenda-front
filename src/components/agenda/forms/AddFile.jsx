import { SelectForm } from '@/components/agenda/forms'
import React, { useState } from 'react';
import { uploadFile } from '@/services/fileServices';
import { documentEvent } from '../../../services/eventService';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
const categorias = [
    { id: "Detalles de Planificación", nombre: "Detalles de Planificación" },
    { id: "Documentos A Realizar", nombre: "Documentos A Realizar" }
]


export const AddFile = ({ onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    // const [documentos, setDocumentos] = useState([])
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };
    const { id } = useParams()
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]); // Captura el archivo
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedCategory && selectedFile) {
            // Aquí puedes manejar el envío de los datos del formulario
            const formData = new FormData()
            formData.append("file", selectedFile)
            const fileUpload = await uploadFile(formData)

            if (fileUpload) {

                let documentos = [
                    {
                        nombre: selectedCategory,
                        url: fileUpload.url
                    }
                ]

                const res = await documentEvent(id, documentos)
             
                if (res == 200) {
                    toast.success('Documento agregado exitosamente')
                    onClose()
                }

            }

        } else {
            console.log('Por favor selecciona una categoría y un archivo.');
        }
    };

    return (
        <form className='grid grid-cols-1 md:grid-cols-1 gap-4 grid-rows-2' onSubmit={handleSubmit}>
            <div className="col-span-1">
                <SelectForm
                    title='Categoria'
                    options={categorias}
                    value={selectedCategory}
                    onChange={handleCategoryChange} // Captura la selección de la categoría
                />
            </div>
            <div className="col-span-1">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">
                    Upload file
                </label>
                <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    id="file_input"
                    type="file"
                    onChange={handleFileChange} // Captura el archivo seleccionado
                />
            </div>
            <div className="col-span-1">
                <button
                    type="submit"
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                >
                    Enviar
                </button>
            </div>
        </form>
    );
};