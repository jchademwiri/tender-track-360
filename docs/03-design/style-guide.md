# UI/UX Style Guide

## Brand Identity

### Logo
- Primary logo should be used whenever possible
- Minimum clear space of 1x logo height on all sides
- Minimum size of 40px height for digital applications
- Logo should be placed in the top-left corner of the application

### Color Palette

#### Primary Colors
- **Primary Blue**: `#1E40AF` 
  - Use for primary buttons, links, and key actionable elements
  - RGB: 30, 64, 175
  - Text on this color should be white

- **Secondary Blue**: `#2563EB`
  - Use for hover states, secondary elements
  - RGB: 37, 99, 235
  - Text on this color should be white

- **Accent Gold**: `#F59E0B`
  - Use for highlighting important elements, notifications, alerts
  - RGB: 245, 158, 11
  - Text on this color should be black

#### Neutral Colors
- **Dark Gray**: `#1F2937` 
  - Use for main text, headers
  - RGB: 31, 41, 55

- **Medium Gray**: `#4B5563` 
  - Use for secondary text, labels
  - RGB: 75, 85, 99

- **Light Gray**: `#9CA3AF` 
  - Use for placeholder text, disabled elements
  - RGB: 156, 163, 175

- **Extra Light Gray**: `#F3F4F6` 
  - Use for backgrounds, borders, dividers
  - RGB: 243, 244, 246

#### Status Colors
- **Success**: `#10B981` 
  - Use for success messages, completed tasks
  - RGB: 16, 185, 129

- **Warning**: `#F59E0B` 
  - Use for warnings, approaching deadlines
  - RGB: 245, 158, 11

- **Error**: `#EF4444` 
  - Use for error messages, critical deadlines
  - RGB: 239, 68, 68

- **Info**: `#3B82F6` 
  - Use for informational messages
  - RGB: 59, 130, 246

### Typography

#### Font Family
- **Primary Font**: Inter
  - Sans-serif, clean and professional
  - To be used for all interface text

- **Monospace Font**: JetBrains Mono
  - To be used for code, reference numbers, or technical data

#### Font Sizes
- **Header 1**: 32px (2rem), Bold, Line Height: 40px (2.5rem)
- **Header 2**: 24px (1.5rem), Bold, Line Height: 32px (2rem)
- **Header 3**: 20px (1.25rem), Semibold, Line Height: 28px (1.75rem)
- **Header 4**: 18px (1.125rem), Semibold, Line Height: 24px (1.5rem)
- **Body Large**: 16px (1rem), Regular, Line Height: 24px (1.5rem)
- **Body Default**: 14px (0.875rem), Regular, Line Height: 20px (1.25rem)
- **Body Small**: 12px (0.75rem), Regular, Line Height: 16px (1rem)
- **Labels/Captions**: 12px (0.75rem), Medium, Line Height: 16px (1rem)

#### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## Components

### Buttons

#### Primary Button
- Background: Primary Blue
- Text: White
- Border: None
- Border Radius: 6px
- Padding: 8px 16px (small), 10px 20px (medium), 12px 24px (large)
- Font Weight: Medium
- Hover State: Secondary Blue background
- Disabled State: 40% opacity

#### Secondary Button
- Background: White
- Text: Primary Blue
- Border: 1px solid Primary Blue
- Border Radius: 6px
- Padding: Same as Primary Button
- Hover State: Light blue background (#EFF6FF)
- Disabled State: 40% opacity

#### Tertiary Button
- Background: Transparent
- Text: Primary Blue
- Border: None
- Padding: Same as Primary Button
- Hover State: Light blue background (#EFF6FF)
- Disabled State: 40% opacity

#### Danger Button
- Background: Error Red
- Text: White
- Use cases: Delete actions, permanent removals

### Form Elements

#### Text Input
- Height: 40px
- Border: 1px solid Light Gray
- Border Radius: 6px
- Padding: 8px 12px
- Focus State: 2px border Primary Blue, subtle box shadow
- Error State: 1px border Error Red
- Placeholder: Light Gray text

#### Select Dropdown
- Same styling as Text Input for consistency 
- Dropdown icon: Chevron down, Medium Gray
- Options menu: White background, subtle shadow
- Selected option: Light blue background

#### Checkbox
- Size: 16px × 16px
- Border: 1px solid Light Gray
- Border Radius: 4px
- Checked State: Primary Blue background, white checkmark

#### Radio Button
- Size: 16px × 16px
- Border: 1px solid Light Gray
- Checked State: White circle with Primary Blue outer ring

#### Form Labels
- Font Weight: Medium
- Color: Dark Gray
- Position: Above input fields
- Required Fields: Asterisk (*) in Error Red

#### Helper Text
- Font Size: Body Small
- Color: Medium Gray (default), Error Red (error)
- Position: Below input field

### Cards

#### Standard Card
- Background: White
- Border: None
- Border Radius: 8px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Padding: 16px 20px

#### Tender Card
- Extends Standard Card
- Status Indicator: Left color bar or top corner badge
- Actions: Ellipsis menu in top right
- Footer: Key metadata and action buttons

#### Dashboard Card
- Extends Standard Card
- Header: Card title, optional icon
- Body: Key statistics or data visualization
- Footer: Optional link to detailed view

### Tables

#### Standard Table
- Header Background: Extra Light Gray
- Header Text: Dark Gray, Medium weight
- Row Border: 1px solid Extra Light Gray
- Row Hover: Subtle light gray background
- Cell Padding: 12px 16px

#### Interactive Elements
- Sortable Headers: Indicated by up/down arrows
- Pagination: Bottom right, with page numbers
- Row Selection: Checkbox in first column when needed
- Row Actions: Visible on hover or in dedicated column

### Navigation

#### Main Navigation
- Background: White or Primary Blue
- Active Item: Highlighted with accent color or background change
- Icons: Used with labels for better recognition
- Mobile: Collapsible into hamburger menu

#### Sidebar Navigation
- Width: 240px desktop, collapsible on smaller screens
- Background: White or Primary Dark
- Section Headers: All caps, smaller text
- Active State: Left border accent, background change

#### Breadcrumbs
- Separator: Chevron icon
- Color: Medium Gray
- Current Page: Dark Gray, no link

### Notifications & Alerts

#### Toast Notifications
- Position: Top right
- Width: 300px
- Animation: Slide in, fade out
- Duration: 5 seconds default
- Types: Success, Error, Warning, Info with matching status colors

#### Modal Alerts
- Background: White
- Border Radius: 8px
- Title: Header 3 size, centered
- Actions: Aligned to the right, primary action rightmost
- Overlay: Dark background with 50% opacity

#### Inline Alerts
- Border Left: 4px solid status color
- Background: Light version of status color
- Icon: Matching status color
- Padding: 12px 16px

### Data Visualization

#### Charts
- Color Scheme: Extended from brand colors
- Font: Same as UI (Inter)
- Tooltips: Follow card styling
- Empty State: Informative message instead of blank chart

#### Status Indicators
- Colors: Use status colors consistently
- Shapes: Consider accessibility (don't rely only on color)
- Size: Appropriate for context (16px default)

## Responsive Design

### Breakpoints
- **Small**: Up to 640px (mobile)
- **Medium**: 641px to 768px (large mobile/small tablet)
- **Large**: 769px to 1024px (tablet/small desktop)
- **Extra Large**: 1025px and above (desktop)

### Layout Grid
- 12-column grid system
- Gutters: 16px (mobile), 24px (tablet), 32px (desktop)
- Container max-width: 1280px centered

### Component Adaptations
- **Navigation**: Switches to hamburger menu below 768px
- **Tables**: Horizontal scroll or card layout on mobile
- **Multi-column Forms**: Stack vertically on mobile
- **Buttons**: Full width on small screens where appropriate

## Accessibility

### Contrast Ratios
- Text on backgrounds must maintain minimum ratios:
  - Normal text: 4.5:1
  - Large text: 3:1
  - UI components and graphics: 3:1

### Focus States
- All interactive elements must have visible focus indicators
- Custom focus styling: 2px outline in Secondary Blue

### Screen Readers
- All images require alt text
- Form elements must have associated labels
- ARIA attributes used where appropriate

### Keyboard Navigation
- All interactive elements must be accessible via keyboard
- Logical tab order following visual layout
- Visible focus indicators for keyboard navigation

## Interaction Patterns

### Loading States
- Skeleton screens for content loading
- Spinner for actions/submissions
- Button loading state: Disabled with spinner

### Empty States
- Informative message
- Clear action to populate (when applicable)
- Illustration to visually communicate emptiness

### Transitions & Animations
- Duration: 200-300ms for most UI transitions
- Easing: Ease-out for most transitions
- Purpose: Enhance understanding of state changes
- Respect reduced motion preferences

## Implementation Guidelines

### CSS Framework
- Tailwind CSS as primary styling solution
- Custom components extended from Tailwind primitives
- Consistent naming convention for custom classes

### Component Library
- Built on React components
- Storybook documentation for all components
- Proper TypeScript typing

### Design Token Implementation
- Colors, typography, spacing as CSS variables
- Tailwind theme extension for consistency

### Icon System
- Based on Lucide/Feather icons
- Consistent size and styling
- Accessibility considerations (labels for icon-only controls)

*This document is part of the Tender Track 360 project documentation.*