import { render, screen } from '@testing-library/react';
import { SonarQubeWidget } from '@/components/dashboard/widgets/SonarQubeWidget';

describe('SonarQubeWidget', () => {
  it('doit afficher le widget SonarQube', () => {
    render(<SonarQubeWidget id="test" onRemove={() => {}} onSettings={() => {}} />);
    expect(screen.getByText(/sonarqube/i)).toBeInTheDocument();
  });
}); 