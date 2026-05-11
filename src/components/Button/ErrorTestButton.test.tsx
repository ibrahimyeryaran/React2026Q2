import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Component } from 'react'
import ErrorTestButton from './ErrorTestButton'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

describe('ErrorTestButton', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the test error button', () => {
    render(<ErrorTestButton />)
    expect(screen.getByRole('button', { name: /test error boundary/i })).toBeInTheDocument()
  })

  it('throws error when button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <ErrorBoundary>
        <ErrorTestButton />
      </ErrorBoundary>
    )
    await user.click(screen.getByRole('button', { name: /test error boundary/i }))
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument()
  })

  it('triggers error boundary fallback UI on click', async () => {
    const user = userEvent.setup()
    render(
      <ErrorBoundary>
        <ErrorTestButton />
      </ErrorBoundary>
    )
    await user.click(screen.getByRole('button', { name: /test error boundary/i }))
    expect(screen.getByText(/test error triggered/i)).toBeInTheDocument()
  })

  it('renders without error initially', () => {
    render(
      <ErrorBoundary>
        <ErrorTestButton />
      </ErrorBoundary>
    )
    expect(screen.queryByText('Something went wrong!')).not.toBeInTheDocument()
  })
})

class ErrorCatcher extends Component<
  { children: React.ReactNode },
  { error: string | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { error: error.message }
  }

  render() {
    if (this.state.error) return <div>Caught: {this.state.error}</div>
    return this.props.children
  }
}

describe('ErrorTestButton error propagation', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('propagates the correct error message', async () => {
    const user = userEvent.setup()
    render(
      <ErrorCatcher>
        <ErrorTestButton />
      </ErrorCatcher>
    )
    await user.click(screen.getByRole('button', { name: /test error boundary/i }))
    expect(screen.getByText(/caught:/i)).toBeInTheDocument()
  })
})
