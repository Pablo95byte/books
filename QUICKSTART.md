# 🚀 Quick Start Guide

Guida rapida per iniziare a usare Library Tracker PWA in 5 minuti!

## ⚡ Installazione Rapida

```bash
# 1. Installa le dipendenze
npm install

# 2. Avvia il dev server
npm run dev

# 3. Apri il browser
# L'app sarà disponibile su http://localhost:5173
```

## 📱 Primo utilizzo

### 1. Aggiungi il tuo primo libro

- Clicca su **"Aggiungi"** nella navbar
- Compila il form:
  - ✅ **Titolo** (obbligatorio)
  - ✅ **Autore** (obbligatorio)
  - ⭐ **Valutazione** (1-5 stelle)
  - 📚 **Stato** (Da leggere / In lettura / Letto)
  - 📝 **Note personali**
  - E molto altro...
- Clicca **"Aggiungi libro"**

### 2. Esplora la Dashboard

La dashboard mostra:
- 📊 **Statistiche** (totale libri, letti, in lettura, da leggere)
- 📈 **Grafici interattivi**
- 📖 **Libri in lettura** (se presenti)
- 🆕 **Aggiunti di recente**

### 3. Gestisci la tua libreria

**Nella sezione "La mia libreria":**
- 🔍 **Cerca** per titolo, autore o note
- 🎯 **Filtra** per stato, categoria, autore, rating
- 📑 **Ordina** per data, titolo, autore, rating
- ✏️ **Modifica** un libro (click sulla card → icona edit)
- 🗑️ **Elimina** un libro (click sulla card → icona trash)
- 👁️ **Visualizza dettagli** (click sulla card)

### 4. Usa "Prossime letture"

- Visualizza tutti i libri con stato "Da leggere"
- Perfetto per pianificare le tue future letture

### 5. Analizza le tue statistiche

**Nella sezione "Statistiche":**
- 📊 Tempo medio di lettura
- ⭐ Valutazione media
- 📈 Libri letti per mese
- 🎯 Top categorie
- 📉 Distribuzione valutazioni

## 💾 Import/Export

### Esportare la libreria

1. Click su **"Import/Export"** nella navbar
2. Click su **"Scarica backup (JSON)"**
3. Salva il file JSON sul tuo computer

### Importare la libreria

1. Click su **"Import/Export"** nella navbar
2. Click su **"Seleziona file JSON"**
3. Scegli il file JSON precedentemente esportato
4. Conferma l'importazione

## 🌓 Dark Mode

- Click sull'icona **luna/sole** nella navbar
- Il tema viene salvato automaticamente

## 📱 Installare come PWA

### Su Desktop (Chrome/Edge)

1. Apri l'app nel browser
2. Cerca l'icona **+** o **computer** nella barra degli indirizzi
3. Click su **"Installa Library Tracker"**
4. L'app si aprirà come applicazione standalone!

### Su Mobile (Android/iOS)

**Android:**
1. Apri l'app in Chrome
2. Menu (⋮) → **"Aggiungi a schermata Home"**
3. Conferma

**iOS:**
1. Apri l'app in Safari
2. Tap su **Share** (⬆️)
3. **"Aggiungi a Home"**
4. Conferma

## 🔥 Features Highlights

### Funziona Offline!

- ✅ Tutti i dati sono salvati localmente (IndexedDB)
- ✅ Nessuna connessione internet richiesta
- ✅ Service Worker attivo
- ✅ Puoi usare l'app anche in aereo!

### Mobile-First

- ✅ Design responsive ottimizzato per mobile
- ✅ Touch-friendly
- ✅ Menu sidebar su mobile
- ✅ Performance ottimizzate

### Fast & Modern

- ⚡ Build ultra-veloce con Vite
- 🎨 Design moderno ispirato a Notion/Apple Books
- ✨ Animazioni fluide con Framer Motion
- 🚀 Code splitting per performance

## 🛠️ Comandi Disponibili

```bash
# Development
npm run dev          # Avvia dev server (http://localhost:5173)
npm run build        # Build produzione (output in /dist)
npm run preview      # Preview build produzione

# Linting
npm run lint         # Controlla errori ESLint
```

## 📚 Struttura Dati Libro

Ogni libro può contenere:

```javascript
{
  title: "1984",                    // required
  author: "George Orwell",          // required
  isbn: "978-0451524935",           // optional
  status: "finished",               // not_started | reading | finished
  rating: 5,                        // 1-5 stars
  category: "Dystopian Fiction",    // optional
  coverUrl: "https://...",          // optional
  pages: 328,                       // optional
  notes: "Un capolavoro...",        // optional
  publisher: "Signet Classic",      // optional
  publishYear: 1949,                // optional
  dateAdded: Date,                  // auto
  dateStarted: Date,                // optional
  dateFinished: Date,               // optional
  tags: ["dystopia", "classic"]     // optional (future)
}
```

## 🎯 Tips & Tricks

### 1. Usa le categorie

Categorizza i tuoi libri per genere/tema:
- Fiction, Non-fiction, Saggistica
- Thriller, Romance, Sci-Fi
- Programmazione, Business, Self-help

### 2. Aggiungi note dettagliate

Le note sono ricercabili! Scrivi:
- Citazioni preferite
- Riflessioni personali
- Perché ti è piaciuto (o no)

### 3. Traccia le date

Inserisci date di inizio e fine lettura per:
- Vedere quanto tempo impieghi per libro
- Statistiche accurate
- Ricordi personali

### 4. Usa i filtri

Combina filtri per trovare esattamente quello che cerchi:
- Libri 5 stelle + Categoria Thriller
- Autore specifico + Da leggere
- Rating > 4 + Letti quest'anno

### 5. Backup regolari

Esporta la libreria ogni mese come backup:
- Click "Import/Export"
- Scarica JSON
- Salva su cloud (Google Drive, Dropbox, etc.)

## 🚀 Deploy in Produzione

### Deploy su Netlify (2 minuti)

```bash
# Build locale
npm run build

# Deploy su Netlify Drop
# Vai su https://app.netlify.com/drop
# Trascina la cartella /dist
```

**Oppure con CLI:**

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy su Vercel

```bash
npm install -g vercel
vercel --prod
```

### Altre piattaforme

Vedi **DEPLOY.md** per:
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Docker
- Custom VPS

## 🐛 Problemi Comuni

### L'app non si installa come PWA

**Soluzione:**
1. Assicurati di usare HTTPS (o localhost)
2. Controlla che il Service Worker sia attivo (DevTools → Application)
3. Genera le icone (vedi `public/icons/README.md`)

### Il database non salva i dati

**Soluzione:**
1. Apri DevTools → Application → IndexedDB
2. Verifica che `LibraryTrackerDB` esista
3. Se non c'è, ricarica la pagina
4. Controlla la console per errori

### La build fallisce

**Soluzione:**
```bash
# Pulisci e reinstalla
rm -rf node_modules dist .vite
npm install
npm run build
```

## 📖 Documentazione Completa

- **README.md** - Panoramica completa del progetto
- **ARCHITECTURE.md** - Architettura tecnica e best practices
- **DEPLOY.md** - Guida deployment dettagliata
- **public/icons/README.md** - Come generare icone PWA

## 💡 Prossimi Passi

1. ✅ **Personalizza i colori** - Modifica `tailwind.config.js`
2. ✅ **Genera icone custom** - Vedi `public/icons/README.md`
3. ✅ **Deploy in produzione** - Scegli una piattaforma
4. ✅ **Condividi con amici** - È open source!

## 🎓 Imparare di più

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Dexie.js Tutorial](https://dexie.org/docs/Tutorial/Getting-started)

---

**Happy Reading! 📚✨**

Hai domande? Apri una issue su GitHub!
