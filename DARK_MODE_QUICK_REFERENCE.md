# Dark Mode - Quick Reference Guide

## For End Users

### How to Switch Themes
1. Look at the top-right corner of the header
2. Click the **moon icon** (🌙) to switch to dark mode
3. Click the **sun icon** (☀️) to switch back to light mode
4. Your preference is automatically saved

### Features
- ✅ Automatically detects your system preference on first visit
- ✅ Remembers your choice across sessions
- ✅ Instant theme switching with no page reload
- ✅ Optimized for eye comfort in low light environments

---

## For Developers

### Quick Implementation

**1. Apply Theme to New Components**
```tsx
<div className="bg-background text-foreground border border-border">
  <p className="text-muted-foreground">Use semantic colors</p>
</div>
```

**2. Use Design System Colors**
```css
/* Instead of hardcoding colors like this: */
background: white;
color: black;

/* Use CSS variables: */
background: var(--background);
color: var(--foreground);
```

### Available CSS Variables

**Background & Text**
- `--background` / `--foreground`
- `--card` / `--card-foreground`
- `--popover` / `--popover-foreground`

**Interactive**
- `--primary` / `--primary-foreground`
- `--secondary` / `--secondary-foreground`
- `--accent` / `--accent-foreground`

**Utility**
- `--muted` / `--muted-foreground`
- `--border` / `--input`
- `--destructive` / `--destructive-foreground`

**Charts**
- `--chart-1` through `--chart-5`

**Sidebar** (Admin)
- `--sidebar` / `--sidebar-foreground`
- `--sidebar-primary` / `--sidebar-primary-foreground`
- `--sidebar-accent` / `--sidebar-accent-foreground`

### How Dark Mode Works

1. **On Load**: ThemeProvider checks localStorage → if empty, uses system preference
2. **Storage**: Theme saved as `localStorage.theme` (value: "light" or "dark")
3. **Application**: "dark" class added to `<html>` when dark mode active
4. **Styles**: CSS variables switch based on `.dark` selector

### File Locations

| File | Purpose |
|------|---------|
| `providers/theme-provider.tsx` | Theme initialization & storage |
| `components/theme-switcher.tsx` | Toggle button |
| `app/globals.css` | Color variables |
| `app/layout.tsx` | Provider wrapper |

### Testing Dark Mode

**In Browser Console:**
```js
// Check current theme
localStorage.getItem('theme')

// Force dark mode
document.documentElement.classList.add('dark')
localStorage.setItem('theme', 'dark')

// Force light mode
document.documentElement.classList.remove('dark')
localStorage.setItem('theme', 'light')
```

### Common Patterns

**Conditional Styling**
```tsx
// DON'T: Use hardcoded colors
className="bg-white dark:bg-gray-900"

// DO: Use CSS variables
className="bg-background text-foreground"
```

**Icons in Dark Mode**
```tsx
{theme === 'light' ? (
  <Moon size={20} className="text-white" />
) : (
  <Sun size={20} className="text-yellow-300" />
)}
```

**Detecting Theme Change**
```tsx
useEffect(() => {
  const theme = localStorage.getItem('theme');
  setTheme(theme === 'dark' ? 'dark' : 'light');
}, []);

// Listen to storage changes (from other tabs)
useEffect(() => {
  const handleStorageChange = () => {
    setTheme(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
  };
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

---

## Color Reference

### Light Mode
```
Background: White (#FFFFFF)
Text: Dark Gray (#1C1C1C)
Primary: MUBAS Blue (#1782C5)
Secondary: Gold (#EDD899)
Accent: Dark Blue (#1F2557)
Borders: Light Gray (#F5F5F5)
```

### Dark Mode
```
Background: Dark (#1A1A1A)
Text: White (#FAFAFA)
Primary: White/Light
Secondary: Dark Gray
Accent: Medium Blue
Borders: Dark Gray (#333333)
```

---

## Accessibility Notes

✓ WCAG 2.1 AA compliant in both modes
✓ Minimum 4.5:1 contrast ratio for text
✓ Keyboard navigable theme switcher
✓ Respects user system preferences
✓ No flashing or jarring transitions

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Theme not saving | Check if localStorage is enabled |
| Dark mode colors wrong | Verify `.dark` class on `<html>` |
| Button not responding | Clear cache, reload page |
| Flash of wrong theme | Ensure ThemeProvider wraps children |

---

## Related Files

- Full Documentation: [DARK_MODE.md](./DARK_MODE.md)
- System Overview: [SYSTEM_DESCRIPTION.md](./SYSTEM_DESCRIPTION.md)
- Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)
