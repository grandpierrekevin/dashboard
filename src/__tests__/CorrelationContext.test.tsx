import { render, screen, fireEvent, act, waitFor } from "@testing-library/react"
import { CorrelationProvider, useCorrelation } from "@/context/CorrelationContext"
import { vi } from "vitest"

const TestComponent = () => {
  const { rules, addRule, updateRule, deleteRule } = useCorrelation()
  return (
    <div>
      <button onClick={() => addRule({ name: "Test Rule", condition: "test" })}>
        Add Rule
      </button>
      <button onClick={() => updateRule(0, { name: "Updated Rule", condition: "test" })}>
        Update Rule
      </button>
      <button onClick={() => deleteRule(0)}>Delete Rule</button>
      <div data-testid="rules">{JSON.stringify(rules)}</div>
    </div>
  )
}

describe("CorrelationContext", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("adds a rule", async () => {
    render(
      <CorrelationProvider>
        <TestComponent />
      </CorrelationProvider>
    )

    await act(async () => {
      fireEvent.click(screen.getByText("Add Rule"))
    })

    await waitFor(() => {
      const rulesElement = screen.getByTestId("rules")
      const rules = JSON.parse(rulesElement.textContent || "[]")
      expect(rules[0].name).toBe("Test Rule")
    })
  })

  it("updates a rule", async () => {
    render(
      <CorrelationProvider>
        <TestComponent />
      </CorrelationProvider>
    )

    await act(async () => {
      fireEvent.click(screen.getByText("Add Rule"))
    })

    await act(async () => {
      fireEvent.click(screen.getByText("Update Rule"))
    })

    await waitFor(() => {
      const rulesElement = screen.getByTestId("rules")
      const rules = JSON.parse(rulesElement.textContent || "[]")
      expect(rules[0].name).toBe("Updated Rule")
    })
  })

  it("deletes a rule", async () => {
    render(
      <CorrelationProvider>
        <TestComponent />
      </CorrelationProvider>
    )

    await act(async () => {
      fireEvent.click(screen.getByText("Add Rule"))
    })

    await act(async () => {
      fireEvent.click(screen.getByText("Delete Rule"))
    })

    await waitFor(() => {
      const rulesElement = screen.getByTestId("rules")
      const rules = JSON.parse(rulesElement.textContent || "[]")
      expect(rules).toHaveLength(0)
    })
  })

  it("loads rules from localStorage", async () => {
    const savedRules = [{ name: "Saved Rule", condition: "test" }]
    localStorage.setItem("correlationRules", JSON.stringify(savedRules))

    render(
      <CorrelationProvider>
        <TestComponent />
      </CorrelationProvider>
    )

    await waitFor(() => {
      const rulesElement = screen.getByTestId("rules")
      const rules = JSON.parse(rulesElement.textContent || "[]")
      expect(rules[0].name).toBe("Saved Rule")
    })
  })
}) 