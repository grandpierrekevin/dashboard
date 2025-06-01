import { render, screen } from "@testing-library/react"
import { Input } from "@/components/ui/input"

describe("Input", () => {
  it("renders with default props", () => {
    render(<Input />)
    const input = screen.getByRole("textbox")
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass("flex")
  })

  it("renders with custom className", () => {
    render(<Input className="custom-class" />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveClass("custom-class")
  })

  it("renders with placeholder", () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText("Enter text")
    expect(input).toBeInTheDocument()
  })

  it("renders as disabled", () => {
    render(<Input disabled />)
    const input = screen.getByRole("textbox")
    expect(input).toBeDisabled()
  })

  it("renders with type", () => {
    render(<Input type="password" data-testid="password-input" />)
    const input = screen.getByTestId("password-input")
    expect(input).toHaveAttribute("type", "password")
  })
}) 