import { render, screen, fireEvent } from '../test/test-utils'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../components/ui/dialog'

describe('Dialog', () => {
  it('devrait ouvrir le dialogue quand on clique sur le trigger', async () => {
    render(
      <Dialog>
        <DialogTrigger>Ouvrir</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Titre du dialogue</DialogTitle>
            <DialogDescription>Description du dialogue</DialogDescription>
          </DialogHeader>
          <div>Contenu du dialogue</div>
          <DialogFooter>
            <DialogClose>Fermer</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    const trigger = screen.getByRole('button', { name: /ouvrir/i })
    fireEvent.click(trigger)

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Titre du dialogue')).toBeInTheDocument()
    expect(screen.getByText('Description du dialogue')).toBeInTheDocument()
    expect(screen.getByText('Contenu du dialogue')).toBeInTheDocument()
  })

  it('devrait fermer le dialogue quand on clique sur le bouton de fermeture', async () => {
    render(
      <Dialog>
        <DialogTrigger>Ouvrir</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Titre du dialogue</DialogTitle>
            <DialogDescription>Description du dialogue</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Fermer</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    // Ouvrir le dialogue
    const trigger = screen.getByRole('button', { name: /ouvrir/i })
    fireEvent.click(trigger)

    // Vérifier que le dialogue est ouvert
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toBeInTheDocument()

    // Fermer le dialogue
    const closeButton = screen.getByRole('button', { name: /fermer/i })
    fireEvent.click(closeButton)

    // Vérifier que le dialogue est fermé
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('devrait appliquer les classes CSS personnalisées', async () => {
    render(
      <Dialog>
        <DialogTrigger>Ouvrir</DialogTrigger>
        <DialogContent className="custom-dialog">
          <DialogHeader>
            <DialogTitle>Titre</DialogTitle>
            <DialogDescription>Description du dialogue</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    const trigger = screen.getByRole('button', { name: /ouvrir/i })
    fireEvent.click(trigger)

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveClass('custom-dialog')
  })
}) 