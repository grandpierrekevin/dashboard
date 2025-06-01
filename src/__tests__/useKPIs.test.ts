import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useKPIs } from '../hooks/useKPIs'

describe('useKPIs', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    })
  })

  it('devrait initialiser avec les valeurs par défaut', () => {
    const { result } = renderHook(() => useKPIs())
    expect(result.current.kpis).toHaveLength(4)
    expect(result.current.kpis[0]).toMatchObject({ label: 'Builds réussis', value: 0 })
  })

  it('devrait mettre à jour tous les KPIs', () => {
    const { result } = renderHook(() => useKPIs())
    const newKPIs = [
      { label: 'Builds réussis', value: 10, color: 'green', show: true },
      { label: 'Tests passés', value: 20, color: 'blue', show: true },
      { label: 'Bugs', value: 2, color: 'red', show: true },
      { label: 'Couverture', value: 80, color: 'yellow', show: true },
    ]
    act(() => {
      result.current.updateKPIs(newKPIs)
    })
    expect(result.current.kpis).toEqual(newKPIs)
  })

  it('doit pouvoir toggle l\'affichage d\'un KPI', () => {
    const { result } = renderHook(() => useKPIs())
    act(() => {
      result.current.toggleKPI(0)
    })
    expect(result.current.kpis[0].show).toBe(false)
    act(() => {
      result.current.toggleKPI(0)
    })
    expect(result.current.kpis[0].show).toBe(true)
  })

  it('doit mettre à jour les valeurs des KPIs via updateKPIValues', () => {
    const { result } = renderHook(() => useKPIs())
    const data = {
      jenkins: [
        { name: 'Build OK', value: 5 },
        { name: 'Tests OK', value: 7 }
      ],
      sonar: [
        { name: 'Bugs', value: 2 },
        { name: 'Coverage', value: 90 }
      ]
    }
    act(() => {
      result.current.updateKPIValues(data)
    })
    expect(result.current.kpis[0].value).toBe(5)
    expect(result.current.kpis[1].value).toBe(7)
    expect(result.current.kpis[2].value).toBe(2)
    expect(result.current.kpis[3].value).toBe(90)
  })
}) 