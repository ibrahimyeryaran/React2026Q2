import React, { Component } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import ErrorBoundary from './ErrorBoundary'

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message')
  }
  return <div>Normal content</div>
}

class ThrowOnMount extends Component {
  render(): React.ReactNode {
    throw new Error('Mount error')
  }
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    )
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('catches errors and shows fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowOnMount />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument()
  })

  it('displays the error message in fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowOnMount />
      </ErrorBoundary>
    )
    expect(screen.getByText('Mount error')).toBeInTheDocument()
  })

  it('shows Reload Page button in fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowOnMount />
      </ErrorBoundary>
    )
    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument()
  })

  it('logs error to console', () => {
    render(
      <ErrorBoundary>
        <ThrowOnMount />
      </ErrorBoundary>
    )
    expect(console.error).toHaveBeenCalled()
  })

  it('does not show fallback when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )
    expect(screen.queryByText('Something went wrong!')).not.toBeInTheDocument()
    expect(screen.getByText('Normal content')).toBeInTheDocument()
  })

  it('reload button calls window.location.reload', async () => {
    const reloadMock = vi.fn()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: reloadMock },
    })

    const user = userEvent.setup()
    render(
      <ErrorBoundary>
        <ThrowOnMount />
      </ErrorBoundary>
    )
    await user.click(screen.getByRole('button', { name: /reload page/i }))
    expect(reloadMock).toHaveBeenCalled()
  })
})
