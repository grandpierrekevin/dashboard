import { render, screen, fireEvent } from '@testing-library/react'
import { NotificationsProvider, useNotifications } from '../context/NotificationsContext'
import { vi } from 'vitest'

describe('NotificationsContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  const TestComponent = () => {
    const { notifications, addNotification, markAsRead, removeNotification } = useNotifications()
    return (
      <div>
        <div data-testid="notifications">{JSON.stringify(notifications)}</div>
        <button onClick={() => addNotification({ title: 'Test', message: 'Test message', type: 'info' })}>
          Add
        </button>
        <button onClick={() => markAsRead(notifications[0]?.id)}>Mark as Read</button>
        <button onClick={() => removeNotification(notifications[0]?.id)}>Remove</button>
      </div>
    )
  }

  it('devrait initialiser avec un tableau de notifications vide', () => {
    render(
      <NotificationsProvider>
        <TestComponent />
      </NotificationsProvider>
    )
    const notifications = JSON.parse(screen.getByTestId('notifications').textContent || '[]')
    expect(notifications).toHaveLength(0)
  })

  it('devrait permettre l\'ajout d\'une notification', () => {
    render(
      <NotificationsProvider>
        <TestComponent />
      </NotificationsProvider>
    )
    const addButton = screen.getByText('Add')
    fireEvent.click(addButton)
    const notifications = JSON.parse(screen.getByTestId('notifications').textContent || '[]')
    expect(notifications).toHaveLength(1)
    expect(notifications[0]).toHaveProperty('title', 'Test')
    expect(notifications[0]).toHaveProperty('message', 'Test message')
    expect(notifications[0]).toHaveProperty('type', 'info')
  })

  it('devrait permettre de marquer une notification comme lue', () => {
    render(
      <NotificationsProvider>
        <TestComponent />
      </NotificationsProvider>
    )
    const addButton = screen.getByText('Add')
    fireEvent.click(addButton)
    const markAsReadButton = screen.getByText('Mark as Read')
    fireEvent.click(markAsReadButton)
    const notifications = JSON.parse(screen.getByTestId('notifications').textContent || '[]')
    expect(notifications[0]).toHaveProperty('read', true)
  })

  it('devrait permettre la suppression d\'une notification', () => {
    render(
      <NotificationsProvider>
        <TestComponent />
      </NotificationsProvider>
    )
    const addButton = screen.getByText('Add')
    fireEvent.click(addButton)
    const removeButton = screen.getByText('Remove')
    fireEvent.click(removeButton)
    const notifications = JSON.parse(screen.getByTestId('notifications').textContent || '[]')
    expect(notifications).toHaveLength(0)
  })
}) 