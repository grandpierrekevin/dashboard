import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useChartSettings } from '../hooks/useChartSettings'

describe('useChartSettings', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should initialize with default settings', () => {
    const { result } = renderHook(() => useChartSettings('test-widget'))
    expect(result.current.settings).toEqual({
      theme: 'light',
      showLegend: true,
      showGrid: true,
      showTooltip: true,
      animation: true,
      aspectRatio: 2,
      colorScheme: 'default',
      fontSize: 12,
      lineWidth: 2,
      maintainAspectRatio: true,
      pointHoverRadius: 5,
      pointRadius: 3,
      responsive: true,
    })
  })

  it('should load saved settings from localStorage', () => {
    const savedSettings = {
      theme: 'dark',
      showLegend: false,
      showGrid: false,
      showTooltip: false,
      animation: false,
      aspectRatio: 1.5,
      colorScheme: 'dark',
      fontSize: 14,
      lineWidth: 3,
      maintainAspectRatio: false,
      pointHoverRadius: 6,
      pointRadius: 4,
      responsive: false,
    }
    localStorage.setItem('chartSettings-test-widget', JSON.stringify(savedSettings))

    const { result } = renderHook(() => useChartSettings('test-widget'))
    expect(result.current.settings).toEqual(savedSettings)
  })

  it('should update a single setting', () => {
    const { result } = renderHook(() => useChartSettings('test-widget'))
    
    act(() => {
      result.current.updateSetting('theme', 'dark')
    })

    expect(result.current.settings.theme).toBe('dark')
  })

  it('should update multiple settings', () => {
    const { result } = renderHook(() => useChartSettings('test-widget'))
    
    act(() => {
      result.current.updateSettings({
        theme: 'dark',
        showLegend: false,
        fontSize: 16,
      })
    })

    expect(result.current.settings).toMatchObject({
      theme: 'dark',
      showLegend: false,
      fontSize: 16,
    })
  })

  it('should toggle boolean settings', () => {
    const { result } = renderHook(() => useChartSettings('test-widget'))
    
    act(() => {
      result.current.toggleLegend()
    })
    expect(result.current.settings.showLegend).toBe(false)

    act(() => {
      result.current.toggleGrid()
    })
    expect(result.current.settings.showGrid).toBe(false)

    act(() => {
      result.current.toggleTooltip()
    })
    expect(result.current.settings.showTooltip).toBe(false)

    act(() => {
      result.current.toggleAnimation()
    })
    expect(result.current.settings.animation).toBe(false)
  })

  it('should update numeric settings', () => {
    const { result } = renderHook(() => useChartSettings('test-widget'))
    
    act(() => {
      result.current.updateFontSize(16)
    })
    expect(result.current.settings.fontSize).toBe(16)

    act(() => {
      result.current.updateLineWidth(4)
    })
    expect(result.current.settings.lineWidth).toBe(4)

    act(() => {
      result.current.updatePointRadius(5)
    })
    expect(result.current.settings.pointRadius).toBe(5)

    act(() => {
      result.current.updatePointHoverRadius(8)
    })
    expect(result.current.settings.pointHoverRadius).toBe(8)
  })

  it('should update color scheme', () => {
    const { result } = renderHook(() => useChartSettings('test-widget'))
    
    act(() => {
      result.current.updateColorScheme('dark')
    })
    expect(result.current.settings.colorScheme).toBe('dark')
  })

  it('should reset settings to default', () => {
    const { result } = renderHook(() => useChartSettings('test-widget'))
    
    act(() => {
      result.current.updateSettings({
        theme: 'dark',
        showLegend: false,
        fontSize: 16,
      })
    })

    act(() => {
      result.current.resetSettings()
    })

    expect(result.current.settings).toEqual({
      theme: 'light',
      showLegend: true,
      showGrid: true,
      showTooltip: true,
      animation: true,
      aspectRatio: 2,
      colorScheme: 'default',
      fontSize: 12,
      lineWidth: 2,
      maintainAspectRatio: true,
      pointHoverRadius: 5,
      pointRadius: 3,
      responsive: true,
    })
  })

  it('should persist settings to localStorage', () => {
    const { result } = renderHook(() => useChartSettings('test-widget'))
    
    act(() => {
      result.current.updateSettings({
        theme: 'dark',
        showLegend: false,
        fontSize: 16,
      })
    })

    const savedSettings = JSON.parse(localStorage.getItem('chartSettings-test-widget') || '{}')
    expect(savedSettings).toMatchObject({
      theme: 'dark',
      showLegend: false,
      fontSize: 16,
    })
  })
}) 