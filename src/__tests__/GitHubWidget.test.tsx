import { render, screen } from '@testing-library/react';
import { GitHubWidget } from '@/components/dashboard/widgets/GitHubWidget';

describe('GitHubWidget', () => {
  it('doit afficher le widget GitHub', () => {
    render(<GitHubWidget id="test" onRemove={() => {}} onSettings={() => {}} />);
    expect(screen.getByText(/github/i)).toBeInTheDocument();
  });
}); 