# Come installare Firebase (Opzionale)

Firebase è **completamente opzionale**!

## Se NON vuoi usare Firebase:

✅ **Non fare nulla!** L'app funziona già con:
- GitHub Gist backup
- Download JSON
- Browser Sync
- Auto-backup emergenza

## Se VUOI usare Firebase:

```bash
# 1. Installa Firebase
npm install firebase

# 2. Crea file .env (vedi FIREBASE_SETUP.md per le istruzioni)
cp .env.example .env

# 3. Configura le credenziali in .env

# 4. Riavvia
npm run dev
```

Guida completa: vedi **FIREBASE_SETUP.md**

---

**TL;DR: Firebase non è necessario, ma puoi aggiungerlo se vuoi sync cloud automatico.**
