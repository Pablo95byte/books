# 🔧 Risoluzione Problemi (Troubleshooting)

## Pagina Bianca / App non si carica

Se vedi una pagina completamente bianca quando apri l'app, segui questi passaggi:

### ✅ Soluzione 1: Controlla la Console del Browser

1. **Apri la Console del Browser:**
   - Windows/Linux: Premi `F12` o `Ctrl + Shift + I`
   - Mac: Premi `Cmd + Option + I`

2. **Cerca errori in rosso** nella tab "Console"

3. **Copia l'errore** e cerca la soluzione corrispondente sotto

### ✅ Soluzione 2: Modalità Corretta di Apertura

**❌ SBAGLIATO:** Aprire `dist/index.html` cliccandoci sopra
- Il browser usa il protocollo `file://`
- Service Worker NON funziona
- IndexedDB potrebbe non funzionare
- Risultato: **Pagina bianca**

**✅ CORRETTO - Opzione A: Dev Server (Sviluppo)**
```bash
# 1. Assicurati di avere le dipendenze
npm install

# 2. Avvia il dev server
npm run dev

# 3. Apri il browser su:
http://localhost:5173
```

**✅ CORRETTO - Opzione B: Preview Build (Produzione)**
```bash
# 1. Build del progetto
npm run build

# 2. Avvia preview server
npm run preview

# 3. Apri il browser su:
http://localhost:4173
```

### ✅ Soluzione 3: Cancella Cache e Service Worker

Se hai aperto l'app prima e ora è bianca:

1. **Apri DevTools** (F12)
2. **Vai su "Application" tab** (o "Applicazione")
3. **Service Workers** (menu laterale)
4. Click su **"Unregister"** se presente
5. **Storage** → **Clear site data**
6. **Ricarica la pagina** con `Ctrl + Shift + R` (force refresh)

### ✅ Soluzione 4: Verifica Dipendenze

```bash
# Elimina node_modules e reinstalla
rm -rf node_modules package-lock.json
npm install

# Prova dev server
npm run dev
```

### ✅ Soluzione 5: Controlla Browser Supportati

**Browser Consigliati:**
- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

**Browser NON Supportati:**
- ❌ Internet Explorer (qualsiasi versione)
- ❌ Browser molto vecchi

### ✅ Soluzione 6: Verifica Permessi

Se usi lo scanner o backup cloud:

1. **Fotocamera:** Autorizza l'accesso quando richiesto
2. **LocalStorage:** Verifica che i cookie/storage siano abilitati
3. **HTTPS:** Alcune funzionalità richiedono HTTPS (o localhost)

## Errori Specifici

### Errore: "Failed to fetch dynamically imported module"

**Causa:** Percorso errato o file mancante dopo build

**Soluzione:**
```bash
# Rebuild pulito
rm -rf dist
npm run build
npm run preview
```

### Errore: "Dexie/IndexedDB error"

**Causa:** Browser in modalità privata o storage disabilitato

**Soluzione:**
1. Usa browser in modalità normale (non incognito)
2. Abilita storage/cookies nelle impostazioni browser
3. Prova altro browser

### Errore: "Firebase not configured"

**Causa:** Normale se non hai configurato Firebase

**Soluzione:**
- ✅ **Ignora**: Firebase è opzionale
- ✅ Usa altri metodi di backup (GitHub Gist, Download JSON)
- ⚙️ Per configurarlo: vedi `FIREBASE_SETUP.md`

### Errore: "Service Worker registration failed"

**Causa:** Protocollo `file://` o CORS issue

**Soluzione:**
```bash
# Usa sempre un server locale
npm run dev
# Oppure
npm run preview
```

### Errore: "Cannot read property of undefined"

**Causa:** Errore JavaScript in qualche componente

**Soluzione:**
1. Copia l'errore completo dalla console
2. Identifica il file (es: `Dashboard.jsx:42`)
3. Controlla i dati mancanti

## Test di Diagnostica

### Test 1: Verifica Build

```bash
npm run build

# Dovresti vedere:
# ✓ 1764 modules transformed
# ✓ built in 12.49s
# PWA v0.17.5
# precache 8 entries
```

Se vedi errori qui, c'è un problema nel codice.

### Test 2: Verifica Dev Server

```bash
npm run dev

# Dovresti vedere:
# VITE v5.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
# ➜  Network: http://192.168.x.x:5173/
```

Se non vedi questo output, c'è un problema con Vite o le dipendenze.

### Test 3: Verifica Console Browser

1. Apri `http://localhost:5173`
2. Apri Console (F12)
3. Dovresti vedere:

```
🚀 Library Tracker PWA starting...
✅ Root element found, rendering app...
✅ App rendered successfully!
✅ Service Worker registered
```

Se non vedi questi messaggi, controlla gli errori in console.

## Checklist Completa

Prima di chiedere aiuto, verifica di aver fatto:

- [ ] `npm install` eseguito
- [ ] `npm run dev` funziona senza errori
- [ ] Browser aperto su `http://localhost:5173` (non `file://`)
- [ ] Console browser controllata (F12)
- [ ] Cache e Service Worker cancellati
- [ ] Browser supportato (Chrome/Firefox/Edge moderno)
- [ ] Modalità privata disabilitata
- [ ] Storage/Cookies abilitati nel browser

## Come Chiedere Aiuto

Se il problema persiste, fornisci:

1. **Sistema Operativo:** Windows/Mac/Linux
2. **Browser:** Nome e versione
3. **Errore Console:** Screenshot o testo completo
4. **Comandi eseguiti:** Cosa hai provato?
5. **Output di:**
   ```bash
   node --version
   npm --version
   npm run build
   ```

## Fix Rapidi

### Reset Completo

```bash
# 1. Elimina tutto
rm -rf node_modules dist package-lock.json

# 2. Reinstalla
npm install

# 3. Test
npm run dev
```

### Se tutto fallisce: Clone Fresh

```bash
# In un'altra directory
git clone <your-repo-url> library-tracker-fresh
cd library-tracker-fresh
npm install
npm run dev
```

Se funziona nella nuova directory, c'era un problema locale nella vecchia installazione.

## Debug Avanzato

### Attiva Logging Verbose

Nel file `src/main.jsx`, già presente:
- ErrorBoundary che mostra errori React
- Global error handlers
- Console logs di inizializzazione

### Disabilita Service Worker Temporaneamente

In `vite.config.js`:
```javascript
VitePWA({
  disable: true, // ← Aggiungi questa riga
  // ...resto config
})
```

Rebuild e testa.

### Verifica Variabili d'Ambiente

```bash
# Crea .env se usi Firebase
cat > .env << 'EOF'
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender
VITE_FIREBASE_APP_ID=your_app_id
EOF

# Se NON usi Firebase, non serve .env
```

## Problemi Comuni su Windows

### Percorso troppo lungo

```powershell
# Abilita long paths
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

### Permessi esecuzione script

```powershell
# Se npm fallisce
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## Problemi Comuni su Mac/Linux

### Permessi node_modules

```bash
# Fix permessi
sudo chown -R $(whoami) node_modules
```

### Port già in uso

```bash
# Se porta 5173 occupata
npm run dev -- --port 3000
```

---

## Quick Reference

**App funzionante = Dev server + Browser moderno + Storage abilitato**

✅ **GIUSTO:**
```
npm run dev → http://localhost:5173
```

❌ **SBAGLIATO:**
```
Doppio click su dist/index.html
```

---

**Per ulteriori domande, apri una Issue su GitHub con i dettagli sopra.**
