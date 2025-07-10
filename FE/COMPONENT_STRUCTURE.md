# Front-end Component Structure

This document describes the refactored component structure for better organization and maintainability.

## Overview

The components are now organized in a hierarchical structure that promotes reusability and maintainability:

```
src/components/
├── layout/          # Layout components
├── common/          # Reusable common components
│   ├── ui/          # Basic UI components
│   ├── business/    # Business logic components
│   └── media/       # Media-related components
└── index.ts         # Barrel exports for easy importing
```

## Component Categories

### Layout Components (`components/layout/`)
Components responsible for page layout and structure:
- `Header.tsx` - Application header with navigation
- `Footer.tsx` - Application footer
- `MainLayout.tsx` - Main application layout wrapper
- `AuthLayout.tsx` - Authentication pages layout

### Common UI Components (`components/common/ui/`)
Basic, highly reusable UI components:
- `ProductQuantity.tsx` - Quantity selector with +/- buttons

### Business Components (`components/common/business/`)
Components containing business logic that can be reused across features:
- `ProductActions.tsx` - Add to cart functionality

### Media Components (`components/common/media/`)
Components for media handling and display:
- `ImageUploader.tsx` - File upload component with drag & drop
- `Banner.tsx` - Carousel/slider banner component

### Notification Components (`components/common/`)
- `NotificationDialog.tsx` - Notification dialog component
- `NotificationProvider.tsx` - Global notification context provider

## Usage Examples

### Importing Components

```typescript
// Individual imports
import { ProductQuantity } from 'components/common/ui'
import { ProductActions } from 'components/common/business'
import { Banner, ImageUploader } from 'components/common/media'
import { Header, Footer } from 'components/layout'

// Or import from the main barrel
import { 
  ProductQuantity, 
  ProductActions, 
  Banner, 
  Header 
} from 'components'
```

### Using Components

```typescript
// UI Component
<ProductQuantity 
  quantity={quantity} 
  setQuantity={setQuantity} 
/>

// Business Component
<ProductActions 
  variantId={selectedVariant} 
  quantity={quantity} 
/>

// Media Component
<Banner />

<ImageUploader
  onUpload={handleUpload}
  onDelete={handleDelete}
  maxFiles={5}
/>
```

## Benefits

1. **Clear Organization**: Components are categorized by their purpose and level of reusability
2. **Easy Navigation**: Developers can quickly find components based on their type
3. **Reusability**: Common components can be easily imported and used across different features
4. **Maintainability**: Changes to common components automatically propagate to all usage locations
5. **Scalability**: New components can be easily added to the appropriate category

## Migration Guide

Components have been moved from their original locations:

- `app/product/ProductQuantity.tsx` → `components/common/ui/ProductQuantity.tsx`
- `app/product/ProductActions.tsx` → `components/common/business/ProductActions.tsx`
- `app/home/Banner.tsx` → `components/common/media/Banner.tsx`
- `components/Header.tsx` → `components/layout/Header.tsx`
- `components/Footer.tsx` → `components/layout/Footer.tsx`
- `components/common/ImageUploader.tsx` → `components/common/media/ImageUploader.tsx`

All import statements have been updated accordingly.