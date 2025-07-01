# ThanhDoShop - Angular E-commerce Application

A modern Angular web application built with standalone components, NgRx state management, PrimeNG UI components, and Tailwind CSS.

## ⚡ Quick Start

```bash
npm install
npm run dev  # Development with hot reload → http://localhost:4200
```

**Demo login:** `emilys` / `emilyspass`

## 🚀 Features

- **🔐 Authentication System**: Secure login with JWT token management
- **🛒 Product Catalog**: Browse and view product details
- **⭐ Favorites Management**: Add/remove products from favorites with session-based storage
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS
- **🔄 State Management**: Redux pattern implementation with NgRx
- **🧪 Testing**: Unit tests with Jasmine and E2E tests with Cypress
- **⚡ Modern Angular**: Standalone components with Angular 18+ features (@if, @for, @defer)

## 🏗️ Architecture

### State Management (NgRx)
The application uses NgRx for centralized state management with the Redux pattern:

```
src/app/store/
├── models/           # TypeScript interfaces
├── auth/            # Authentication state
│   ├── auth.actions.ts
│   ├── auth.reducer.ts
│   ├── auth.effects.ts
│   └── auth.selectors.ts
├── products/        # Products state
│   ├── products.actions.ts
│   ├── products.reducer.ts
│   ├── products.effects.ts
│   └── products.selectors.ts
└── index.ts         # Root state configuration
```

**Complex Implementation Details:**

1. **Session-based Favorites Logic**: The most complex part is the favorites management system:
   - Products marked as favorites are stored in memory using a `Set<number>` for O(1) lookup performance
   - When a user unmarks a favorite on the favorites page, the product remains visible until navigation
   - This is achieved by maintaining a `visibleProducts` array in    the FavoritesComponent that tracks the UI state separately from the NgRx store
   - The store maintains the source of truth for actual favorites, while the component manages the "temporary visibility" requirement

2. **Authentication Flow with Effects**: 
   - Uses NgRx Effects for side effects like HTTP calls and localStorage management
   - Implements automatic token persistence and restoration on app startup
   - Guards protect routes and automatically redirect unauthenticated users

3. **Error Handling Strategy**:
   - Centralized error handling through NgRx effects with automatic retry mechanisms
   - User-friendly error messages via PrimeNG Toast notifications
   - Graceful fallbacks for failed image loading

### Component Architecture

Each component follows the 4-file structure:
- `*.component.ts` - Component logic
- `*.component.html` - Template 
- `*.component.scss` - Styles
- `*.component.spec.ts` - Unit tests

```
src/app/components/
├── login/
│   ├── login.component.ts
│   ├── login.component.html
│   ├── login.component.scss
│   └── login.component.spec.ts
├── product-list/
│   └── ... (same structure)
└── favorites/
    └── ... (same structure)
```

## 🛠️ Technology Stack

- **Framework**: Angular 18 with standalone components
- **State Management**: NgRx (Store, Effects, Devtools)
- **UI Library**: PrimeNG 18
- **Styling**: Tailwind CSS 3
- **HTTP Client**: Angular HttpClient with interceptors
- **Testing**: Jasmine (unit), Cypress (E2E)
- **Build Tool**: Angular CLI
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js 18+ 
- npm 9+
- Angular CLI 18+

## 🚀 Getting Started

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd shop-web-app
npm install
```

### 2. Development Server (with Hot Reload)

```bash
npm run dev
# or
ng serve
```

Navigate to `http://localhost:4200`. The application will automatically reload when you change source files.

### 3. Production SSR Server

To run production server with Server-Side Rendering:

```bash
# Build the application first
npm run build

# Run production server
npm start
# or with custom port
PORT=4001 npm start
```

Navigate to `http://localhost:4000` (or specified port).

### 4. Demo Credentials

**Username**: `emilys`  
**Password**: `emilyspass`

## 🔧 Development vs Production

### Development Mode
- **Command**: `npm run dev` or `ng serve`
- **Port**: `http://localhost:4200`
- **Features**: 
  - Hot reload (automatically reload on changes)
  - Source maps for debugging
  - Live reload when saving files
  - Angular DevTools support

### Production Mode (SSR)
- **Command**: `npm run build` → `npm start`
- **Port**: `http://localhost:4000` (can be changed with PORT env)
- **Features**:
  - Server-Side Rendering (SSR)
  - Optimized bundles (minified, tree-shaken)
  - Production performance
  - REQUIRES rebuild on every code change

**Recommendation**: Use `npm run dev` for development, `npm start` only to test production build.

## 🧪 Testing

### Unit Tests
```bash
npm test
# or
ng test
```

### E2E Tests
```bash
# Start the development server first
npm run dev

# In another terminal
npm run e2e
# or
npx cypress open
```

### Test Coverage
The application includes comprehensive testing:
- **Login Component**: Form validation, authentication flow, error handling
- **Product List Component**: Product loading, favorite toggling, navigation
- **Favorites Component**: Favorites display, session-based visibility logic
- **E2E Tests**: Complete user journeys from login to favorites management

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Blue primary, Orange accents for favorites
- **Typography**: System fonts with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Animations**: Smooth transitions and hover effects

### Responsive Design
- **Mobile-first**: Tailwind's responsive utilities
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: CSS Grid for product layouts
- **Navigation**: Adaptive toolbar that collapses on mobile

### Accessibility
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliant colors

## 📦 Build and Deployment

### Production Build
```bash
npm run build
# or
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

### Build Optimization
- **Tree Shaking**: Removes unused code
- **Lazy Loading**: Route-based code splitting
- **Bundle Analysis**: Use `ng build --stats-json` + webpack-bundle-analyzer

## 🔧 Configuration

### Environment Configuration
The app uses Angular's environment system for different configurations:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://dummyjson.com'
};
```

### NgRx DevTools
Development builds include NgRx DevTools for state debugging:
- Time travel debugging
- Action logging
- State inspection

## 🐛 Known Issues and Limitations

1. **API Limitations**: DummyJSON API doesn't persist favorites, so they're stored client-side only
2. **Authentication**: Demo API tokens have limited lifespan
3. **Images**: Some product images may fail to load due to external URLs

## 🙏 Acknowledgments

- [DummyJson](https://dummyjson.com) for the API
- [PrimeNG](https://primeng.org) for UI components
- [Tailwind CSS](https://tailwindcss.com) for styling utilities
- [NgRx](https://ngrx.io) for state management


**Built with ❤️ using Angular, NgRx, PrimeNG, and Tailwind CSS**
