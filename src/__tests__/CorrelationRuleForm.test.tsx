import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CorrelationRuleForm } from '../CorrelationRuleForm';
import { useCorrelation } from '@/context/CorrelationContext';
import { ToolType, MetricType, OperatorType, ActionType } from '@/types/correlation';
import { describe, it, expect, vi } from 'vitest';

// Mock du contexte de corrélation
vi.mock('@/context/CorrelationContext', () => ({
  useCorrelation: vi.fn(),
}));

// Mock de @radix-ui/react-select
vi.mock('@radix-ui/react-select', () => ({
  Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Trigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  Value: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Content: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Viewport: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Group: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Item: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-value={value}>{children}</div>
  )
}));

describe('CorrelationRuleForm', () => {
  const mockAddRule = vi.fn();
  const mockUpdateRule = vi.fn();
  const mockClose = vi.fn();

  beforeEach(() => {
    (useCorrelation as unknown as { mockReturnValue: Function }).mockReturnValue({
      addRule: mockAddRule,
      updateRule: mockUpdateRule,
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderForm = (props = {}) => {
    return render(<CorrelationRuleForm onClose={mockClose} {...props} />);
  };

  it('renders form with default values when creating new rule', () => {
    renderForm();
    expect(screen.getByLabelText(/nom de la règle/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /source/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /cible/i })).toBeInTheDocument();
  });

  it('renders form with existing rule values when editing', () => {
    const existingRule = {
      id: '1',
      name: 'Test Rule',
      description: 'Test Description',
      source: {
        tool: ToolType.GITHUB,
        metric: 'commits',
        operator: '>',
        value: '10'
      },
      target: {
        tool: ToolType.JIRA,
        metric: 'issues',
        action: 'create'
      },
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      severity: 'high'
    };

    renderForm({ rule: existingRule });

    expect(screen.getByLabelText(/nom de la règle/i)).toHaveValue('Test Rule');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Test Description');
  });

  it('calls addRule when submitting new rule', async () => {
    const user = userEvent.setup();
    render(
      <CorrelationRuleForm
        onAddRule={mockAddRule}
        onUpdateRule={mockUpdateRule}
        onClose={mockClose}
      />
    );

    await user.type(screen.getByLabelText(/nom de la règle/i), 'New Rule');
    await user.type(screen.getByLabelText(/description/i), 'New Description');

    await user.click(screen.getByRole('button', { name: /créer/i }));

    expect(mockAddRule).toHaveBeenCalled();
    expect(mockClose).toHaveBeenCalled();
  });

  it('calls updateRule when submitting existing rule', async () => {
    const user = userEvent.setup();
    const existingRule = {
      id: '1',
      name: 'Existing Rule',
      description: 'Existing Description',
      source: {
        tool: ToolType.GITHUB,
        metric: 'commits',
        operator: 'equals',
        value: '10'
      },
      target: {
        tool: ToolType.JIRA,
        metric: 'builds',
        action: 'trigger'
      }
    };

    render(
      <CorrelationRuleForm
        rule={existingRule}
        onAddRule={mockAddRule}
        onUpdateRule={mockUpdateRule}
        onClose={mockClose}
      />
    );

    await user.type(screen.getByLabelText(/nom de la règle/i), 'Updated Rule');
    await user.type(screen.getByLabelText(/description/i), 'Updated Description');

    await user.click(screen.getByRole('button', { name: /mettre à jour/i }));

    expect(mockUpdateRule).toHaveBeenCalled();
    expect(mockClose).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: /annuler/i }));

    expect(mockClose).toHaveBeenCalled();
  });

  it('updates source tool and metric when tool is changed', async () => {
    const user = userEvent.setup();
    renderForm();

    const sourceToolSelect = screen.getByRole('combobox', { name: /source/i });
    await user.click(sourceToolSelect);
    await user.click(screen.getByText('Jenkins'));

    const sourceMetricSelect = screen.getByRole('combobox', { name: /métrique/i });
    await user.click(sourceMetricSelect);
    expect(screen.getByText('builds')).toBeInTheDocument();
  });

  it('updates target tool and metric when tool is changed', async () => {
    const user = userEvent.setup();
    renderForm();

    const targetToolSelect = screen.getByRole('combobox', { name: /cible/i });
    await user.click(targetToolSelect);
    await user.click(screen.getByText('SonarQube'));

    const targetMetricSelect = screen.getByRole('combobox', { name: /métrique/i });
    await user.click(targetMetricSelect);
    expect(screen.getByText('quality_gate')).toBeInTheDocument();
  });
}); 