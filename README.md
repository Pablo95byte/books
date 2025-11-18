# 📚 Library Tracker PWA

Una **Progressive Web App moderna, performante e offline-first** per gestire la tua libreria personale.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

> **⚠️ PAGINA BIANCA? [Leggi la guida di troubleshooting →](TROUBLESHOOTING.md)**

## ✨ Caratteristiche

### 🎯 Funzionalità principali
- ✅ **CRUD completo** - Aggiungi, modifica, elimina libri
- 📱 **PWA installabile** - Funziona offline, installabile su mobile e desktop
- 🌓 **Dark/Light mode** - Tema scuro e chiaro
- 🔍 **Ricerca e filtri** - Cerca per titolo, autore, categoria, stato, rating
- 📊 **Dashboard con statistiche** - Visualizza le tue abitudini di lettura
- 📈 **Grafici interattivi** - Chart.js per visualizzare dati
- 💾 **Import/Export** - Backup in formato JSON
- 🎨 **Design moderno** - UI ispirata a Notion/Apple Books
- ⚡ **Performance ottimizzate** - Code splitting, lazy loading
- 📱 **Mobile-first** - Responsive design perfetto

### 📖 Gestione libri
- Titolo, autore, ISBN
- Stato di lettura (da leggere, in lettura, letto)
- Valutazione (1-5 stelle)
- Categoria/genere
- Note personali
- Date di inizio e fine lettura
- Editore, anno di pubblicazione
- Numero di pagine
- Cover image URL

## 🏗️ Architettura

### Tech Stack

#### Frontend
- **React 18** - UI library
- **Vite** - Build tool ultra-veloce
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS
- **Lucide React** - Icon library

#### State Management
- **Zustand** - State management leggero e moderno
- **Persist middleware** - Salvataggio preferenze utente

#### Database
- **Dexie.js** - Wrapper per IndexedDB
- **IndexedDB** - Database locale browser

#### PWA
- **Vite PWA Plugin** - Configurazione PWA
- **Workbox** - Service worker e caching strategies

#### Charts & Visualizations
- **Chart.js** - Libreria per grafici
- **react-chartjs-2** - Wrapper React per Chart.js

#### Icons & UI
- **Lucide React** - Icone moderne
- **React Hot Toast** - Notifiche eleganti

### Struttura del progetto

```
library-tracker-pwa/
├── public/
│   ├── icons/              # PWA icons (72x72 to 512x512)
│   └── manifest.webmanifest
├── src/
│   ├── assets/             # Immagini, fonts, etc.
│   ├── components/
│   │   ├── ui/             # Design System (Button, Card, Input, etc.)
│   │   ├── books/          # Book-specific components
│   │   ├── dashboard/      # Dashboard components
│   │   └── layout/         # Layout components (Navbar, Sidebar)
│   ├── hooks/              # Custom React hooks
│   ├── lib/
│   │   ├── db.js           # Dexie database configuration
│   │   └── utils.js        # Utility functions
│   ├── store/
│   │   └── useStore.js     # Zustand store
│   ├── pages/              # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Library.jsx
│   │   ├── NextToRead.jsx
│   │   ├── BookDetail.jsx
│   │   └── Stats.jsx
│   ├── styles/
│   │   └── index.css       # Global styles + Tailwind
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── index.html
├── vite.config.js          # Vite configuration + PWA
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisiti
- Node.js >= 18.x
- npm >= 9.x (o yarn/pnpm)

### Installazione

```bash
# 1. Clona il repository
git clone <repository-url>
cd library-tracker-pwa

# 2. Installa le dipendenze
npm install

# 3. Genera le icone PWA (vedi public/icons/README.md)
# Per ora puoi saltare questo step, l'app funzionerà comunque

# 4. Avvia il dev server
npm run dev

# 5. Apri il browser
# L'app sarà disponibile su http://localhost:5173
```

### Build per produzione

```bash
# Build ottimizzata
npm run build

# Preview della build
npm run preview

# La build sarà generata in /dist
```

## 📚 Documentazione

- **[NEW_FEATURES.md](NEW_FEATURES.md)** - Nuove funzionalità v2.0 (Scanner ISBN, Cloud Backup)
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Guida risoluzione problemi (pagina bianca, errori)
- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - Setup Firebase (opzionale)
- **[QUICKSTART.md](QUICKSTART.md)** - Guida rapida 5 minuti
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Architettura dettagliata
- **[DEPLOY.md](DEPLOY.md)** - Guida deploy completa

## 📦 Deploy

### Deploy su Netlify

1. **Metodo drag & drop:**
   ```bash
   npm run build
   # Trascina la cartella /dist su https://app.netlify.com/drop
   ```

2. **Metodo CLI:**
   ```bash
   npm install -g netlify-cli
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Metodo Git:**
   - Connetti il repository a Netlify
   - Build command: `npm run build`
   - Publish directory: `dist`

### Deploy su Vercel

```bash
# Installa Vercel CLI
npm install -g vercel

# Deploy
npm run build
vercel --prod

# Oppure connetti il repo direttamente su vercel.com
```

### Deploy su GitHub Pages

```bash
# 1. Modifica vite.config.js
# base: '/repository-name/'

# 2. Build
npm run build

# 3. Deploy con gh-pages
npm install -D gh-pages
npx gh-pages -d dist
```

### Deploy su hosting statico personalizzato

```bash
# Build
npm run build

# Upload della cartella /dist sul tuo server
# Assicurati che il server supporti SPA routing
# (fallback a index.html per tutte le route)
```

## 🔧 Configurazione

### Personalizzare il tema

Modifica `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Cambia i colori primary
        500: '#your-color',
        600: '#your-color',
        // ...
      }
    }
  }
}
```

### Modificare il database schema

Se vuoi aggiungere campi ai libri, modifica `src/lib/db.js`:

```javascript
db.version(2).stores({
  books: '++id, title, author, ..., yourNewField'
});
```

**Nota:** Aumenta la versione del database per migrazioni.

### Configurare la PWA

Modifica `vite.config.js` nella sezione `VitePWA`:

```javascript
VitePWA({
  manifest: {
    name: 'Your App Name',
    short_name: 'AppName',
    theme_color: '#your-color',
    // ...
  }
})
```

## 🎨 Design System

L'app include un design system completo e riutilizzabile:

### Componenti UI
- `Button` - Bottoni con varianti (primary, secondary, ghost, danger)
- `Card` - Container con shadow e border
- `Input` - Input fields con label ed errori
- `Select` - Dropdown select
- `Textarea` - Multi-line text input
- `Modal` - Dialog modale
- `Badge` - Label e tag
- `StarRating` - Rating interattivo
- `EmptyState` - Stati vuoti
- `Spinner` - Loading indicator

### Utilizzo

```jsx
import Button from '@/components/ui/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Clicca qui
</Button>
```

## 📊 Database & State Management

### IndexedDB (Dexie.js)

Il database locale utilizza IndexedDB tramite Dexie.js:

```javascript
import { bookService } from '@/lib/db';

// Aggiungi un libro
await bookService.add(bookData);

// Get tutti i libri
const books = await bookService.getAll();

// Filtra per stato
const reading = await bookService.getByStatus('reading');

// Statistiche
const stats = await bookService.getStats();
```

### Zustand Store

Lo store Zustand gestisce lo stato globale:

```javascript
import useStore from '@/store/useStore';

function MyComponent() {
  const { books, addBook, filters, setFilters } = useStore();

  // Usa lo stato e le azioni
}
```

## 🔌 Estensioni Future

### Backend Sync (Opzionale)

L'architettura è pronta per integrare un backend:

1. **Crea un backend REST API** (Node.js, Python, Go, ecc.)
2. **Modifica `src/lib/db.js`** per sincronizzare con il backend
3. **Aggiungi autenticazione** (JWT, OAuth)
4. **Implementa sync strategy** (offline-first, conflict resolution)

Esempio:

```javascript
// In bookService
async add(book) {
  // 1. Salva localmente (IndexedDB)
  const id = await db.books.add(book);

  // 2. Sync con backend
  try {
    await fetch('/api/books', {
      method: 'POST',
      body: JSON.stringify(book)
    });
  } catch (error) {
    // Gestisci offline, riprova dopo
    queueSync(book);
  }

  return id;
}
```

### Funzionalità suggerite

- 🔐 **Autenticazione utente**
- ☁️ **Cloud sync multi-device**
- 📚 **API esterne** (Google Books, Open Library)
- 🤖 **AI recommendations**
- 📱 **Barcode scanner** (scansiona ISBN)
- 👥 **Condivisione librerie**
- 📖 **Reading goals & challenges**
- 🏆 **Gamification** (badges, achievements)

## 🧪 Testing

### Setup testing (da aggiungere)

```bash
# Installa dipendenze testing
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Aggiungi script in package.json
"test": "vitest"
```

### Esempio test

```javascript
// src/components/ui/__tests__/Button.test.jsx
import { render, screen } from '@testing-library/react';
import Button from '../Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

## 📱 PWA Features

### Installazione

L'app può essere installata come PWA:
- **Desktop:** Chrome/Edge mostrano l'icona di installazione nella barra degli indirizzi
- **Mobile:** Usa "Aggiungi a schermata Home"

### Offline Support

Grazie al Service Worker, l'app funziona completamente offline:
- Tutti i dati sono salvati localmente (IndexedDB)
- Assets cached (HTML, CSS, JS, fonts)
- Network-first per dati dinamici

### Update Strategy

L'app si aggiorna automaticamente:
- Service Worker controlla nuove versioni
- Notifica l'utente quando disponibile
- Refresh automatico dopo conferma

## 🐛 Troubleshooting

**Hai problemi con l'app? Consulta la [guida completa di troubleshooting →](TROUBLESHOOTING.md)**

### Problema: Pagina Bianca

Se vedi una pagina completamente bianca:
1. **NON aprire** `dist/index.html` direttamente (usa `npm run dev`)
2. Apri la console browser (F12) per vedere gli errori
3. Cancella cache e Service Worker
4. Vedi [TROUBLESHOOTING.md](TROUBLESHOOTING.md) per dettagli

### Quick Fix

```bash
# Reset completo
rm -rf node_modules dist package-lock.json
npm install
npm run dev
```

**Leggi la [guida completa →](TROUBLESHOOTING.md) per altri problemi comuni.**

## 📄 License

MIT License - Vedi LICENSE file

## 🤝 Contributing

Contributi benvenuti! Per favore:
1. Forka il repository
2. Crea un branch (`git checkout -b feature/amazing-feature`)
3. Commit le modifiche (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Apri una Pull Request

## 📧 Supporto

Per bug, richieste di funzionalità o domande, apri una issue su GitHub.

---

**Fatto con ❤️ usando React, Vite, TailwindCSS e Dexie.js**
