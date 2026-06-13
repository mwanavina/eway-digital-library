# Dark Mode Theme Switcher - Documentation

## Overview

The MUBAS Digital Library now includes a comprehensive dark mode implementation with automatic theme detection and persistent user preferences.

## Features

### 1. **Automatic Theme Detection**
- Detects user's system preference using `prefers-color-scheme` media query
- If no preference is saved, defaults to system theme
- User preferences are persisted in localStorage

### 2. **Theme Switcher Button**
- Located in the header next to Settings and User Profile
- Shows moon icon (🌙) in light mode - click to switch to dark
- Shows sun icon (☀️) in dark mode - click to switch to light
- Responsive design: icon only on mobile, tooltip available on hover

### 3. **Persistent Storage**
- Theme preference saved to `localStorage` with key `"theme"`
- Persists across browser sessions
- Survives page reloads and navigation

### 4. **Smooth Transitions**
- CSS variables enable instant theme switching
- No flash of wrong theme on page load
- Optimized for performance

## Technical Implementation

### File Structure

```
providers/
  └── theme-provider.tsx        # Theme context provider component
components/
  └── theme-switcher.tsx        # Theme toggle button
app/
  ├── layout.tsx                # Root layout with ThemeProvider wrapper
  └── globals.css               # CSS variables for both themes
```

### CSS Variables

The system uses CSS custom properties defined in `globals.css`:

**Light Mode (Default)**
```css
:root {
  --background: oklch(1 0 0);           /* White */
  --foreground: oklch(0.145 0 0);       /* Dark gray/black */
  --primary: #1782C5;                   /* MUBAS Blue */
  --muted: oklch(0.97 0 0);             /* Light gray */
  --border: oklch(0.922 0 0);           /* Very light gray */
  /* ... more colors ... */
}
```

**Dark Mode**
```css
.dark {
  --background: oklch(0.145 0 0);       /* Dark gray/black */
  --foreground: oklch(0.985 0 0);       /* White */
  --primary: oklch(0.985 0 0);          /* White text */
  --muted: oklch(0.269 0 0);            /* Medium dark gray */
  --border: oklch(0.269 0 0);           /* Dark gray border */
  /* ... more colors ... */
}
```

### Component Integration

#### ThemeProvider (`providers/theme-provider.tsx`)
- Client component that handles theme initialization
- Checks localStorage for saved theme
- Falls back to system preference if not found
- Applies theme by adding/removing "dark" class to `<html>` element
- Exposes `__toggleTheme` and `__theme` to window object

#### ThemeSwitcher (`components/theme-switcher.tsx`)
- Client component with toggle button
- Reads current theme from localStorage
- Updates theme on click
- Shows appropriate icon (Sun/Moon)
- Includes accessibility attributes (aria-label, title)

#### Layout Integration (`app/layout.tsx`)
```tsx
<ThemeProvider>
  {children}
</ThemeProvider>
```

## How It Works

### 1. **On Page Load**
```
Browser loads → ThemeProvider mounts
   ↓
Check localStorage for 'theme'
   ↓
If not found, check system preference (prefers-color-scheme)
   ↓
Apply theme to document.documentElement
   ↓
Component renders with correct colors
```

### 2. **On Theme Toggle**
```
User clicks ThemeSwitcher button
   ↓
Toggle between 'light' and 'dark'
   ↓
Save new theme to localStorage
   ↓
Add/remove 'dark' class on <html>
   ↓
CSS recomputes all color values
   ↓
UI updates instantly
```

## Usage

### For Users
1. Look for the sun/moon icon in the top-right header
2. Click to toggle between light and dark modes
3. Theme preference is automatically saved
4. Preference persists across browser sessions

### For Developers

#### Adding Components with Dark Mode Support
```tsx
// Use semantic color classes from globals.css
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">
    Click me
  </button>
</div>
```

#### Accessing Current Theme (in Client Components)
```tsx
'use client';

const [theme, setTheme] = useState<'light' | 'dark'>('light');

useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme as 'light' | 'dark' || 'light');
}, []);
```

#### Toggling Theme Programmatically
```tsx
const toggleTheme = () => {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  
  if (isDark) {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
};
```

## Color Scheme Details

### Light Mode (Default)
| Element | Color | CSS Variable |
|---------|-------|--------------|
| Background | White | `--background` |
| Text | Dark Gray | `--foreground` |
| Primary | MUBAS Blue (#1782C5) | `--primary` |
| Secondary | Gold (#EDD899) | `--secondary` |
| Borders | Very Light Gray | `--border` |
| Muted | Light Gray | `--muted` |
| Accent | Dark Blue (#1F2557) | `--accent` |

### Dark Mode
| Element | Color | CSS Variable |
|---------|-------|--------------|
| Background | Dark Gray/Black | `--background` |
| Text | White | `--foreground` |
| Primary | White | `--primary` |
| Secondary | Dark Gray | `--secondary` |
| Borders | Dark Gray | `--border` |
| Muted | Medium Dark Gray | `--muted` |
| Accent | Medium Blue | `--accent` |

## Accessibility Features

- **WCAG 2.1 Compliant**: Proper contrast ratios in both themes
- **Respects User Preference**: Honors system theme choice
- **Keyboard Accessible**: Theme switcher is fully keyboard navigable
- **Screen Reader Friendly**: Proper ARIA labels on toggle button
- **Hover/Focus States**: Clear visual feedback for interactive elements

## Performance Considerations

1. **No Flash of Wrong Theme**
   - ThemeProvider initializes before children mount
   - Theme class applied immediately on page load

2. **Minimal Repaints**
   - Uses CSS variables instead of repainting elements
   - Only one class toggle on `<html>`

3. **localStorage Optimization**
   - Only reads on mount
   - Single write per toggle
   - No polling or watchers

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **CSS Support**: CSS Custom Properties (100% supported)
- **localStorage**: 100% browser support
- **prefers-color-scheme**: All modern browsers

## Troubleshooting

### Theme doesn't persist across sessions
- Check if localStorage is enabled in browser
- Check browser privacy settings aren't blocking localStorage
- Clear browser cache and try again

### Dark mode colors look off
- Verify globals.css dark mode variables are defined
- Check if `dark` class is being added to `<html>` element
- Inspect DevTools to confirm class is present

### Toggle button not working
- Verify ThemeProvider wraps children in layout.tsx
- Check browser console for JavaScript errors
- Verify localStorage API is accessible

## Future Enhancements

1. **System Sync Option**
   - Add toggle to follow system preference always
   
2. **Theme Customization**
   - Allow users to pick custom color schemes
   - Save custom palettes

3. **Auto Dark Mode Schedule**
   - Enable dark mode at sunset
   - Disable at sunrise

4. **More Themes**
   - Add additional theme options beyond light/dark
   - High contrast mode support

## Files Modified

- `app/layout.tsx` - Added ThemeProvider wrapper
- `app/globals.css` - Dark mode CSS variables
- `components/header.tsx` - Added ThemeSwitcher button
- `app/page.tsx` - Updated background color class

## Files Created

- `providers/theme-provider.tsx` - Theme provider component
- `components/theme-switcher.tsx` - Theme toggle button

## Related Documentation

- [System Description](./SYSTEM_DESCRIPTION.md)
- [Architecture](./ARCHITECTURE.md)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs/dark-mode)
