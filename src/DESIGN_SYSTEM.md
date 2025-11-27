# HABTA Design System

## 🎨 Brand Colors

```css
--primary: #0A3654          /* Navy Blue - Main brand color */
--primary-hover: #083044    /* Darker navy for hover states */
--primary-light: #0e4768    /* Lighter navy for accents */

--secondary: #5A7C99        /* Medium Blue */
--secondary-hover: #4a6a82  /* Darker medium blue */
--secondary-light: #6e8da8  /* Lighter medium blue */

--accent-1: #e8f3f9         /* Light blue accent */
--accent-2: #d1e7f4         /* Medium blue accent */
--accent-3: #b8daf0         /* Darker blue accent */

--logo-accent: #6683A0      /* Logo accent color */
```

## 📐 Typography Scale

Fluid, responsive typography using clamp():

```css
--text-xs: clamp(0.75rem, 0.7rem + 0.15vw, 0.8rem)
--text-sm: clamp(0.875rem, 0.8rem + 0.2vw, 0.9rem)
--text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem)
--text-lg: clamp(1.125rem, 1rem + 0.5vw, 1.25rem)
--text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)
--text-2xl: clamp(1.5rem, 1.2rem + 1.5vw, 2rem)
--text-3xl: clamp(1.875rem, 1.5rem + 2vw, 2.5rem)
--text-4xl: clamp(2.25rem, 1.8rem + 2.5vw, 3rem)
--text-5xl: clamp(2.5rem, 2rem + 3vw, 3.5rem)
```

## 🎯 Logo Components

### Logo (Icon Only)
```tsx
import { Logo } from './components/Logo';

<Logo variant="white" size={48} />
<Logo variant="black" size={60} />
```

**Props:**
- `variant`: 'white' | 'black' - Use white logo on light backgrounds, black on dark
- `size`: number - Logo width in pixels (height auto-scales)
- `className`: string - Additional CSS classes

### LogoFull (Icon + Text)
```tsx
import { LogoFull } from './components/Logo';

<LogoFull variant="white" size="md" showTagline={true} />
```

**Props:**
- `variant`: 'white' | 'black'
- `size`: 'sm' | 'md' | 'lg'
- `showTagline`: boolean - Show "Every Home, Productized"
- `className`: string

## 🎭 Animation System

### Timing Functions
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slower: 500ms cubic-bezier(0.4, 0, 0.2, 1)
```

### Motion Patterns
- **Stagger**: Progressive reveal with 0.05-0.15s delays
- **Hover**: Scale 1.02-1.05, Y offset -2 to -8px
- **Tap**: Scale 0.95-0.98
- **Fade In**: Opacity 0 → 1 with Y offset 20-50px

## 🎨 Shadows

Layered, subtle shadows using brand colors:

```css
--shadow-sm: 0 1px 2px 0 rgba(10, 54, 84, 0.05)
--shadow: 0 1px 3px 0 rgba(10, 54, 84, 0.1)
--shadow-md: 0 4px 6px -1px rgba(10, 54, 84, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(10, 54, 84, 0.1)
--shadow-xl: 0 20px 25px -5px rgba(10, 54, 84, 0.1)
--shadow-2xl: 0 25px 50px -12px rgba(10, 54, 84, 0.25)
```

## 📦 Icon System

All icons are imported from `./components/icons.tsx` for consistency:

```tsx
import { Home, TrendingUp, Mail, ArrowRight } from './components/icons';
```

**Categories:**
- Navigation: Menu, X, ChevronDown, ArrowRight, etc.
- Real Estate: Home, Building, TrendingUp, DollarSign
- Services: Search, Hammer, Sparkles, Camera
- Contact: Mail, Phone, MapPin, Send
- Social: Facebook, Instagram, Linkedin
- Property: BedDouble, Bath, Maximize

## 🎨 Utility Classes

### Text Gradient
```tsx
<h1 className="text-gradient">HABTA</h1>
```

### Glass Effect
```tsx
<div className="glass">Content with blur</div>
<div className="glass-dark">Dark glass</div>
```

### Custom Shadows
```tsx
<div className="shadow-custom-lg">Card</div>
```

## 📱 Responsive Breakpoints

Mobile-first approach:
- Default: Mobile (< 640px)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## ♿ Accessibility

- All animations respect `prefers-reduced-motion`
- Focus states with 2px outline offset
- ARIA labels on interactive elements
- Semantic HTML structure
- Color contrast ratios meet WCAG AA

## 🎯 Component Patterns

### Section Wrapper
```tsx
<Section id="services" background="muted">
  <Container>
    {/* Content */}
  </Container>
</Section>
```

### Card Hover Effect
```tsx
<motion.div
  whileHover={{ y: -8, scale: 1.02 }}
  className="bg-card rounded-3xl border hover:border-primary/30"
>
  {/* Content */}
</motion.div>
```

### Button Primary
```tsx
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  style={{
    background: 'linear-gradient(135deg, #0A3654 0%, #5A7C99 100%)',
    boxShadow: '0 8px 24px rgba(10, 54, 84, 0.3)',
  }}
>
  Action
</motion.button>
```

## 🚀 Performance

- GPU-accelerated animations (transform, opacity)
- Lazy loading with Intersection Observer
- Optimized SVG paths
- Fluid typography reduces layout shifts
- Debounced scroll handlers

## 📝 Code Style

- Mobile-first responsive design
- Inline styles for dynamic values (gradients, shadows)
- Tailwind classes for static styles
- TypeScript for type safety
- ESM imports
