import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../../components/ui/button'


describe('Button', () => {
  it('doit se rendre sans crash', () => {
    render(<Button>Mon Bouton</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Mon Bouton')).toBeInTheDocument()
  })

  it('doit appeler onClick lors d\'un clic', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={handleClick}>Cliquez-moi</Button>)
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('doit être désactivé si la prop disabled est passée', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('doit avoir le bon type (submit)', () => {
    render(<Button type="submit">Envoyer</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('doit être accessible (label présent)', () => {
    render(<Button aria-label="Action spéciale" />)
    expect(screen.getByLabelText('Action spéciale')).toBeInTheDocument()
  })
}) 