import { render, screen } from '@testing-library/react';
import { DevOpsSummaryWidget } from '@/components/dashboard/widgets/DevOpsSummaryWidget';

describe('DevOpsSummaryWidget', () => {
  it('doit afficher le widget', () => {
    render(<DevOpsSummaryWidget id="test" onRemove={() => {}} onSettings={() => {}} />);
    expect(screen.getByText(/devops/i)).toBeInTheDocument();
  });
}); 