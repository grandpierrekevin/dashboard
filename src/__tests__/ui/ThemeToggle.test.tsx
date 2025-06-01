import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '../../components/ui/theme-toggle'

describe('ThemeToggle', () => {
  it('doit se rendre sans crash', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('doit afficher l\'icône du thème courant', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: /changer le thème/i })
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('doit appeler onClick lors d\'un clic', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<ThemeToggle onClick={handleClick} />)
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('doit être accessible (label présent)', () => {
    render(<ThemeToggle aria-label="Changer le thème" />)
    expect(screen.getByLabelText('Changer le thème')).toBeInTheDocument()
  })
}) 