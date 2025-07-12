# Shared Components Documentation

## Overview

This directory contains all reusable UI components, utilities, and types used across the application. The shared components follow a modern design system approach with consistent theming and responsive design.

## Directory Structure

```
shared/
├── components/
│   ├── ui/           # Core UI components (Button, Input, Card, etc.)
│   ├── layout/       # Layout components (Header, Footer)
│   ├── forms/        # Form-specific components (ImageUploader)
│   └── feedback/     # User feedback components (Notifications)
├── constants/        # Application constants and enums
├── types/           # TypeScript type definitions
└── index.ts         # Main exports
```

## UI Components

### Button

A versatile button component with multiple variants and loading state support.

```tsx
import { Button } from '../shared/components/ui'

// Primary button (default)
<Button variant="primary" onClick={handleClick}>
  Submit
</Button>

// Secondary button  
<Button variant="secondary">
  Cancel
</Button>

// Loading state
<Button variant="primary" loading={isLoading}>
  Save
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outlined' | 'text' | 'danger'
- `loading`: boolean - Shows loading spinner and disables button
- `fullWidth`: boolean - Makes button take full width
- All standard Material-UI ButtonProps

### Input

Enhanced text input with built-in password toggle and consistent styling.

```tsx
import { Input } from '../shared/components/ui'

// Basic input
<Input 
  label="Username"
  value={username}
  onChange={handleChange}
/>

// Password input with toggle
<Input 
  type="password"
  label="Password"
  showPasswordToggle
  value={password}
  onChange={handleChange}
/>
```

**Props:**
- `showPasswordToggle`: boolean - Adds password visibility toggle for password inputs
- `variant`: 'outlined' | 'filled' | 'standard'
- All standard Material-UI TextFieldProps

### Card

Flexible card component with hover effects and different visual styles.

```tsx
import { Card } from '../shared/components/ui'

// Elevated card (default)
<Card variant="elevated">
  Content here
</Card>

// Outlined card
<Card variant="outlined">
  Content here
</Card>

// Interactive card with hover effect
<Card variant="elevated" hover onClick={handleClick}>
  Clickable content
</Card>
```

**Props:**
- `variant`: 'elevated' | 'outlined' | 'flat'
- `hover`: boolean - Adds hover effects and cursor pointer

### Loading

Loading spinner component for different use cases.

```tsx
import { Loading } from '../shared/components/ui'

// Inline loading
<Loading size="small" inline />

// Full screen loading
<Loading size="large" fullScreen text="Loading..." />

// Page section loading
<Loading size="medium" text="Fetching data..." />
```

**Props:**
- `size`: 'small' | 'medium' | 'large'
- `text`: string - Optional loading text
- `fullScreen`: boolean - Covers entire viewport
- `inline`: boolean - Minimal padding for inline use

### Modal

Enhanced dialog component with consistent styling and animations.

```tsx
import { Modal } from '../shared/components/ui'

<Modal
  open={isOpen}
  onClose={handleClose}
  title="Confirm Action"
  actions={
    <>
      <Button variant="outlined" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleConfirm}>
        Confirm
      </Button>
    </>
  }
>
  <Typography>Are you sure you want to continue?</Typography>
</Modal>
```

**Props:**
- `title`: string - Modal title
- `actions`: ReactNode - Action buttons in footer
- `showCloseButton`: boolean - Shows X button in header (default: true)
- All standard Material-UI DialogProps

## Design Principles

### Consistency
- All components use consistent border radius (12px)
- Unified color scheme following Material-UI theme
- Consistent spacing and typography

### Responsiveness
- All components are fully responsive
- Mobile-first approach
- Proper touch targets for mobile devices

### Accessibility
- ARIA labels and roles where appropriate
- Keyboard navigation support
- Screen reader friendly

### Performance
- Lazy loading where applicable
- Optimized re-renders with React.memo
- Minimal bundle size impact

## Usage Guidelines

1. **Import from shared/components/ui**: Always import UI components from the main ui index
2. **Use TypeScript**: All components are fully typed with comprehensive prop interfaces
3. **Follow naming conventions**: Use descriptive prop names and consistent patterns
4. **Test integration**: Test shared components in your feature before committing

## Migration Benefits

✅ **Reduced Code Duplication**: Common UI patterns centralized  
✅ **Consistent Design**: Unified look and feel across all features  
✅ **Better Maintainability**: Single source of truth for UI components  
✅ **Enhanced Developer Experience**: Better TypeScript support and IntelliSense  
✅ **Improved Performance**: Optimized components with consistent patterns