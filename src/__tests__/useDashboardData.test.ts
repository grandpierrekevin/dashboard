import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDashboardData } from '../hooks/useDashboardData'

describe('useDashboardData', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    })
  })

  it('devrait initialiser avec les données par défaut', () => {
    const { result } = renderHook(() => useDashboardData())
    expect(result.current.data).toEqual({
      github: [],
      gitlab: [],
      jenkins: [],
      jira: [],
      sonar: [],
      alerts: [],
    })
    expect(result.current.loading).toBe(false)
  })

  it('devrait charger les données de démonstration après fetchData', async () => {
    const { result } = renderHook(() => useDashboardData())
    await act(async () => {
      await result.current.fetchData()
    })
    expect(result.current.data.github).not.toHaveLength(0)
    expect(result.current.data.jenkins).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Build OK' }),
        expect.objectContaining({ name: 'Tests OK' })
      ])
    )
    expect(result.current.loading).toBe(false)
  })
}) 