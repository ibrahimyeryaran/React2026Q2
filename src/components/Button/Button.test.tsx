import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('renders children text', () => {
    render(<Button onClick={vi.fn()}>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Submit</Button>)
    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders as a button element', () => {
    render(<Button onClick={vi.fn()}>Test</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
