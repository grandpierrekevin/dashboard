import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationBell } from '../components/sidebar/NotificationBell';

describe('NotificationBell', () => {
  it('doit afficher la cloche', () => {
    render(<NotificationBell />);
    expect(screen.getByLabelText(/notifications/i)).toBeInTheDocument();
  });
  it('doit ouvrir le popover au clic', () => {
    render(<NotificationBell />);
    const btn = screen.getByLabelText(/notifications/i);
    fireEvent.click(btn);
    // Vérifier l'ouverture du popover
  });
}); 