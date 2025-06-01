import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { IntegrationsProvider, useIntegrations } from '../context/IntegrationsContext'

// Mock du composant enfant pour tester le contexte
const TestComponent = () => {
  const { integrations, toggleIntegration, setIntegrations } = useIntegrations()
  return (
    <div>
      <div data-testid="integrations">{JSON.stringify(integrations)}</div>
      <button onClick={() => toggleIntegration('GitHub')}>Toggle GitHub</button>
      <button onClick={() => setIntegrations([])}>Clear All</button>
    </div>
  )
}

describe('IntegrationsContext', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    })
  })

  it('devrait initialiser avec les intégrations par défaut', () => {
    render(
      <IntegrationsProvider>
        <TestComponent />
      </IntegrationsProvider>
    )
    const integrationsElement = screen.getByTestId('integrations')
    const integrations = JSON.parse(integrationsElement.textContent || '[]')
    expect(integrations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'GitHub', active: true }),
        expect.objectContaining({ name: 'GitLab', active: true })
      ])
    )
  })

  it('doit pouvoir toggle l\'état d\'une intégration', () => {
    render(
      <IntegrationsProvider>
        <TestComponent />
      </IntegrationsProvider>
    )
    const integrationsElement = screen.getByTestId('integrations')
    let integrations = JSON.parse(integrationsElement.textContent || '[]')
    expect(integrations[0].active).toBe(true)
    const toggleButton = screen.getByText('Toggle GitHub')
    fireEvent.click(toggleButton)
    integrations = JSON.parse(integrationsElement.textContent || '[]')
    expect(integrations[0].active).toBe(false)
  })

  it('doit pouvoir vider toutes les intégrations', () => {
    render(
      <IntegrationsProvider>
        <TestComponent />
      </IntegrationsProvider>
    )
    const integrationsElement = screen.getByTestId('integrations')
    let integrations = JSON.parse(integrationsElement.textContent || '[]')
    expect(integrations.length).toBeGreaterThan(0)
    const clearButton = screen.getByText('Clear All')
    fireEvent.click(clearButton)
    integrations = JSON.parse(integrationsElement.textContent || '[]')
    expect(integrations).toEqual([])
  })
}) 