import { render, screen } from '../test/test-utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'

describe('Card', () => {
  it('devrait rendre une carte avec son contenu', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Titre de la carte</CardTitle>
          <CardDescription>Description de la carte</CardDescription>
        </CardHeader>
        <CardContent>Contenu de la carte</CardContent>
        <CardFooter>Pied de la carte</CardFooter>
      </Card>
    )

    expect(screen.getByText('Titre de la carte')).toBeInTheDocument()
    expect(screen.getByText('Description de la carte')).toBeInTheDocument()
    expect(screen.getByText('Contenu de la carte')).toBeInTheDocument()
    expect(screen.getByText('Pied de la carte')).toBeInTheDocument()
  })

  it('devrait appliquer les classes CSS correctement', () => {
    const { container } = render(
      <Card className="custom-class">
        <CardContent>Contenu</CardContent>
      </Card>
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('devrait rendre une carte sans header et footer', () => {
    render(
      <Card>
        <CardContent>Contenu simple</CardContent>
      </Card>
    )

    expect(screen.getByText('Contenu simple')).toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
}) 