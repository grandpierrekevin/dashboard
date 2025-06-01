import { render, screen, fireEvent } from "@testing-library/react"
import { HelpTooltip } from "@/components/ui/help-tooltip"
import { vi } from "vitest"
import userEvent from "@testing-library/user-event"
import { useState } from "react"

// Mock de l'animation pour éviter les problèmes de timing
vi.mock('@radix-ui/react-tooltip', async () => {
  const actual = await vi.importActual('@radix-ui/react-tooltip');
  return {
    ...actual,
    TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    TooltipTrigger: ({ children, className }: { children: React.ReactNode, className?: string }) => (
      <button className={className} aria-label="help">{children}</button>
    ),
    TooltipContent: ({ children, className }: { children: React.ReactNode, className?: string }) => (
      <div role="tooltip" data-state="open" className={className}>{children}</div>
    ),
    TooltipPortal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    TooltipArrow: () => null,
  };
});

describe("HelpTooltip", () => {
  it("renders with tooltip content", async () => {
    render(<HelpTooltip content="Help text" />)
    const trigger = screen.getByRole("button", { name: "help" })
    fireEvent.mouseEnter(trigger)

    const tooltip = await screen.findByRole("tooltip")
    expect(tooltip).toHaveTextContent("Help text")
  })

  it("shows tooltip on hover and hides on mouse leave", async () => {
    render(<HelpTooltip content="Help text" />)
    const trigger = screen.getByRole("button", { name: "help" })

    // Show tooltip
    fireEvent.mouseEnter(trigger)
    const tooltip = await screen.findByRole("tooltip")
    expect(tooltip).toHaveTextContent("Help text")

    // Hide tooltip
    fireEvent.mouseLeave(trigger)
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  it("renders with custom className", () => {
    render(<HelpTooltip content="Help text" className="custom-class" />)
    const trigger = screen.getByRole("button", { name: "help" })
    expect(trigger).toHaveClass("custom-class")
  })

  it('should handle long content', async () => {
    const user = userEvent.setup();
    const longContent = 'This is a very long help text that should be properly displayed in the tooltip. It might contain multiple sentences and should be formatted correctly.';
    
    render(<HelpTooltip content={longContent} />);
    const icon = screen.getByRole('button', { name: /help/i });
    await user.hover(icon);
    
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent(longContent);
  });

  it('should handle HTML content', async () => {
    const user = userEvent.setup();
    const htmlContent = '<strong>Bold text</strong>';
    
    render(<HelpTooltip content={htmlContent} />);
    const icon = screen.getByRole('button', { name: /help/i });
    await user.hover(icon);
    
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toContainHTML('<strong>Bold text</strong>');
  });
}); 