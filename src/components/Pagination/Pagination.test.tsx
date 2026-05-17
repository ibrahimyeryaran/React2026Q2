import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect } from 'vitest'
import Pagination from './Pagination'

describe('Pagination', () => {
  const onPageChange = vi.fn()

  it('renders prev and next buttons', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />)
    expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('renders page number buttons', () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />)
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
  })

  it('disables prev button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />)
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />)
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })

  it('calls onPageChange with next page when next is clicked', async () => {
    const user = userEvent.setup()
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />)
    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange with prev page when prev is clicked', async () => {
    const user = userEvent.setup()
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />)
    await user.click(screen.getByRole('button', { name: /prev/i }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with page number when page button is clicked', async () => {
    const user = userEvent.setup()
    render(<Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />)
    await user.click(screen.getByRole('button', { name: '3' }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })
})
