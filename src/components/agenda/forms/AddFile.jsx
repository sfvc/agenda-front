import { SelectForm } from '@/components/agenda/forms'

const categorias = [
    { id: "1", nombre: "Detalles de Planificación" }
]
export const AddFile = () => {
    return (
        <>
            <form className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <SelectForm

                    title='Categoria'
                    options={categorias}


                />
            </form>
        </>
    )
}