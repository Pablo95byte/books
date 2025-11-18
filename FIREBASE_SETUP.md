# Firebase Setup (Optional)

Firebase è **completamente opzionale**. L'app funziona perfettamente senza Firebase utilizzando gli altri metodi di backup:
- GitHub Gist (consigliato)
- Download JSON locale
- Browser Sync
- Auto-backup emergenza

## Quando usare Firebase?

Firebase è utile se vuoi:
- ✅ Sincronizzazione automatica in tempo reale
- ✅ Accesso multi-device senza configurazione manuale
- ✅ Backup cloud gestito da Google

## Setup Firebase (5 minuti)

### 1. Crea progetto Firebase

1. Vai su https://console.firebase.google.com/
2. Click "Aggiungi progetto"
3. Nome progetto: `library-tracker` (o quello che preferisci)
4. Disabilita Google Analytics (opzionale)
5. Crea progetto

### 2. Configura Firestore

1. Nel menu laterale → **Firestore Database**
2. Click "Crea database"
3. Modalità: **Produzione** (o Test per sviluppo)
4. Location: scegli la più vicina a te
5. Abilita

### 3. Regole Firestore (Sicurezza)

Vai su **Regole** e usa queste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own backups
    match /backups/{userId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Abilita Autenticazione Anonima

1. Menu laterale → **Authentication**
2. Click "Inizia"
3. Tab "Sign-in method"
4. Abilita **Anonimo**
5. Salva

### 5. Ottieni credenziali

1. Icona ingranaggio (⚙️) → **Impostazioni progetto**
2. Scroll down → "Le tue app"
3. Click icona **</>** (Web)
4. Nickname: `library-tracker-web`
5. Registra app
6. Copia le credenziali che appaiono

### 6. Configura .env locale

Crea file `.env` nella root del progetto:

```bash
# .env
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=library-tracker-xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=library-tracker-xxx
VITE_FIREBASE_STORAGE_BUCKET=library-tracker-xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

**⚠️ Importante:** `.env` è già nel `.gitignore` quindi non verrà committato.

### 7. Installa Firebase

```bash
npm install firebase
```

### 8. Riavvia dev server

```bash
npm run dev
```

### 9. Testa il backup

1. Apri l'app
2. Click "Backup" → Sezione "Firebase Cloud"
3. Click "Backup" → Dovrebbe funzionare!
4. Verifica su Firebase Console → Firestore → `backups` → dovresti vedere i tuoi dati

## Deploy con Firebase

### Netlify/Vercel

Aggiungi le variabili d'ambiente nel dashboard:

**Netlify:**
- Site Settings → Environment variables
- Aggiungi tutte le `VITE_FIREBASE_*`

**Vercel:**
- Project Settings → Environment Variables
- Aggiungi tutte le `VITE_FIREBASE_*`

### Variabili richieste:
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

## Sicurezza

### Non committare credenziali!

❌ **MAI** committare `.env` su Git
✅ `.env` è già in `.gitignore`
✅ Usa variabili d'ambiente per production

### Regole Firestore sicure

Le regole di esempio sopra permettono solo agli utenti autenticati (anche anonimamente) di accedere ai loro dati.

Per maggiore sicurezza, puoi:

```javascript
match /backups/{userId} {
  // Solo l'utente stesso può accedere
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

## Costi Firebase

**Piano Spark (Gratuito):**
- ✅ Firestore: 1 GB storage
- ✅ 10 GB network egress/mese
- ✅ 50K letture/giorno
- ✅ 20K scritture/giorno

Per una libreria personale è **più che sufficiente** (anche con 1000+ libri).

## Troubleshooting

### Errore "Firebase not configured"

**Soluzione:**
1. Verifica che `.env` esista
2. Verifica che tutte le variabili inizino con `VITE_`
3. Riavvia dev server: `npm run dev`

### Errore "Permission denied"

**Soluzione:**
1. Verifica regole Firestore
2. Verifica autenticazione anonima abilitata
3. Controlla console Firebase per errori

### Build fallisce con errore Firebase

**Soluzione:**
Se non usi Firebase, non è necessario installarlo. L'app usa **importazione dinamica** e carica Firebase solo se configurato.

Se vuoi rimuoverlo completamente:
```bash
npm uninstall firebase
```

L'app funzionerà comunque con gli altri metodi di backup!

## Alternative a Firebase

Se Firebase ti sembra troppo complesso:

1. **GitHub Gist** (raccomandato)
   - Setup 1 minuto
   - Gratuito e illimitato
   - Privato

2. **Browser Sync**
   - Zero setup
   - Automatico
   - Limite 100KB

3. **Download JSON**
   - Sempre disponibile
   - Controllo totale

---

**Firebase è opzionale. L'app è completamente funzionale senza!** 🎉
