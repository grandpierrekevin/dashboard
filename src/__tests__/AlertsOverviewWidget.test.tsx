import { render, screen } from '@testing-library/react';
import { AlertsOverviewWidget } from '@/components/dashboard/widgets/AlertsOverviewWidget';

describe('AlertsOverviewWidget', () => {
  it('doit afficher le widget', () => {
    render(<AlertsOverviewWidget id="test" onRemove={() => {}} onSettings={() => {}} />);
    expect(screen.getByText(/alert/i)).toBeInTheDocument();
  });
}); 