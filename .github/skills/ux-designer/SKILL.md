---
name: ux-designer
compatibility: Antigravity, Claude Code, GitHub Copilot
description: UI/UX flows and design systems. Use for user experience design tasks.
triggers:
  - "UX design"
  - "user experience"
  - "design system"
  - "user flow"
---

# UX Designer Skill

## Identity

You are a UX design specialist focused on creating intuitive user experiences and design systems.

## When to Use

- Designing user flows
- Creating design systems
- Improving user experience
- Accessibility improvements

## User Research Framework

```markdown
## User Research

### User Personas

| Persona     | Goals                 | Pain Points              |
| ----------- | --------------------- | ------------------------ |
| Power User  | Efficiency, shortcuts | Too many clicks          |
| New User    | Guidance, simplicity  | Complex interface        |
| Mobile User | Quick access          | Small screen limitations |

### User Journey Map

1. Discovery → 2. Onboarding → 3. Core Task → 4. Completion → 5. Return
```

## Design System Components

### Design Tokens

```css
/* tokens.css */
:root {
  /* Colors */
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;

  --color-neutral-50: #fafafa;
  --color-neutral-500: #737373;
  --color-neutral-900: #171717;

  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Typography */
  --font-family: system-ui, -apple-system, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* Borders */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
}
```

### Component Patterns

```markdown
## Button Component

### Variants

| Variant   | Usage               | Style                |
| --------- | ------------------- | -------------------- |
| Primary   | Main actions        | Solid, accent color  |
| Secondary | Alternative actions | Outline, neutral     |
| Ghost     | Tertiary actions    | No border, text only |
| Danger    | Destructive actions | Red accent           |

### States

- Default: Normal appearance
- Hover: Slight color change
- Focus: Focus ring for accessibility
- Active: Pressed appearance
- Disabled: Reduced opacity, no interaction

### Sizes

| Size   | Padding   | Font Size |
| ------ | --------- | --------- |
| Small  | 8px 16px  | 14px      |
| Medium | 12px 24px | 16px      |
| Large  | 16px 32px | 18px      |
```

## User Flow Templates

### Onboarding Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Welcome   │───▶│   Sign Up   │───▶│   Profile   │
│   Screen    │    │   Form      │    │   Setup     │
└─────────────┘    └─────────────┘    └─────────────┘
                          │                    │
                          ▼                    ▼
                   ┌─────────────┐    ┌─────────────┐
                   │   Login     │    │   Tutorial  │
                   │   Screen    │    │   Optional  │
                   └─────────────┘    └─────────────┘
```

### Checkout Flow

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  Cart    │──▶│ Shipping │──▶│ Payment  │──▶│  Confirm │
│ Review   │   │  Info    │   │  Info    │   │ Success  │
└──────────┘   └──────────┘   └──────────┘   └──────────┘
     │              │              │
     ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│ Continue │   │ Back to  │   │ Edit     │
│ Shopping │   │  Cart    │   │ Payment  │
└──────────┘   └──────────┘   └──────────┘
```

## Accessibility Guidelines

```markdown
## WCAG 2.1 Compliance

### Perceivable

- [ ] Text alternatives for images
- [ ] Captions for videos
- [ ] Color contrast ratio 4.5:1 minimum
- [ ] Resizable text up to 200%

### Operable

- [ ] Keyboard navigation support
- [ ] Focus indicators visible
- [ ] Skip navigation links
- [ ] No keyboard traps

### Understandable

- [ ] Clear and consistent navigation
- [ ] Form labels and instructions
- [ ] Error messages are helpful
- [ ] Language attribute set

### Robust

- [ ] Valid HTML
- [ ] ARIA landmarks used
- [ ] Screen reader tested
- [ ] Works without JavaScript (progressive enhancement)
```

## Tips

- Design for accessibility from the start
- Use consistent patterns across the app
- Test with real users
- Consider edge cases
- Document design decisions
