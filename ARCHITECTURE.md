# 🏛️ Architecture Documentation

Questo documento descrive l'architettura dell'applicazione Library Tracker PWA.

## 📐 Architectural Principles

### Clean Architecture

L'app segue i principi della Clean Architecture:

1. **Separation of Concerns** - Ogni layer ha responsabilità specifiche
2. **Dependency Inversion** - I dettagli dipendono dalle astrazioni
3. **Single Responsibility** - Ogni modulo ha un solo motivo per cambiare
4. **DRY (Don't Repeat Yourself)** - Codice riutilizzabile

### Layer Architecture

```
┌─────────────────────────────────────┐
│         Presentation Layer          │  ← React Components, Pages
│  (Components, Pages, UI)            │
├─────────────────────────────────────┤
│         Application Layer           │  ← State Management (Zustand)
│  (State, Business Logic)            │
├─────────────────────────────────────┤
│         Data Layer                  │  ← Database, Services
│  (IndexedDB, Dexie, API)            │
├─────────────────────────────────────┤
│         Infrastructure              │  ← PWA, Service Worker
│  (PWA, Routing, Build)              │
└─────────────────────────────────────┘
```

## 🎨 Presentation Layer

### Component Structure

```
components/
├── ui/               # Design System (Atomic Design)
│   ├── Button.jsx    # Atom
│   ├── Input.jsx     # Atom
│   ├── Card.jsx      # Molecule
│   └── Modal.jsx     # Organism
├── books/            # Domain-specific components
│   ├── BookCard.jsx
│   ├── BookForm.jsx
│   └── BookGrid.jsx
├── dashboard/        # Feature-specific components
│   ├── StatsCard.jsx
│   └── ReadingChart.jsx
└── layout/           # Layout components
    ├── Navbar.jsx
    ├── Sidebar.jsx
    └── Layout.jsx
```

### Design System

Utilizziamo **Atomic Design**:

- **Atoms:** Button, Input, Badge, Spinner
- **Molecules:** Card, Input+Label, StarRating
- **Organisms:** BookForm, BookCard, Modal
- **Templates:** Layout
- **Pages:** Dashboard, Library, etc.

### Styling Strategy

- **TailwindCSS** - Utility-first CSS
- **CSS-in-JS NO** - Evitato per performance
- **Dark Mode** - CSS variables + class strategy
- **Responsive** - Mobile-first approach

## 🧠 Application Layer

### State Management (Zustand)

```javascript
// Store structure
{
  // Data
  books: [],
  isLoading: false,
  error: null,

  // UI State
  theme: 'light',
  sidebarOpen: true,
  filters: {},
  modals: {},

  // Actions
  loadBooks: async () => {},
  addBook: async (book) => {},
  updateBook: async (id, updates) => {},
  deleteBook: async (id) => {},

  // Computed values
  getFilteredBooks: () => {},
  getPaginatedBooks: () => {},
}
```

### Why Zustand over Redux?

| Feature | Zustand | Redux Toolkit |
|---------|---------|---------------|
| Bundle size | ~1KB | ~10KB |
| Boilerplate | Minimal | Medium |
| Learning curve | Easy | Moderate |
| DevTools | ✅ | ✅ |
| Middleware | ✅ | ✅ |
| TypeScript | ✅ | ✅ |

Per app di questa scala, Zustand è più efficiente.

### Business Logic

La logica business risiede in:
- **Store actions** - CRUD operations
- **Service layer** - Database interactions
- **Utilities** - Helper functions

## 💾 Data Layer

### Database Architecture (IndexedDB + Dexie)

```javascript
// Schema
db.version(1).stores({
  books: '++id, title, author, isbn, status, rating, category, dateAdded, dateStarted, dateFinished',
  settings: 'key'
});
```

### Indexing Strategy

Gli indici permettono query efficienti:

- `++id` - Auto-increment primary key
- `status` - Filter by reading status
- `rating` - Filter by rating
- `category` - Filter by category
- `dateAdded`, `dateStarted`, `dateFinished` - Sort by date

### Service Pattern

```javascript
// bookService - Data Access Layer
export const bookService = {
  // CRUD
  getAll: async () => {},
  getById: async (id) => {},
  add: async (book) => {},
  update: async (id, updates) => {},
  delete: async (id) => {},

  // Queries
  search: async (query) => {},
  getByStatus: async (status) => {},
  getByCategory: async (category) => {},

  // Analytics
  getStats: async () => {},

  // Bulk operations
  bulkImport: async (books) => {},
  exportToJSON: async () => {},
};
```

### Why IndexedDB?

- ✅ **Offline-first** - Works without network
- ✅ **Large storage** - Gigabytes of data
- ✅ **Structured data** - Object store with indexes
- ✅ **Transactions** - ACID compliance
- ✅ **Browser support** - All modern browsers

Alternative considerate:
- ❌ LocalStorage - Size limit (5-10MB), no indexing
- ❌ WebSQL - Deprecated
- ❌ Session Storage - Cleared on tab close

## 🔌 Infrastructure Layer

### PWA Configuration

```javascript
// Service Worker Strategies
{
  // App Shell - Cache First
  appShell: 'CacheFirst',

  // API - Network First (with offline fallback)
  api: 'NetworkFirst',

  // Images - Cache First (with fallback)
  images: 'CacheFirst',

  // Fonts - Cache First
  fonts: 'CacheFirst',
}
```

### Build Optimization

**Vite Configuration:**

```javascript
{
  // Code Splitting
  manualChunks: {
    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
    'chart-vendor': ['chart.js', 'react-chartjs-2'],
    'db-vendor': ['dexie', 'dexie-react-hooks']
  },

  // Minification
  minify: 'terser',

  // CSS Code Splitting
  cssCodeSplit: true,
}
```

**Performance Optimizations:**

1. **Lazy Loading** - Route-based code splitting
2. **Tree Shaking** - Remove unused code
3. **Asset Optimization** - Minified CSS/JS
4. **Compression** - Gzip/Brotli ready
5. **Caching** - Aggressive caching strategy

## 🔄 Data Flow

### User Action → State Update

```
User clicks "Add Book"
    ↓
Button onClick → openModal('addBook')
    ↓
Zustand updates modals.addBook = true
    ↓
Modal renders BookForm
    ↓
User submits form
    ↓
BookForm calls onSubmit → addBook(bookData)
    ↓
Zustand action:
  1. Set isLoading = true
  2. Call bookService.add(bookData)
  3. IndexedDB insert
  4. Update books array
  5. Set isLoading = false
    ↓
React re-renders with new data
```

### Offline → Online Sync (Future)

```
User offline → Add book
    ↓
Save to IndexedDB
    ↓
Queue sync request
    ↓
User goes online
    ↓
Service Worker detects connection
    ↓
Sync queued requests to backend
    ↓
Update local data with server response
```

## 🎯 Performance Considerations

### Bundle Size

Target: **< 200KB** initial bundle (gzipped)

Current split:
- React vendor: ~130KB
- App code: ~50KB
- Chart vendor: ~40KB (lazy loaded)
- DB vendor: ~20KB

### Rendering Performance

Optimizations:
- ✅ **React.memo** - Prevent unnecessary re-renders
- ✅ **Virtualization** - For large lists (future)
- ✅ **Debouncing** - Search input
- ✅ **Pagination** - Limit rendered items
- ✅ **Lazy loading** - Routes and components

### Database Performance

- ✅ **Indexed queries** - Fast lookups
- ✅ **Batch operations** - Bulk import/export
- ✅ **Transaction optimization** - Minimize writes
- ✅ **Efficient filters** - Use indexes

## 🔒 Security Considerations

### Client-Side Security

- ✅ **Input validation** - Sanitize user input
- ✅ **XSS protection** - React escapes by default
- ✅ **CSP headers** - Content Security Policy (configure in hosting)
- ✅ **HTTPS only** - For PWA requirements

### Data Privacy

- ✅ **Local-first** - Data stays on device
- ✅ **No tracking** - No analytics by default
- ✅ **Export/Delete** - User owns their data

### Future (with backend)

- 🔐 **Authentication** - JWT or OAuth
- 🔐 **Authorization** - Role-based access
- 🔐 **Encryption** - E2E encryption for sensitive data
- 🔐 **Rate limiting** - API protection

## 📱 Responsive Design

### Breakpoints (Tailwind)

```javascript
{
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
}
```

### Mobile-First Strategy

```css
/* Base styles = mobile */
.container { padding: 1rem; }

/* Progressive enhancement */
@media (min-width: 768px) {
  .container { padding: 2rem; }
}
```

## 🧩 Extensibility

### Adding a new feature

1. **Create component** in appropriate folder
2. **Add route** (if needed) in App.jsx
3. **Update store** (if needed) in useStore.js
4. **Add database fields** (if needed) in db.js
5. **Add utility functions** in utils.js

### Adding backend sync

1. **Create API client** (`src/lib/api.js`)
2. **Update services** to call backend
3. **Add authentication** layer
4. **Implement sync queue** for offline operations
5. **Handle conflicts** (last-write-wins, or custom logic)

### Adding new analytics

1. **Update `getStats()` in db.js**
2. **Create chart component** in `components/dashboard/`
3. **Add to Stats page**

## 🎓 Best Practices

### Code Style

- ✅ **ESLint** - Linting rules
- ✅ **Prettier** - Code formatting (future)
- ✅ **JSDoc comments** - For complex functions
- ✅ **Meaningful names** - Self-documenting code

### Component Guidelines

```javascript
// ✅ Good
function BookCard({ book, onClick }) {
  // Early returns
  if (!book) return null;

  // Extract complex logic
  const displayDate = formatDate(book.dateAdded);

  // Clear JSX
  return (
    <Card onClick={onClick}>
      <h3>{book.title}</h3>
      <p>{displayDate}</p>
    </Card>
  );
}

// ❌ Avoid
function BookCard(props) {
  return (
    <div onClick={props.onClick}>
      {props.book && (
        <div>
          <h3>{props.book.title}</h3>
          <p>
            {new Date(props.book.dateAdded).toLocaleDateString('it-IT', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      )}
    </div>
  );
}
```

### State Management Guidelines

```javascript
// ✅ Co-locate related state
const bookState = {
  books: [],
  isLoading: false,
  error: null,
};

// ✅ Keep actions close to state
const actions = {
  loadBooks: async (set) => {
    set({ isLoading: true });
    // ...
  }
};

// ❌ Avoid deeply nested state
const badState = {
  data: {
    books: {
      list: [],
      meta: {
        loading: false
      }
    }
  }
};
```

## 📊 Monitoring & Analytics (Future)

### Metrics to track

- **Performance**
  - Time to First Byte (TTFB)
  - First Contentful Paint (FCP)
  - Largest Contentful Paint (LCP)
  - Cumulative Layout Shift (CLS)

- **User Behavior**
  - Books added per week
  - Most used features
  - Average session time
  - Retention rate

### Tools suggestion

- **Vercel Analytics** - For Vercel deployments
- **Google Analytics** - General analytics
- **Sentry** - Error tracking
- **Web Vitals** - Performance monitoring

## 🔄 Update Strategy

### Versioning

Seguiamo **Semantic Versioning** (semver):

```
MAJOR.MINOR.PATCH
  ↓     ↓     ↓
  1  .  0  .  0

MAJOR: Breaking changes
MINOR: New features (backward compatible)
PATCH: Bug fixes
```

### Database Migrations

```javascript
// Migration example
db.version(1).stores({
  books: '++id, title, author'
});

// Add new field
db.version(2).stores({
  books: '++id, title, author, tags'  // Added tags
}).upgrade(tx => {
  // Migrate existing data
  return tx.books.toCollection().modify(book => {
    book.tags = [];
  });
});
```

---

**Questo documento è vivo e viene aggiornato con l'evoluzione dell'app.**
