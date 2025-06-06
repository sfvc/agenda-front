export const SelectForm = ({ register, title, options = [], error = null, disabled = false, onChange, value }) => {
  return (
    <div>
      {title && (
        <label htmlFor={`${title}`} className='form-label '>
          {title}
        </label>
      )}

      <select
        {...register}
        value={value} // Aquí controlas el valor del select con el estado
        className={`form-control py-2 ${error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-900 cursor-pointer'} dark:text-white dark:placeholder-white placeholder-black-900`}
        disabled={disabled}
        onChange={onChange}
      >
        <option value=''>Seleccione una opción</option>
        {options.map((op, index) => (
          <option key={op?.id ?? `option-${index}`} value={op.id}>
            {op.nombre}
          </option>
        ))}
      </select>
      {error && <p className='mt-2 text-danger-500 block text-sm'>{error.message}</p>}
    </div>
  )
}
