# Accessibility Documentation

## Overview

This website is committed to providing an accessible experience for all users, including those using assistive technologies. We follow the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA.

## WCAG 2.2 Compliance

### Level A & AA Compliance

This website implements the following accessibility features to meet WCAG 2.2 Level AA standards:

#### Perceivable

- **Text Alternatives**: All images include descriptive alt text or are marked as decorative
- **Time-based Media**: Captions and transcripts provided where applicable
- **Adaptable Content**: Semantic HTML structure with proper heading hierarchy
- **Distinguishable**: Minimum 4.5:1 color contrast ratio for normal text, 3:1 for large text
- **High Contrast Mode**: Full support for Windows High Contrast Mode via forced-colors media query

#### Operable

- **Keyboard Accessible**: All functionality available via keyboard
- **Skip Links**: Quick navigation to main content, navigation, search, and footer
- **No Keyboard Traps**: Users can navigate away from all components using standard keyboard navigation
- **Timing**: No time limits on user interactions
- **Seizures**: No content flashes more than three times per second
- **Navigation**: Multiple ways to locate pages (navigation, search, sitemap)
- **Focus Visible**: Clear focus indicators with 2px outline and offset

#### Understandable

- **Readable**: Language specified in HTML (`lang="en"`)
- **Predictable**: Consistent navigation and identification across pages
- **Input Assistance**: Labels and instructions for all form fields
- **Error Identification**: Clear error messages with suggestions for correction
- **Error Prevention**: Confirmation required for important actions

#### Robust

- **Compatible**: Valid HTML5 and ARIA markup
- **Name, Role, Value**: All interactive components have accessible names and roles

## Keyboard Navigation

### Global Shortcuts

| Shortcut       | Action                                         |
| -------------- | ---------------------------------------------- |
| `Tab`          | Navigate forward through interactive elements  |
| `Shift + Tab`  | Navigate backward through interactive elements |
| `Enter`        | Activate links and buttons                     |
| `Space`        | Activate buttons and checkboxes                |
| `Escape`       | Close modals and dialogs                       |
| `Cmd/Ctrl + K` | Open command palette                           |
| `Cmd/Ctrl + /` | Show keyboard shortcuts help                   |
| `T`            | Toggle theme (dark/light mode)                 |

### Skip Links

Press `Tab` on page load to access skip links:

- Skip to main content
- Skip to navigation
- Skip to search
- Skip to footer

### Navigation

- Use `Tab` to move through navigation links
- Press `Enter` to follow a link
- Mobile menu: `Tab` to menu button, `Enter` to open/close

### Forms

- `Tab` to move between form fields
- `Enter` to submit forms
- Form validation errors are announced to screen readers

## Screen Reader Support

### Tested With

- **NVDA** (Windows) - Latest version
- **JAWS** (Windows) - Latest version
- **VoiceOver** (macOS/iOS) - Latest version
- **TalkBack** (Android) - Latest version

### ARIA Implementation

- **Landmarks**: Proper use of `<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<aside>`
- **Live Regions**: Dynamic content changes announced with `aria-live`
- **Labels**: All interactive elements have accessible names via `aria-label` or `aria-labelledby`
- **States**: Current page indicated with `aria-current="page"`
- **Descriptions**: Additional context provided via `aria-describedby` where needed

### Structured Content

- **Headings**: Logical heading hierarchy (h1 → h2 → h3)
- **Lists**: Semantic lists for navigation and content groups
- **Tables**: Proper table headers and captions where applicable
- **Forms**: Labels associated with form controls

## Visual Design

### Color Contrast

All text meets WCAG AA standards:

- Normal text (< 18pt): 4.5:1 minimum contrast ratio
- Large text (≥ 18pt): 3:1 minimum contrast ratio
- UI components: 3:1 minimum contrast ratio

### Focus Indicators

- **Visible**: 2px solid outline with 2px offset
- **High Contrast**: Uses system Highlight color in forced-colors mode
- **Keyboard Only**: Focus indicators only shown for keyboard navigation

### Reduced Motion

Users who prefer reduced motion (via `prefers-reduced-motion: reduce`) will experience:

- Instant scrolling instead of smooth scrolling
- Minimal animation durations (0.01ms)
- No decorative animations

### Dark Mode

- Full dark mode support with proper contrast ratios
- Respects system preference (`prefers-color-scheme`)
- Manual toggle available via theme switcher

## Known Issues

Currently, there are no known accessibility issues. If you discover any problems, please [report them](https://github.com/M-F-Tushar/Blog-Website/issues).

## Testing

### Automated Testing

We use the following tools for automated accessibility testing:

- **axe-core**: Automated WCAG 2.2 compliance testing
- **Playwright**: End-to-end keyboard navigation testing
- **Lighthouse**: Google's accessibility audit tool

Run accessibility tests:

```bash
npm run test:e2e -- accessibility.spec.ts
```

### Manual Testing

We perform manual testing with:

- Keyboard-only navigation
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Browser zoom testing (up to 200%)
- High contrast mode testing
- Color blindness simulation

## Reporting Issues

If you encounter any accessibility barriers, please let us know:

1. **GitHub Issues**: [Report an issue](https://github.com/M-F-Tushar/Blog-Website/issues)
2. **Email**: Contact via the [contact form](/contact)

Please include:

- Description of the issue
- What you were trying to do
- Your assistive technology (if applicable)
- Browser and operating system

## Continuous Improvement

We are committed to continuously improving accessibility:

- Regular audits with automated tools
- User testing with people who use assistive technologies
- Staying updated with WCAG guidelines
- Implementing user feedback

## Resources

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [WebAIM](https://webaim.org/)
- [A11Y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

_Last updated: December 2024_
_WCAG Version: 2.2 Level AA_
