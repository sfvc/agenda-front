import React, { useEffect, useRef } from 'react'
// import "./editortxt.css"; // Asegúrate de tener este archivo CSS para los estilos

const RichTextEditor = () => {
  const writingAreaRef = useRef(null)

  // Lista de fuentes
  const fontList = [
    'Arial',
    'Verdana',
    'Times New Roman',
    'Garamond',
    'Georgia',
    'Courier New',
    'cursive'
  ]

  // Inicialización
  useEffect(() => {
    const alignButtons = document.querySelectorAll('.align')
    const spacingButtons = document.querySelectorAll('.spacing')
    const formatButtons = document.querySelectorAll('.format')
    const scriptButtons = document.querySelectorAll('.script')

    highlighter(alignButtons, true)
    highlighter(spacingButtons, true)
    highlighter(formatButtons, false)
    highlighter(scriptButtons, true)

    const fontSizeRef = document.getElementById('fontSize')
    fontList.forEach((value) => {
      const option = document.createElement('option')
      option.value = value
      option.innerHTML = value
      document.getElementById('fontName').appendChild(option)
    })

    for (let i = 1; i <= 7; i++) {
      const option = document.createElement('option')
      option.value = i
      option.innerHTML = i
      fontSizeRef.appendChild(option)
    }

    fontSizeRef.value = 3
  }, [])

  const modifyText = (command, defaultUi, value) => {
    document.execCommand(command, defaultUi, value)
  }

  const handleButtonClick = (e) => {
    modifyText(e.target.id, false, null)
  }

  const handleAdvancedChange = (e) => {
    modifyText(e.target.id, false, e.target.value)
  }

  const handleCreateLink = () => {
    let userLink = prompt('Enter a URL')
    if (/http/i.test(userLink)) {
      modifyText('createLink', false, userLink)
    } else {
      userLink = 'http://' + userLink
      modifyText('createLink', false, userLink)
    }
  }

  const highlighter = (className, needsRemoval) => {
    className.forEach((button) => {
      button.addEventListener('click', () => {
        if (needsRemoval) {
          let alreadyActive = false
          if (button.classList.contains('active')) {
            alreadyActive = true
          }
          highlighterRemover(className)
          if (!alreadyActive) {
            button.classList.add('active')
          }
        } else {
          button.classList.toggle('active')
        }
      })
    })
  }

  const highlighterRemover = (className) => {
    className.forEach((button) => {
      button.classList.remove('active')
    })
  }

  const printText = () => {
    let textContent = writingAreaRef.current.innerHTML
    textContent = addLineBreaks(textContent, 158)
    const printWindow = window.open('', '_blank')
    printWindow.document.write('<html><head><title>Juzgado de Faltas</title>')
    printWindow.document.write("<style>body { font-family: 'Calibri', sans-serif; }</style>")
    printWindow.document.write('</head><body>')
    printWindow.document.write(`<div id="printed-content">${textContent}</div>`)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 1000)
  }

  const addLineBreaks = (inputString, charactersPerLine) => {
    let result = ''
    for (let i = 0; i < inputString.length; i++) {
      result += inputString[i]
      if ((i + 1) % charactersPerLine === 0) {
        result += '\n'
      }
    }
    return result
  }

  return (
    <div className='container'>
      <div className='options'>
        <button id='bold' className='option-button format' onClick={handleButtonClick}>
          <i className='fa-solid fa-bold' />
        </button>
        <button id='italic' className='option-button format' onClick={handleButtonClick}>
          <i className='fa-solid fa-italic' />
        </button>
        {/* Agrega los demás botones y selectores aquí de la misma manera */}
        <select id='lineSpacing' className='adv-option-button' onChange={handleAdvancedChange}>
          <option value='normal'>Normal</option>
          {/* Agrega más opciones aquí según sea necesario */}
        </select>
        <select id='fontName' className='adv-option-button' onChange={handleAdvancedChange} />
        <select id='fontSize' className='adv-option-button' onChange={handleAdvancedChange} />
      </div>
      <div id='text-input' ref={writingAreaRef} contentEditable='true' />
      <div className='seccion-botones-crud-editor'>
        <button onClick={printText}>Imprimir</button>
        <button>Cancelar</button>
        <button>Guardar</button>
      </div>
    </div>
  )
}

export default RichTextEditor
