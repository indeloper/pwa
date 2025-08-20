# Styles Structure

This directory contains all the styles for the PWA application.

## Structure

```
src/assets/styles/
├── index.css              # Main styles index
├── components/            # Component-specific styles
│   ├── index.css         # Components styles index
│   ├── button.css        # Button component styles
│   └── ...               # Other component styles
└── README.md             # This file
```

## Usage

### Adding new component styles

1. Create a new CSS file in `components/` directory (e.g., `input.css`)
2. Add the import to `components/index.css`
3. The styles will be automatically included in the main bundle

### Example

```css
/* components/input.css */
.custom-input {
  @apply border border-gray-300 rounded px-3 py-2;
}
```

```css
/* components/index.css */
@import './button.css';
@import './input.css';  /* Add this line */
```

## CSS Variables

The project uses CSS custom properties for consistent theming:

### Button Colors
- `--btn-primary`: Primary brand color (teal)
- `--btn-secondary`: Secondary brand color (light gray with dark text)
- `--btn-info`: Information color (blue)
- `--btn-success`: Success color (green)
- `--btn-warning`: Warning color (orange)
- `--btn-error`: Error color (red)

Each color has hover and active states (e.g., `--btn-primary-hover`, `--btn-primary-active`)

## Button Component

The button component uses a modern BEM-like naming convention:

### Base Classes
- `.btn` - Base button styles
- `.btn--{variant}` - Button variants (filled, outlined, text, dashed)
- `.btn--{severity}` - Color severity (primary, secondary, info, success, warning, error)
- `.btn--{size}` - Size variants (xs, sm, md, lg, xl)

### Modifier Classes
- `.btn--icon-only` - Icon-only button
- `.btn--loading` - Loading state
- `.btn--fluid` - Full-width button
- `.btn--rounded-{type}` - Border radius (default, full, none)

### Element Classes
- `.btn__spinner` - Loading spinner
- `.btn__content` - Content wrapper

### Usage Examples

```vue
<!-- Basic button -->
<Button variant="filled" severity="primary">Click me</Button>

<!-- Outlined button with icon -->
<Button variant="outlined" severity="secondary" icon="→">
  Launch
</Button>

<!-- Secondary button (light gray with dark text) -->
<Button variant="filled" severity="secondary">
  Secondary
</Button>

<!-- Text button -->
<Button variant="text" severity="info">Info</Button>

<!-- Icon only button -->
<Button iconOnly>🔍</Button>

<!-- Loading button -->
<Button loading>Processing...</Button>

<!-- Full width button -->
<Button fluid>Full Width</Button>
```

## Tailwind CSS

All styles use Tailwind CSS utilities. The `@apply` directive is used to compose utility classes into custom CSS classes.

## Best Practices

1. **Component isolation**: Keep component styles in separate files
2. **CSS variables**: Use CSS custom properties for theming
3. **Tailwind utilities**: Leverage Tailwind's utility classes
4. **Naming convention**: Use BEM-like naming for component classes
5. **Responsive design**: Use Tailwind's responsive prefixes
6. **Accessibility**: Include focus states and ARIA attributes
7. **Performance**: Minimize CSS specificity and avoid deep nesting
