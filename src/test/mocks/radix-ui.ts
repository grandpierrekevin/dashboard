import { vi } from 'vitest'
import React from 'react'

vi.mock('@radix-ui/react-popover', () => ({
  Root: ({ children, ...props }: any) => <div data-slot="popover" {...props}>{children}</div>,
  Trigger: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Content: ({ children, ...props }: any) => <div role="tooltip" {...props}>{children}</div>,
  Portal: ({ children }: any) => <>{children}</>,
  Close: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Arrow: ({ ...props }: any) => <div {...props} />,
}))

vi.mock('@radix-ui/react-tooltip', () => ({
  Root: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Trigger: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Content: ({ children, ...props }: any) => <div role="tooltip" {...props}>{children}</div>,
  Portal: ({ children }: any) => <>{children}</>,
  Arrow: ({ ...props }: any) => <div {...props} />,
})) 