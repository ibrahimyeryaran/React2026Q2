import { vi, describe, it, expect } from 'vitest'
import {
  makePokemonListResponse as makeListResponse,
  makePokemonDetailResponse as makeDetailResponse,
} from '../test-utils/mockData'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// Tests are ordered so error cases run before the cache is populated.
// Once getAllItems succeeds it caches results — subsequent tests rely on that cache.

describe('apiService — error handling (cache not yet populated)', () => {
  it('throws on 404 response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 })
    const { apiService } = await import('./api')
    await expect(apiService.getAllItems()).rejects.toThrow('API endpoint not found')
  })

  it('throws on 429 response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 429 })
    const { apiService } = await import('./api')
    await expect(apiService.getAllItems()).rejects.toThrow('Too many requests')
  })

  it('throws on 500 response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })
    const { apiService } = await import('./api')
    await expect(apiService.getAllItems()).rejects.toThrow('Server error: 500')
  })
})

describe('apiService — getAllItems success (populates cache)', () => {
  it('fetches list and returns formatted items', async () => {
    mockFetch
      .mockResolvedValueOnce(makeListResponse(['squirtle', 'wartortle']))
      .mockResolvedValueOnce(makeDetailResponse(7, 'squirtle', 'water'))
      .mockResolvedValueOnce(makeDetailResponse(8, 'wartortle', 'water'))

    const { apiService } = await import('./api')
    const items = await apiService.getAllItems()
    expect(items).toHaveLength(2)
    expect(items[0].name).toBe('Squirtle')
    expect(items[0].id).toBe(7)
    expect(items[1].name).toBe('Wartortle')
  })

  it('returns cached data without new fetch calls', async () => {
    const { apiService } = await import('./api')
    const callsBefore = mockFetch.mock.calls.length
    await apiService.getAllItems()
    expect(mockFetch.mock.calls.length).toBe(callsBefore)
  })
})

describe('apiService — searchItems (uses cache populated above)', () => {
  it('filters items by search term', async () => {
    const { apiService } = await import('./api')
    const items = await apiService.searchItems('squir')
    expect(items).toHaveLength(1)
    expect(items[0].name).toBe('Squirtle')
  })

  it('returns all items when search term is empty string', async () => {
    const { apiService } = await import('./api')
    const items = await apiService.searchItems('')
    expect(items).toHaveLength(2)
  })

  it('returns all items when search term is only whitespace', async () => {
    const { apiService } = await import('./api')
    const items = await apiService.searchItems('   ')
    expect(items).toHaveLength(2)
  })

  it('returns empty array when no item matches', async () => {
    const { apiService } = await import('./api')
    const items = await apiService.searchItems('pikachu')
    expect(items).toHaveLength(0)
  })

  it('is case-insensitive', async () => {
    const { apiService } = await import('./api')
    const items = await apiService.searchItems('SQUIR')
    expect(items).toHaveLength(1)
    expect(items[0].name).toBe('Squirtle')
  })
})
