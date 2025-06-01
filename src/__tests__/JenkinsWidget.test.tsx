import { render, screen } from '@testing-library/react';
import { JenkinsWidget } from '@/components/dashboard/widgets/JenkinsWidget';

describe('JenkinsWidget', () => {
  it('doit afficher le widget Jenkins', () => {
    render(<JenkinsWidget id="test" onRemove={() => {}} onSettings={() => {}} />);
    expect(screen.getByText(/jenkins/i)).toBeInTheDocument();
  });
}); 