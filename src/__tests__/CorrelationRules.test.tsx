import { render, screen, fireEvent } from '@testing-library/react';
import { CorrelationRules } from '../components/correlation/CorrelationRules';
import { CorrelationProvider } from '../contexts/CorrelationContext';
import { describe, it, expect, vi } from 'vitest';
import { ToolType, MetricType, OperatorType, ActionType } from '../types/correlation';

// Mock du composant de formulaire
vi.mock('../components/correlation/CorrelationRuleForm', () => ({
  CorrelationRuleForm: ({ onSubmit }: { onSubmit: (rule: any) => void }) => (
    <div data-testid="rule-form">
      <button onClick={() => onSubmit({
        id: '1',
        name: 'Test Rule',
        description: 'Test Description',
        enabled: true,
        source: {
          tool: ToolType.JENKINS,
          metric: MetricType.BUILD_STATUS,
          condition: {
            operator: OperatorType.EQUALS,
            value: 'FAILURE'
          }
        },
        target: {
          tool: ToolType.GITHUB,
          action: ActionType.CREATE_ISSUE,
          parameters: {
            title: 'Build Failed',
            body: 'The Jenkins build has failed'
          }
        }
      })}>
        Submit Rule
      </button>
    </div>
  )
}));

describe('CorrelationRules', () => {
  const renderWithProvider = (component: React.ReactNode) => {
    return render(
      <CorrelationProvider>
        {component}
      </CorrelationProvider>
    );
  };

  it('devrait afficher le titre et le bouton de nouvelle règle', () => {
    renderWithProvider(<CorrelationRules />);

    expect(screen.getByText('Règles de Corrélation')).toBeInTheDocument();
    expect(screen.getByText('Nouvelle Règle')).toBeInTheDocument();
  });

  it('devrait afficher le formulaire lors du clic sur le bouton nouvelle règle', () => {
    renderWithProvider(<CorrelationRules />);

    const newRuleButton = screen.getByText('Nouvelle Règle');
    fireEvent.click(newRuleButton);

    expect(screen.getByText('Créer une nouvelle règle')).toBeInTheDocument();
  });

  it('devrait ajouter une nouvelle règle via le formulaire', () => {
    renderWithProvider(<CorrelationRules />);

    // Ouvrir le formulaire
    const newRuleButton = screen.getByText('Nouvelle Règle');
    fireEvent.click(newRuleButton);

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Test Rule' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });

    // Soumettre le formulaire
    fireEvent.click(screen.getByText('Créer'));

    // Vérifier que la règle a été ajoutée
    expect(screen.getByText('Test Rule')).toBeInTheDocument();
  });

  it('devrait afficher un message quand il n\'y a pas de règles', () => {
    renderWithProvider(<CorrelationRules />);

    expect(screen.getByText('Aucune règle de corrélation')).toBeInTheDocument();
  });
}); 