import React, { useState, useEffect } from 'react'
import Icon from '@/components/ui/Icon'

const INITIAL_PAGE = 1
const PAGES_TO_SHOW = 5
const PREVIUS_PAGES_TO_SHOW = 5

const Pagination = ({
  paginate = {},
  onPageChange,
  text,
  className = 'custom-class'
}) => {
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(paginate.current || INITIAL_PAGE)
  const [lastPage, setLastPage] = useState(paginate.totalPages || INITIAL_PAGE)

  useEffect(() => {
    if (paginate && paginate.current !== undefined) {
      setCurrentPage(paginate.current)
      setLastPage(paginate.totalPages)
      calculatePageNumbers()
    }
  }, [paginate])

  const calculatePageNumbers = () => {
    const totalPages = paginate.totalPages

    const pageNumbers = []
    const startPage = Math.max(1, currentPage - PREVIUS_PAGES_TO_SHOW)
    const endPage = Math.min(totalPages, currentPage + PAGES_TO_SHOW - 1)

    for (let i = startPage; i < currentPage; i++) {
      pageNumbers.push(i)
    }

    pageNumbers.push(currentPage)

    for (let i = currentPage + 1; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    setPages(pageNumbers)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      onPageChange(currentPage - 1)
    }
  }

  const handleClickPage = (page) => {
    if (typeof page === 'number') {
      setCurrentPage(page)
      onPageChange(page)
    }
  }

  const handleNextPage = () => {
    if (currentPage < lastPage) {
      setCurrentPage(currentPage + 1)
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className={className}>
      <ul className='pagination'>
        <li>
          {text
            ? (
              <button
                className='text-slate-600 dark:text-slate-300 prev-next-btn'
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              )
            : (
              <button
                className='text-xl leading-4 text-slate-900 dark:text-white h-6 w-6 flex items-center justify-center flex-col prev-next-btn'
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <Icon icon='heroicons-outline:chevron-left' />
              </button>
              )}
        </li>

        {
          (currentPage > PAGES_TO_SHOW + 1) && (
            <li key={INITIAL_PAGE} className='flex'>
              <button
                className={`${INITIAL_PAGE === currentPage ? 'active' : ''} page-link`}
                onClick={() => handleClickPage(INITIAL_PAGE)}
                disabled={INITIAL_PAGE === currentPage}
              >
                {INITIAL_PAGE}
              </button>
              <span className='ml-4'>...</span>
            </li>
          )
        }

        {
          pages.map((page, index) => (
            <li key={index}>
              <button
                className={`${page === currentPage ? 'active' : ''} page-link`}
                onClick={() => handleClickPage(page)}
                disabled={page === currentPage}
              >
                {page}
              </button>
            </li>
          ))
        }

        {
          (currentPage + PAGES_TO_SHOW < lastPage) && (
            <li className='flex'>
              <span className='mr-4'>...</span>
              <button
                className={`${lastPage === currentPage ? 'active' : ''} page-link`}
                onClick={() => handleClickPage(lastPage)}
                disabled={lastPage === currentPage}
              >
                {lastPage}
              </button>
            </li>
          )
        }

        <li>
          {text
            ? (
              <button
                onClick={handleNextPage}
                disabled={currentPage === lastPage}
                className='text-slate-600 dark:text-slate-300 prev-next-btn'
              >
                Siguiente
              </button>
              )
            : (
              <button
                className='text-xl leading-4 text-slate-900 dark:text-white h-6 w-6 flex items-center justify-center flex-col prev-next-btn'
                onClick={handleNextPage}
                disabled={currentPage === lastPage}
              >
                <Icon icon='heroicons-outline:chevron-right' />
              </button>
              )}
        </li>

      </ul>
    </div>
  )
}

export default Pagination
