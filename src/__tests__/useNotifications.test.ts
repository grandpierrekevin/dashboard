import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNotifications } from '../hooks/useNotifications'
import { vi } from 'vitest'

describe('useNotifications', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('devrait initialiser avec les notifications par défaut', () => {
    const { result } = renderHook(() => useNotifications())
    expect(result.current.notifications).toHaveLength(3)
    expect(result.current.notifications[0]).toMatchObject({
      title: 'Jenkins',
      message: 'Jobs Jenkins en échec',
      type: 'error',
      read: false
    })
  })

  it('devrait ajouter une notification', () => {
    const { result } = renderHook(() => useNotifications())
    
    act(() => {
      result.current.addNotification({
        title: 'Test',
        message: 'Message de test',
        type: 'info'
      })
    })

    expect(result.current.notifications).toHaveLength(4)
    expect(result.current.notifications[0]).toMatchObject({
      title: 'Test',
      message: 'Message de test',
      type: 'info',
      read: false
    })
  })

  it('devrait supprimer une notification', () => {
    const { result } = renderHook(() => useNotifications())
    const notificationId = result.current.notifications[0].id
    
    act(() => {
      result.current.removeNotification(notificationId)
    })

    expect(result.current.notifications).toHaveLength(2)
    expect(result.current.notifications.find(n => n.id === notificationId)).toBeUndefined()
  })

  it('devrait marquer une notification comme lue', () => {
    const { result } = renderHook(() => useNotifications())
    const notificationId = result.current.notifications[0].id
    
    act(() => {
      result.current.markAsRead(notificationId)
    })

    expect(result.current.notifications.find(n => n.id === notificationId)?.read).toBe(true)
  })

  it('devrait marquer toutes les notifications comme lues', () => {
    const { result } = renderHook(() => useNotifications())
    
    act(() => {
      result.current.markAllAsRead()
    })

    expect(result.current.notifications.every(n => n.read)).toBe(true)
  })

  it('devrait persister les notifications dans le localStorage', () => {
    const { result } = renderHook(() => useNotifications())
    
    act(() => {
      result.current.addNotification({
        title: 'Test',
        message: 'Message de test',
        type: 'info'
      })
    })

    const savedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]')
    expect(savedNotifications).toHaveLength(4)
    expect(savedNotifications[0]).toMatchObject({
      title: 'Test',
      message: 'Message de test',
      type: 'info',
      read: false
    })
  })
}) 