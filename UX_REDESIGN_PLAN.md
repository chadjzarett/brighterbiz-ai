# BrighterBiz.ai - UI/UX Redesign Plan
## Modern Minimalist Design with Light/Dark Mode

**Date:** October 25, 2025
**Design Inspiration:** ChatGPT, Claude AI, Linear App
**Status:** Ready for Implementation

---

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography & Spacing](#typography--spacing)
4. [Component Redesign](#component-redesign)
5. [Dark Mode Implementation](#dark-mode-implementation)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Code Examples](#code-examples)

---

## Design Philosophy

### Core Principles
- **Minimalism:** Clean, distraction-free interface
- **Clarity:** Focus on content and functionality
- **Consistency:** Unified design language throughout
- **Accessibility:** WCAG 2.1 AA compliant in both modes

### Design Goals
1. Remove all gradient backgrounds and effects
2. Implement subtle, purposeful color accents
3. Modernize border radius (ChatGPT/Claude style)
4. Create seamless light/dark mode experience
5. Improve visual hierarchy with better spacing

### What We're Fixing
❌ **Remove:**
- Gradient backgrounds (`from-blue-500 to-purple-600`)
- Overly rounded corners (`rounded-3xl`, `rounded-full`)
- Heavy animations and floats
- Color-heavy badges and tags
- Decorative gradients on text

✅ **Add:**
- Clean, flat backgrounds
- Subtle shadows for depth
- Consistent border radius (8px standard, 12px for cards)
- Strategic color accents (blue for primary actions)
- System-level dark mode support

---

## Color System

### Light Mode Palette

```css
/* Background Layers */
--bg-primary: #FFFFFF;           /* Main background */
--bg-secondary: #F9FAFB;         /* Section backgrounds */
--bg-tertiary: #F3F4F6;          /* Input backgrounds, cards */
--bg-hover: #F3F4F6;             /* Hover states */
--bg-active: #E5E7EB;            /* Active/pressed states */

/* Text Colors */
--text-primary: #111827;         /* Headings, primary text */
--text-secondary: #6B7280;       /* Body text, descriptions */
--text-tertiary: #9CA3AF;        /* Placeholder, disabled text */
--text-inverse: #FFFFFF;         /* Text on dark backgrounds */

/* Border Colors */
--border-primary: #E5E7EB;       /* Default borders */
--border-secondary: #D1D5DB;     /* Stronger borders */
--border-focus: #3B82F6;         /* Focus states */

/* Accent Colors (Strategic Use Only) */
--accent-primary: #3B82F6;       /* Primary blue - CTAs */
--accent-primary-hover: #2563EB; /* Hover state */
--accent-success: #10B981;       /* Success messages */
--accent-warning: #F59E0B;       /* Warnings */
--accent-error: #EF4444;         /* Errors */

/* Semantic Colors */
--success-bg: #ECFDF5;
--success-text: #065F46;
--warning-bg: #FFFBEB;
--warning-text: #92400E;
--error-bg: #FEF2F2;
--error-text: #991B1B;
```

### Dark Mode Palette

```css
/* Background Layers */
--bg-primary: #0D0D0D;           /* Main background (near black) */
--bg-secondary: #171717;         /* Section backgrounds */
--bg-tertiary: #262626;          /* Input backgrounds, cards */
--bg-hover: #2D2D2D;             /* Hover states */
--bg-active: #363636;            /* Active/pressed states */

/* Text Colors */
--text-primary: #F5F5F5;         /* Headings, primary text */
--text-secondary: #A3A3A3;       /* Body text, descriptions */
--text-tertiary: #737373;        /* Placeholder, disabled text */
--text-inverse: #0D0D0D;         /* Text on light backgrounds */

/* Border Colors */
--border-primary: #2D2D2D;       /* Default borders */
--border-secondary: #404040;     /* Stronger borders */
--border-focus: #3B82F6;         /* Focus states (same as light) */

/* Accent Colors (Same as Light Mode) */
--accent-primary: #3B82F6;
--accent-primary-hover: #2563EB;
--accent-success: #10B981;
--accent-warning: #F59E0B;
--accent-error: #EF4444;

/* Semantic Colors */
--success-bg: #064E3B;
--success-text: #6EE7B7;
--warning-bg: #78350F;
--warning-text: #FCD34D;
--error-bg: #7F1D1D;
--error-text: #FCA5A5;
```

### Color Usage Guidelines

**Primary Actions (Blue Accent):**
- Submit buttons
- Primary CTAs
- Active navigation items
- Links

**Neutral (Grays):**
- All backgrounds
- Most borders
- Navigation
- Cards
- Text

**Success (Green) - Use Sparingly:**
- Checkmarks for "Free" features
- Success messages
- Completed states

**Warning (Amber) - Minimal Use:**
- Medium difficulty badges
- Important notices

**Error (Red) - Validation Only:**
- Form errors
- Destructive actions
- Advanced difficulty badges

---

## Typography & Spacing

### Font System

```css
/* Font Families */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Spacing Scale (8px base)

```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
```

### Border Radius (ChatGPT/Claude Style)

```css
/* Remove: rounded-full, rounded-3xl, rounded-2xl */

--radius-sm: 6px;       /* Small elements (badges, tags) */
--radius-md: 8px;       /* Default (buttons, inputs) */
--radius-lg: 12px;      /* Cards, modals */
--radius-xl: 16px;      /* Large containers */

/* Special Cases */
--radius-input: 8px;    /* Input fields (like ChatGPT) */
--radius-button: 8px;   /* Buttons (like Claude) */
--radius-card: 12px;    /* Content cards */
--radius-modal: 16px;   /* Modals, dialogs */
```

### Shadow System

```css
/* Light Mode Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

/* Dark Mode Shadows (more subtle) */
--shadow-sm-dark: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
--shadow-md-dark: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
--shadow-lg-dark: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
--shadow-xl-dark: 0 20px 25px -5px rgba(0, 0, 0, 0.6);

/* Focus Ring (accessible) */
--ring-focus: 0 0 0 3px rgba(59, 130, 246, 0.5);
```

---

## Component Redesign

### 1. Main Input Field (ChatGPT/Claude Style)

**Current Issues:**
- Gradient background on dark input
- Rounded-xl (12px) is okay but needs refinement
- Decorative label animation
- Inconsistent focus states

**New Design:**

```tsx
// src/components/EnhancedForm.tsx - Redesigned

<div className="w-full max-w-3xl mx-auto">
  {/* Simple label */}
  <label
    htmlFor="business-input"
    className="block text-sm font-medium text-secondary mb-3"
  >
    Describe your business
  </label>

  {/* Input field - ChatGPT/Claude style */}
  <div className="relative">
    <textarea
      id="business-input"
      value={inputValue}
      onChange={handleInputChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder="e.g., I run a small bakery in downtown Portland..."
      rows={3}
      className={`
        w-full px-4 py-3.5
        bg-tertiary text-primary
        border border-primary
        rounded-lg
        resize-none
        transition-all duration-200
        placeholder:text-tertiary
        focus:outline-none
        focus:border-focus
        focus:ring-4 focus:ring-blue-500/10
        disabled:opacity-50 disabled:cursor-not-allowed
        ${errors.business ? 'border-error focus:border-error focus:ring-red-500/10' : ''}
      `}
      disabled={isLoading}
      aria-invalid={!!errors.business}
      aria-describedby={errors.business ? "business-error" : "business-hint"}
    />

    {/* Character counter - bottom right */}
    <div className="absolute bottom-3 right-3 text-xs text-tertiary">
      {inputValue.length}/10
    </div>
  </div>

  {/* Helper text / Error */}
  {!errors.business ? (
    <p id="business-hint" className="mt-2 text-sm text-secondary">
      Be as specific as possible for better recommendations
    </p>
  ) : (
    <p id="business-error" role="alert" className="mt-2 text-sm text-error flex items-center gap-1.5">
      <AlertCircle className="w-4 h-4" aria-hidden="true" />
      {errors.business}
    </p>
  )}

  {/* Submit button - redesigned below */}
  <Button
    onClick={handleSubmit}
    disabled={!isValid || isLoading}
    className="mt-4 w-full"
  >
    {isLoading ? (
      <>
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        Generating recommendations...
      </>
    ) : (
      <>
        Get AI Recommendations
        <ArrowRight className="w-4 h-4 ml-2" />
      </>
    )}
  </Button>
</div>
```

**Visual Comparison:**

```
BEFORE:
┌─────────────────────────────────────┐
│  [Gradient BG, rounded-xl]          │
│  Purple/Blue gradient input         │
│  Heavy shadows, floating animation  │
└─────────────────────────────────────┘

AFTER (Light Mode):
┌─────────────────────────────────────┐
│  Describe your business             │
│  ┌───────────────────────────────┐  │
│  │ e.g., I run a small...    0/10│  │
│  │                               │  │
│  └───────────────────────────────┘  │
│  Be as specific as possible         │
│  [Get AI Recommendations →]         │
└─────────────────────────────────────┘
Clean, flat, subtle border

AFTER (Dark Mode):
┌─────────────────────────────────────┐
│  Describe your business             │
│  ┌───────────────────────────────┐  │
│  │ e.g., I run a small...    0/10│  │
│  │                               │  │
│  └───────────────────────────────┘  │
│  Be as specific as possible         │
│  [Get AI Recommendations →]         │
└─────────────────────────────────────┘
Dark bg, lighter text, same structure
```

---

### 2. Button Redesign

**Current Issues:**
- Gradient backgrounds (`from-blue-500 to-purple-600`)
- Rounded-full on some buttons
- Inconsistent sizing
- Heavy hover effects

**New Design System:**

```tsx
// src/components/ui/button.tsx - Redesigned

const buttonVariants = cva(
  // Base styles (all buttons)
  `
    inline-flex items-center justify-center gap-2
    font-medium
    transition-all duration-200
    focus-visible:outline-none
    focus-visible:ring-4
    disabled:pointer-events-none
    disabled:opacity-50
  `,
  {
    variants: {
      variant: {
        // Primary - Blue accent (main CTAs)
        primary: `
          bg-accent-primary text-white
          hover:bg-accent-primary-hover
          focus-visible:ring-blue-500/50
          active:scale-[0.98]
        `,

        // Secondary - Subtle gray (less important actions)
        secondary: `
          bg-tertiary text-primary
          border border-primary
          hover:bg-hover
          focus-visible:ring-gray-500/30
        `,

        // Ghost - Transparent (tertiary actions)
        ghost: `
          text-secondary
          hover:bg-hover hover:text-primary
          focus-visible:ring-gray-500/30
        `,

        // Destructive - Red (dangerous actions)
        destructive: `
          bg-accent-error text-white
          hover:bg-red-600
          focus-visible:ring-red-500/50
        `,

        // Link - Text only
        link: `
          text-accent-primary
          hover:underline
          focus-visible:ring-blue-500/30
        `,
      },

      size: {
        sm: 'h-9 px-3 text-sm rounded-lg',      // 36px height
        md: 'h-10 px-4 text-sm rounded-lg',     // 40px height (default)
        lg: 'h-11 px-6 text-base rounded-lg',   // 44px height
        xl: 'h-12 px-8 text-base rounded-lg',   // 48px height
        icon: 'h-10 w-10 rounded-lg',           // Square icon button
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// Usage examples:
<Button variant="primary" size="lg">
  Get AI Recommendations
  <ArrowRight className="w-4 h-4" />
</Button>

<Button variant="secondary" size="md">
  Learn More
</Button>

<Button variant="ghost" size="sm">
  Cancel
</Button>
```

**Button Examples:**

```
PRIMARY (Blue):
┌──────────────────────────┐
│ Get AI Recommendations → │  ← Blue bg, white text, 8px radius
└──────────────────────────┘

SECONDARY (Gray):
┌──────────────────────────┐
│      Learn More          │  ← Gray bg, dark text, subtle border
└──────────────────────────┘

GHOST (Transparent):
  Cancel                      ← No bg, gray text, hover shows bg
```

---

### 3. Card Redesign

**Current Issues:**
- Rounded-3xl (24px) too round
- Gradient icon backgrounds
- Float animations
- Heavy shadows

**New Design:**

```tsx
// Recommendation Card - Clean minimal style

<article className="
  bg-primary
  border border-primary
  rounded-xl
  p-6
  hover:border-secondary
  hover:shadow-md
  transition-all duration-200
">
  {/* Header */}
  <div className="flex items-start justify-between gap-4 mb-4">
    <div className="flex items-center gap-3">
      {/* Icon - Simple, no gradient */}
      <div className="
        w-10 h-10
        bg-tertiary
        rounded-lg
        flex items-center justify-center
        text-secondary
      ">
        <MessageCircle className="w-5 h-5" />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-primary">
          AI Chatbot for Customer Service
        </h3>
      </div>
    </div>

    {/* Difficulty badge - minimal */}
    <span className="
      px-2.5 py-1
      text-xs font-medium
      bg-success-bg text-success-text
      rounded-md
      flex items-center gap-1
    ">
      <span aria-hidden="true">✓</span> Easy
    </span>
  </div>

  {/* Description */}
  <p className="text-sm text-secondary mb-4 leading-relaxed">
    Implement a 24/7 AI chatbot to handle common customer inquiries,
    reducing response time and freeing up your team for complex issues.
  </p>

  {/* Meta info */}
  <div className="flex items-center gap-4 text-xs text-tertiary">
    <span className="flex items-center gap-1.5">
      <Clock className="w-3.5 h-3.5" />
      2-3 weeks
    </span>
    <span className="flex items-center gap-1.5">
      <DollarSign className="w-3.5 h-3.5" />
      $50-150/mo
    </span>
    <span className="px-2 py-0.5 bg-tertiary text-secondary rounded-md">
      Customer Service
    </span>
  </div>
</article>
```

**Visual Comparison:**

```
BEFORE:
╔═══════════════════════════════════╗
║  [Gradient Icon]  Big Round Card  ║
║  Float animation, heavy shadow    ║
║  Rounded-3xl (24px radius)        ║
╚═══════════════════════════════════╝

AFTER:
┌───────────────────────────────────┐
│ [○] AI Chatbot             [Easy] │
│                                   │
│ Implement a 24/7 AI chatbot...    │
│                                   │
│ ⏱ 2-3 weeks  💰 $50-150/mo  CS   │
└───────────────────────────────────┘
Flat, clean, 12px radius
```

---

### 4. Navigation Header

**Current Issues:**
- Glass effect background
- Gradient logo background
- No mobile menu
- Hover underline effect with gradient

**New Design:**

```tsx
// src/app/page.tsx - Header redesign

<header className="
  fixed top-0 left-0 right-0 z-50
  bg-primary/80 backdrop-blur-xl
  border-b border-primary
">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      {/* Logo - Simple, no gradient */}
      <a
        href="#hero"
        className="flex items-center gap-2.5 group"
        aria-label="BrighterBiz.ai home"
      >
        <div className="
          w-8 h-8
          bg-accent-primary
          rounded-lg
          flex items-center justify-center
          group-hover:scale-105
          transition-transform duration-200
        ">
          <Lightbulb className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="text-base font-semibold text-primary">
          BrighterBiz.ai
        </span>
      </a>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1" role="navigation">
        {navigationItems.slice(1).map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="
              px-3 py-2
              text-sm font-medium text-secondary
              hover:text-primary hover:bg-hover
              rounded-lg
              transition-colors duration-200
            "
            aria-label={`Navigate to ${item.label} section`}
          >
            {item.label}
          </a>
        ))}

        {/* CTA Button */}
        <Button
          onClick={scrollToInputField}
          variant="primary"
          size="sm"
          className="ml-2"
        >
          Try For Free
        </Button>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 text-secondary hover:text-primary hover:bg-hover rounded-lg"
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>
    </div>
  </div>

  {/* Mobile Menu */}
  {mobileMenuOpen && (
    <div className="md:hidden border-t border-primary bg-primary">
      <nav className="px-4 py-3 space-y-1">
        {navigationItems.slice(1).map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="
              block px-3 py-2
              text-sm font-medium text-secondary
              hover:text-primary hover:bg-hover
              rounded-lg
              transition-colors duration-200
            "
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
        <Button
          onClick={() => {
            setMobileMenuOpen(false);
            scrollToInputField();
          }}
          variant="primary"
          size="sm"
          className="w-full mt-2"
        >
          Try For Free
        </Button>
      </nav>
    </div>
  )}
</header>
```

---

### 5. Feature Cards (With Strategic Color Accents)

**Current Issues:**
- Gradient icon backgrounds
- Float animations
- Overly colorful

**New Design (Minimal color, strategic accents):**

```tsx
// src/app/page.tsx - Features section

<section className="py-20 bg-secondary">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Section header */}
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
        Why BrighterBiz.ai?
      </h2>
      <p className="text-lg text-secondary max-w-2xl mx-auto">
        AI recommendations that actually make sense for your business
      </p>
    </div>

    {/* Feature cards */}
    <div className="grid md:grid-cols-3 gap-6">
      {[
        {
          icon: User,
          title: 'Tailored to You',
          description: 'Every recommendation is specifically designed for your industry and business model.',
          accentColor: 'blue', // Only used for icon
        },
        {
          icon: CheckCircle,
          title: 'Easy to Understand',
          description: 'No tech jargon. Just clear, actionable advice you can implement today.',
          accentColor: 'green',
        },
        {
          icon: Sparkles,
          title: 'Actionable Insights',
          description: 'Get specific tools and next steps, not just vague suggestions.',
          accentColor: 'purple',
        },
      ].map((feature) => {
        const Icon = feature.icon;

        // Minimal color accent mapping
        const accentColors = {
          blue: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
          green: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
          purple: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
        };

        return (
          <article
            key={feature.title}
            className="
              bg-primary
              border border-primary
              rounded-xl
              p-6
              hover:border-secondary
              hover:shadow-lg
              transition-all duration-200
            "
          >
            {/* Icon - subtle color accent */}
            <div className={`
              w-12 h-12
              ${accentColors[feature.accentColor as keyof typeof accentColors]}
              rounded-lg
              flex items-center justify-center
              mb-4
            `}>
              <Icon className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-semibold text-primary mb-2">
              {feature.title}
            </h3>

            <p className="text-secondary leading-relaxed">
              {feature.description}
            </p>
          </article>
        );
      })}
    </div>
  </div>
</section>
```

**Color Strategy:**
- **Main UI:** All grays (white/black backgrounds, gray text)
- **Strategic Accents:**
  - Icon backgrounds only (subtle, 10% opacity)
  - Primary buttons (solid blue)
  - Links and interactive elements (blue)
  - Success/warning/error states (semantic colors)

---

### 6. Difficulty Badges (Minimal Color)

**Current Issues:**
- Color-only encoding
- Heavy color usage

**New Design:**

```tsx
const difficultyBadges = {
  Easy: {
    bg: 'bg-green-500/10 dark:bg-green-500/20',
    text: 'text-green-700 dark:text-green-400',
    icon: '✓',
    label: 'Easy to implement',
  },
  Medium: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    icon: '◆',
    label: 'Moderate difficulty',
  },
  Advanced: {
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    text: 'text-red-700 dark:text-red-400',
    icon: '★',
    label: 'Advanced implementation',
  },
};

// Render
<span
  className={`
    ${badge.bg} ${badge.text}
    px-2.5 py-1
    text-xs font-medium
    rounded-md
    flex items-center gap-1
  `}
  aria-label={badge.label}
>
  <span aria-hidden="true">{badge.icon}</span>
  {difficulty}
</span>
```

**Visual:**
```
Light Mode:
[✓ Easy]     ← Very light green bg, dark green text
[◆ Medium]   ← Very light amber bg, dark amber text
[★ Advanced] ← Very light red bg, dark red text

Dark Mode:
[✓ Easy]     ← Subtle green glow, light green text
[◆ Medium]   ← Subtle amber glow, light amber text
[★ Advanced] ← Subtle red glow, light red text
```

---

### 7. Modal Redesign

**Current Issues:**
- Heavy styling
- Inconsistent with main design

**New Design:**

```tsx
<DialogContent className="
  bg-primary
  border border-primary
  rounded-2xl
  shadow-xl
  max-w-2xl
  max-h-[90vh]
  overflow-y-auto
  p-0
">
  {/* Header */}
  <div className="
    sticky top-0 z-10
    bg-primary
    border-b border-primary
    px-6 py-4
    rounded-t-2xl
  ">
    <DialogTitle className="text-xl font-semibold text-primary">
      Schedule Your Free Consultation
    </DialogTitle>
    <p className="text-sm text-secondary mt-1">
      Get personalized help implementing AI in your business
    </p>
  </div>

  {/* Content */}
  <div className="px-6 py-6 space-y-6">
    {/* Form fields here - using redesigned inputs */}
  </div>

  {/* Footer */}
  <div className="
    sticky bottom-0
    bg-primary
    border-t border-primary
    px-6 py-4
    rounded-b-2xl
    flex items-center justify-end gap-3
  ">
    <Button variant="ghost" onClick={onClose}>
      Cancel
    </Button>
    <Button variant="primary" type="submit" disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Submitting...
        </>
      ) : (
        'Schedule Consultation'
      )}
    </Button>
  </div>
</DialogContent>
```

---

## Dark Mode Implementation

### 1. Theme Provider Setup

```tsx
// src/providers/theme-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    // Determine resolved theme
    let resolved: 'light' | 'dark';

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      resolved = systemTheme;
    } else {
      resolved = theme;
    }

    // Apply theme
    root.classList.add(resolved);
    setResolvedTheme(resolved);

    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (theme === 'system') {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        setResolvedTheme(newTheme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

### 2. Theme Toggle Component

```tsx
// src/components/ThemeToggle.tsx
'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/providers/theme-provider';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const icons = {
    light: <Sun className="w-4 h-4" />,
    dark: <Moon className="w-4 h-4" />,
    system: <Monitor className="w-4 h-4" />,
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Current theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      {icons[theme]}
    </Button>
  );
}
```

### 3. Updated Tailwind Config

```js
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Semantic color names that adapt to theme
        primary: {
          DEFAULT: 'rgb(var(--color-text-primary) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        },
        tertiary: {
          DEFAULT: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
        },
        accent: {
          primary: '#3B82F6',
          'primary-hover': '#2563EB',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        },
        bg: {
          primary: 'rgb(var(--color-bg-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--color-bg-tertiary) / <alpha-value>)',
          hover: 'rgb(var(--color-bg-hover) / <alpha-value>)',
          active: 'rgb(var(--color-bg-active) / <alpha-value>)',
        },
        border: {
          primary: 'rgb(var(--color-border-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-border-secondary) / <alpha-value>)',
          focus: 'rgb(var(--color-border-focus) / <alpha-value>)',
        },
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '6px',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
    },
  },
  plugins: [],
};

export default config;
```

### 4. Global CSS with CSS Variables

```css
/* src/app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ============================================ */
/* CSS VARIABLES - LIGHT MODE (DEFAULT)        */
/* ============================================ */

:root {
  /* Background Colors */
  --color-bg-primary: 255 255 255;        /* #FFFFFF */
  --color-bg-secondary: 249 250 251;      /* #F9FAFB */
  --color-bg-tertiary: 243 244 246;       /* #F3F4F6 */
  --color-bg-hover: 243 244 246;          /* #F3F4F6 */
  --color-bg-active: 229 231 235;         /* #E5E7EB */

  /* Text Colors */
  --color-text-primary: 17 24 39;         /* #111827 */
  --color-text-secondary: 107 114 128;    /* #6B7280 */
  --color-text-tertiary: 156 163 175;     /* #9CA3AF */
  --color-text-inverse: 255 255 255;      /* #FFFFFF */

  /* Border Colors */
  --color-border-primary: 229 231 235;    /* #E5E7EB */
  --color-border-secondary: 209 213 219;  /* #D1D5DB */
  --color-border-focus: 59 130 246;       /* #3B82F6 */

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* ============================================ */
/* CSS VARIABLES - DARK MODE                   */
/* ============================================ */

.dark {
  /* Background Colors */
  --color-bg-primary: 13 13 13;           /* #0D0D0D */
  --color-bg-secondary: 23 23 23;         /* #171717 */
  --color-bg-tertiary: 38 38 38;          /* #262626 */
  --color-bg-hover: 45 45 45;             /* #2D2D2D */
  --color-bg-active: 54 54 54;            /* #363636 */

  /* Text Colors */
  --color-text-primary: 245 245 245;      /* #F5F5F5 */
  --color-text-secondary: 163 163 163;    /* #A3A3A3 */
  --color-text-tertiary: 115 115 115;     /* #737373 */
  --color-text-inverse: 13 13 13;         /* #0D0D0D */

  /* Border Colors */
  --color-border-primary: 45 45 45;       /* #2D2D2D */
  --color-border-secondary: 64 64 64;     /* #404040 */
  --color-border-focus: 59 130 246;       /* #3B82F6 (same) */

  /* Shadows (darker for dark mode) */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6);
}

/* ============================================ */
/* BASE STYLES                                  */
/* ============================================ */

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

body {
  background-color: rgb(var(--color-bg-primary));
  color: rgb(var(--color-text-primary));
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* ============================================ */
/* UTILITY CLASSES                              */
/* ============================================ */

@layer utilities {
  /* Semantic color utilities */
  .text-primary {
    color: rgb(var(--color-text-primary));
  }

  .text-secondary {
    color: rgb(var(--color-text-secondary));
  }

  .text-tertiary {
    color: rgb(var(--color-text-tertiary));
  }

  .bg-primary {
    background-color: rgb(var(--color-bg-primary));
  }

  .bg-secondary {
    background-color: rgb(var(--color-bg-secondary));
  }

  .bg-tertiary {
    background-color: rgb(var(--color-bg-tertiary));
  }

  .bg-hover {
    background-color: rgb(var(--color-bg-hover));
  }

  .border-primary {
    border-color: rgb(var(--color-border-primary));
  }

  .border-secondary {
    border-color: rgb(var(--color-border-secondary));
  }

  .border-focus {
    border-color: rgb(var(--color-border-focus));
  }

  /* Screen reader only */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Remove number input arrows */
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }
}

/* ============================================ */
/* ACCESSIBILITY                                */
/* ============================================ */

/* Focus visible for keyboard navigation */
:focus-visible {
  outline: 2px solid rgb(var(--color-border-focus));
  outline-offset: 2px;
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ============================================ */
/* MOBILE OPTIMIZATIONS                         */
/* ============================================ */

@media (max-width: 768px) {
  /* Ensure touch targets are at least 44px */
  button,
  a,
  input,
  select,
  textarea {
    min-height: 44px;
  }

  /* iOS input zoom fix */
  input,
  select,
  textarea {
    font-size: 16px;
  }

  /* Safe area insets for notched devices */
  body {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* ============================================ */
/* SMOOTH TRANSITIONS                           */
/* ============================================ */

/* Smooth theme transitions */
*,
*::before,
*::after {
  transition-property: background-color, border-color, color, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Disable transitions on theme change for instant feedback */
html.theme-transitioning * {
  transition: none !important;
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
**Goal:** Set up design system and dark mode infrastructure

**Day 1-2: Design Tokens**
- [X] Update `globals.css` with CSS variables
- [X] Configure Tailwind with new color system
- [X] Test color contrast in both modes (WCAG AA)
- [X] Document color usage guidelines

**Day 3-4: Theme System**
- [X] Create ThemeProvider
- [X] Build ThemeToggle component
- [X] Add theme toggle to header
- [X] Test theme persistence (localStorage)
- [X] Test system preference detection

**Day 5: Button Component**
- [X] Redesign Button component with variants
- [X] Remove all gradient styles
- [X] Update border radius (8px)
- [X] Test all button variants in both themes
- [X] Update button usage throughout app

**Deliverables:**
- ✅ Functional dark mode toggle
- ✅ Design tokens in place
- ✅ Redesigned button component

---

### Phase 2: Core Components (Week 2)
**Goal:** Redesign main user-facing components

**Day 1-2: Input Fields**
- [x] Redesign EnhancedForm (textarea style)
- [x] Update border radius to 8px
- [x] Add character counter
- [x] Improve focus states
- [x] Test in both light/dark modes
- [x] Test accessibility (keyboard, screen reader)

**Day 3: Cards & Badges**
- [x] Redesign recommendation cards (12px radius)
- [x] Update difficulty badges (minimal color)
- [x] Remove gradient icon backgrounds
- [x] Add icon patterns for accessibility
- [x] Test hover states

**Day 4: Navigation**
- [X] Update navigation hover states
- [X] Test sticky header in both themes
- [X] Ensure mobile menu works

**Day 5: Testing & Refinement**
- [X] Cross-browser testing (Chrome, Firefox, Safari)
- [X] Mobile device testing (iOS, Android)
- [X] Color contrast verification (all text)
- [X] Fix any visual inconsistencies

**Deliverables:**
- ✅ Redesigned input fields
- ✅ Clean card design
- ✅ Modern navigation header

---

### Phase 3: Polish & Details (Week 3)
**Goal:** Refine details and ensure consistency

**Day 1: Feature Section**
- [X] Update feature cards (remove gradients)
- [X] Add subtle color accents (10% opacity)
- [X] Update icon backgrounds
- [X] Test spacing and alignment
- [X] Verify readability in both modes

**Day 2: Results Page**
- [X] Update recommendation cards
- [X] Redesign category tags
- [X] Update meta information display
- [X] Test with multiple recommendations
- [X] Ensure responsive layout works

**Day 3: Modal**
- [X] Redesign ConsultationModal
- [X] Update form fields (consistent with main form)
- [X] Add sticky header/footer
- [X] Test scroll behavior
- [X] Verify form validation styling

**Day 4: Footer & Misc**
- [ ] Redesign footer
- [ ] Update any remaining gradient elements
- [ ] Check all corner radius values
- [ ] Update loading states
- [ ] Polish animations (subtle only)

**Day 5: Final Testing**
- [ ] Complete accessibility audit (Axe, WAVE)
- [ ] Test theme toggle in all views
- [ ] Verify color consistency
- [ ] Check typography hierarchy
- [ ] Mobile responsiveness check

**Deliverables:**
- ✅ Consistent design across all pages
- ✅ Polished dark mode
- ✅ No gradients remaining

---

### Phase 4: Performance & Launch (Week 4)
**Goal:** Optimize and prepare for production

**Day 1-2: Performance**
- [ ] Optimize CSS (remove unused styles)
- [ ] Test Lighthouse scores (both themes)
- [ ] Reduce animation overhead
- [ ] Test on slow connections
- [ ] Verify bundle size

**Day 3: Documentation**
- [ ] Document design system
- [ ] Create component style guide
- [ ] Update README with theme info
- [ ] Document color usage
- [ ] Add screenshot examples

**Day 4: User Testing**
- [ ] Test with 5-10 users
- [ ] Gather feedback on theme preference
- [ ] Check for usability issues
- [ ] Verify clarity of UI
- [ ] Iterate based on feedback

**Day 5: Launch Prep**
- [ ] Final QA check
- [ ] Update meta tags (OG images for both themes)
- [ ] Test theme on production
- [ ] Monitor analytics for theme preference
- [ ] Prepare launch announcement

**Deliverables:**
- ✅ Production-ready redesign
- ✅ Documented design system
- ✅ Performance optimized

---

## Code Examples

### Complete Example: Redesigned Home Page Hero

```tsx
// src/app/page.tsx - Hero Section (Redesigned)

<section className="pt-32 pb-20 px-4 bg-primary">
  <div className="max-w-4xl mx-auto">
    {/* Badge */}
    <div className="flex justify-center mb-6">
      <span className="
        inline-flex items-center gap-2
        px-3 py-1.5
        text-xs font-medium
        bg-accent-primary/10 text-accent-primary
        border border-accent-primary/20
        rounded-full
      ">
        <Sparkles className="w-3.5 h-3.5" />
        Powered by Advanced AI
      </span>
    </div>

    {/* Heading */}
    <h1 className="
      text-4xl md:text-5xl lg:text-6xl
      font-bold
      text-primary
      text-center
      mb-6
      leading-tight
    ">
      Free AI-powered recommendations{' '}
      <span className="text-accent-primary">
        tailored to grow your business
      </span>
    </h1>

    {/* Subheading */}
    <p className="
      text-lg md:text-xl
      text-secondary
      text-center
      mb-12
      max-w-2xl mx-auto
    ">
      Instantly discover how AI can save you time, boost revenue,
      and simplify operations—no tech skills required.
    </p>

    {/* Input Form */}
    <div className="max-w-2xl mx-auto mb-6">
      <label
        htmlFor="business-input"
        className="block text-sm font-medium text-secondary mb-3"
      >
        Describe your business
      </label>

      <div className="relative">
        <textarea
          id="business-input"
          rows={3}
          placeholder="e.g., I run a small bakery in downtown Portland..."
          className="
            w-full
            px-4 py-3.5
            bg-tertiary
            text-primary
            placeholder:text-tertiary
            border border-primary
            rounded-lg
            resize-none
            transition-all duration-200
            focus:outline-none
            focus:border-accent-primary
            focus:ring-4 focus:ring-blue-500/10
          "
        />
        <span className="
          absolute bottom-3 right-3
          text-xs text-tertiary
        ">
          0/10
        </span>
      </div>

      <p className="mt-2 text-sm text-secondary">
        Be as specific as possible for better recommendations
      </p>

      <Button
        variant="primary"
        size="lg"
        className="w-full mt-4"
      >
        Get AI Recommendations
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>

    {/* Trust Indicators */}
    <div className="
      flex flex-col sm:flex-row
      items-center justify-center
      gap-4 sm:gap-6
      text-sm text-secondary
    ">
      <span className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-green-600" />
        No account required
      </span>
      <span className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-green-600" />
        No credit card
      </span>
      <span className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-green-600" />
        100% Free
      </span>
    </div>
  </div>
</section>
```

---

### Complete Example: Recommendation Card

```tsx
// Recommendation card component (redesigned)

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const difficultyConfig = {
    Easy: {
      bg: 'bg-green-500/10',
      text: 'text-green-700 dark:text-green-400',
      icon: '✓',
    },
    Medium: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-700 dark:text-amber-400',
      icon: '◆',
    },
    Advanced: {
      bg: 'bg-red-500/10',
      text: 'text-red-700 dark:text-red-400',
      icon: '★',
    },
  };

  const config = difficultyConfig[recommendation.difficulty as keyof typeof difficultyConfig];

  return (
    <article className="
      bg-primary
      border border-primary
      rounded-xl
      p-6
      hover:border-secondary
      hover:shadow-lg
      transition-all duration-200
    ">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Icon */}
          <div className="
            w-10 h-10
            bg-tertiary
            rounded-lg
            flex items-center justify-center
            text-secondary
            flex-shrink-0
          ">
            <MessageCircle className="w-5 h-5" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-primary">
            {recommendation.title}
          </h3>
        </div>

        {/* Difficulty badge */}
        <span className={`
          ${config.bg} ${config.text}
          px-2.5 py-1
          text-xs font-medium
          rounded-md
          flex items-center gap-1
          flex-shrink-0
        `}>
          <span aria-hidden="true">{config.icon}</span>
          {recommendation.difficulty}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-secondary mb-4 leading-relaxed">
        {recommendation.description}
      </p>

      {/* Meta information */}
      <div className="flex items-center gap-4 text-xs text-tertiary">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {recommendation.timeToImplement}
        </span>
        <span className="flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5" />
          {recommendation.estimatedCost}
        </span>
        <span className="px-2 py-0.5 bg-tertiary text-secondary rounded-md">
          {recommendation.category}
        </span>
      </div>
    </article>
  );
}
```

---

## Success Metrics

### Visual Consistency
- [ ] No gradients anywhere in the UI
- [ ] All border radius values: 6px, 8px, 12px, or 16px (no rounded-full)
- [ ] Consistent spacing using 8px grid
- [ ] Color usage: 90% gray, 10% accent colors

### Accessibility
- [ ] WCAG AA contrast in light mode (4.5:1 for text)
- [ ] WCAG AA contrast in dark mode (4.5:1 for text)
- [ ] Theme toggle is keyboard accessible
- [ ] Theme preference persists across sessions
- [ ] Respects prefers-color-scheme

### Performance
- [ ] Theme switch is instant (<100ms)
- [ ] No flash of wrong theme on load
- [ ] CSS bundle size doesn't increase >10%
- [ ] Lighthouse performance >90 (both themes)

### User Experience
- [ ] Input feels like ChatGPT/Claude (clean, focused)
- [ ] Dark mode is comfortable for extended use
- [ ] Light mode remains bright and clean
- [ ] Theme is discoverable (visible toggle)
- [ ] Design feels modern and professional

---

## Before/After Comparison

### Hero Section

**BEFORE:**
```
┌────────────────────────────────────────┐
│  [Blue Gradient Badge]                 │
│                                        │
│  Free AI-powered recommendations       │
│  [Gradient Text] tailored to grow     │
│                                        │
│  [Dark input with gradient bg]         │
│  [Gradient button: Blue→Purple]        │
└────────────────────────────────────────┘
```

**AFTER (Light Mode):**
```
┌────────────────────────────────────────┐
│  [Blue subtle badge]                   │
│                                        │
│  Free AI-powered recommendations       │
│  [Blue text] tailored to grow          │
│                                        │
│  [Clean gray input, 8px radius]        │
│  [Solid blue button, 8px radius]       │
└────────────────────────────────────────┘
```

**AFTER (Dark Mode):**
```
┌────────────────────────────────────────┐
│  [Blue subtle badge]                   │
│                                        │
│  Free AI-powered recommendations       │
│  [Blue text] tailored to grow          │
│                                        │
│  [Dark gray input, 8px radius]         │
│  [Solid blue button, 8px radius]       │
└────────────────────────────────────────┘
```

### Feature Cards

**BEFORE:**
```
╔═══════════════════════════╗
║ [Gradient Icon Background] ║
║ Float animation           ║
║ Heavy shadows             ║
║ Rounded-3xl (24px)        ║
╚═══════════════════════════╝
```

**AFTER:**
```
┌───────────────────────────┐
│ [Subtle blue bg, 10% op]  │
│ Clean, minimal            │
│ Subtle shadow             │
│ Rounded-xl (12px)         │
└───────────────────────────┘
```

---

## Notes & Tips

### Color Usage Best Practices
1. **Use grays for 90% of the UI** - backgrounds, text, borders
2. **Reserve blue for primary actions** - submit buttons, links
3. **Use semantic colors only where appropriate** - success (green), warning (amber), error (red)
4. **Never use color alone** - always pair with icons or text

### Dark Mode Best Practices
1. **Don't use pure black (#000)** - use #0D0D0D for softer appearance
2. **Don't invert colors** - use specifically designed dark palette
3. **Reduce shadow intensity** - dark mode needs subtler shadows
4. **Test in low light** - ensure comfortable for night use
5. **Provide manual toggle** - don't rely only on system preference

### ChatGPT/Claude Design Philosophy
1. **Less is more** - remove unnecessary decoration
2. **Content first** - design serves content, not vice versa
3. **Purposeful color** - every color has a meaning
4. **Generous spacing** - let content breathe
5. **Consistent patterns** - same elements look same everywhere

---

**Ready to implement?** Start with Phase 1 (Foundation) and work through systematically. Each phase builds on the previous one.

**Questions or clarifications?** Refer to the code examples or design system documentation above.

**Last Updated:** October 25, 2025
**Prepared By:** Claude (AI Assistant)
**Design Status:** Ready for Development ✅
