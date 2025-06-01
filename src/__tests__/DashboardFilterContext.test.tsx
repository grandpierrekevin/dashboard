import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { DashboardFilterProvider, useDashboardFilters } from '../context/DashboardFilterContext'

// Mock du composant enfant pour tester le contexte
const TestComponent = () => {
  const { filters, setFilters } = useDashboardFilters()
  return (
    <div>
      <div data-testid="filters">{JSON.stringify(filters)}</div>
      <button onClick={() => setFilters({ tool: 'github', status: 'active', period: 7 })}>
        Update Filters
      </button>
    </div>
  )
}

describe('DashboardFilterContext', () => {
  it('devrait fournir les valeurs par défaut du filtre', () => {
    render(
      <DashboardFilterProvider>
        <TestComponent />
      </DashboardFilterProvider>
    )

    const filtersElement = screen.getByTestId('filters')
    const filters = JSON.parse(filtersElement.textContent || '{}')
    
    expect(filters).toEqual({})
  })

  it('devrait permettre la mise à jour des filtres', async () => {
    render(
      <DashboardFilterProvider>
        <TestComponent />
      </DashboardFilterProvider>
    )

    const updateButton = screen.getByText('Update Filters')
    await act(async () => {
      await updateButton.click()
    })

    const filtersElement = screen.getByTestId('filters')
    const filters = JSON.parse(filtersElement.textContent || '{}')
    
    expect(filters).toEqual({
      tool: 'github',
      status: 'active',
      period: 7
    })
  })
}) 