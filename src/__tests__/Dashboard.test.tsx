import { render, screen } from '@testing-library/react';
import Dashboard from '../components/dashboard/Dashboard';

describe('Dashboard', () => {
  it('doit afficher le dashboard', () => {
    render(<Dashboard />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
}); 