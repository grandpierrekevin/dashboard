import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useTheme } from '@/hooks/useTheme'
import { vi } from 'vitest'

vi.mock('../hooks/useTheme')

describe('ThemeToggle', () => {
  const setTheme = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devrait afficher le bouton de basculement du thème', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme
    })
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('devrait basculer vers le thème sombre quand on clique en mode clair', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme
    })
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(setTheme).toHaveBeenCalledWith('dark')
  })

  it('devrait basculer vers le thème clair quand on clique en mode sombre', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      setTheme
    })
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(setTheme).toHaveBeenCalledWith('light')
  })

  it('devrait afficher l\'icône appropriée selon le thème', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme
    })
    render(<ThemeToggle />)
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()

    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      setTheme
    })
    render(<ThemeToggle />)
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
  })
}) 