import { render, screen } from '@testing-library/react';
import { Textarea } from '../components/ui/textarea';
describe('Textarea', () => {
  it('doit afficher un textarea', () => {
    render(<Textarea placeholder="test" />);
    expect(screen.getByPlaceholderText(/test/i)).toBeInTheDocument();
  });
}); 