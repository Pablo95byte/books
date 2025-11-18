# 🚀 Deploy Guide

Guida completa al deployment di Library Tracker PWA su varie piattaforme.

## 📋 Pre-requisiti Deploy

Prima del deploy, assicurati di:

1. ✅ **Build funzionante localmente**
   ```bash
   npm run build
   npm run preview
   ```

2. ✅ **Icone PWA generate**
   - Vedi `public/icons/README.md`
   - Genera tutte le dimensioni richieste

3. ✅ **Test su device reali**
   - Mobile Android/iOS
   - Desktop Chrome/Firefox/Safari

4. ✅ **Lighthouse score > 90**
   - Performance
   - Accessibility
   - Best Practices
   - SEO
   - PWA

## 🌐 Netlify (Consigliato)

### Metodo 1: Drag & Drop (Quick)

1. **Build locale:**
   ```bash
   npm run build
   ```

2. **Vai su Netlify Drop:**
   https://app.netlify.com/drop

3. **Trascina la cartella `/dist`**

4. **Done!** Il tuo sito è live.

### Metodo 2: CLI

1. **Installa Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Metodo 3: Git Continuous Deployment

1. **Connetti repository su netlify.com**

2. **Configurazione build:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18 (in `netlify.toml`)

3. **Crea `netlify.toml`:**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [build.environment]
     NODE_VERSION = "18"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200

   [[headers]]
     for = "/sw.js"
     [headers.values]
       Cache-Control = "no-cache"

   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-XSS-Protection = "1; mode=block"
       X-Content-Type-Options = "nosniff"
       Referrer-Policy = "strict-origin-when-cross-origin"
   ```

4. **Push su GitHub:**
   ```bash
   git add .
   git commit -m "Deploy configuration"
   git push origin main
   ```

5. **Netlify fa deploy automatico ad ogni push!**

### Custom Domain su Netlify

1. Vai su **Site settings → Domain management**
2. **Add custom domain**
3. Configura DNS:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: yoursite.netlify.app
   ```

## 🔷 Vercel

### Deploy con CLI

1. **Installa Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

### Deploy via GitHub

1. **Vai su vercel.com**

2. **Import repository**

3. **Configure:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Deploy!**

### Vercel Configuration (`vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

## 🐙 GitHub Pages

1. **Modifica `vite.config.js`:**
   ```javascript
   export default defineConfig({
     base: '/repository-name/', // ← ADD THIS
     // ... rest of config
   });
   ```

2. **Installa gh-pages:**
   ```bash
   npm install -D gh-pages
   ```

3. **Aggiungi script in `package.json`:**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Configura GitHub:**
   - Repository → Settings → Pages
   - Source: `gh-pages` branch
   - URL: `https://username.github.io/repository-name`

### GitHub Actions (Automatic Deploy)

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build

    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🔵 Cloudflare Pages

1. **Vai su Cloudflare Pages**

2. **Connect to Git**

3. **Configurazione:**
   - Build command: `npm run build`
   - Build output: `dist`
   - Root directory: `/`

4. **Deploy!**

### Cloudflare Workers (Advanced)

Per funzionalità serverless:

```javascript
// workers/api.js
export default {
  async fetch(request) {
    // API logic here
    return new Response('Hello from Cloudflare!');
  }
}
```

## 🌍 Custom Server / VPS

### Setup su Ubuntu Server

1. **Installa Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone repository:**
   ```bash
   git clone <your-repo>
   cd library-tracker-pwa
   ```

3. **Install & Build:**
   ```bash
   npm install
   npm run build
   ```

4. **Serve con Nginx:**
   ```bash
   sudo apt install nginx

   # Copia build
   sudo cp -r dist/* /var/www/html/

   # Configura Nginx
   sudo nano /etc/nginx/sites-available/default
   ```

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       index index.html;

       # SPA routing
       location / {
           try_files $uri $uri/ /index.html;
       }

       # Service Worker
       location /sw.js {
           add_header Cache-Control "no-cache";
       }

       # Gzip compression
       gzip on;
       gzip_types text/css application/javascript application/json;
   }
   ```

5. **Restart Nginx:**
   ```bash
   sudo systemctl restart nginx
   ```

6. **SSL con Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## 🐳 Docker

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /sw.js {
        add_header Cache-Control "no-cache";
    }

    gzip on;
    gzip_types text/css application/javascript;
}
```

### Build & Run

```bash
# Build image
docker build -t library-tracker .

# Run container
docker run -d -p 8080:80 library-tracker

# Open http://localhost:8080
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

```bash
docker-compose up -d
```

## ☁️ AWS S3 + CloudFront

### Upload su S3

1. **Crea bucket S3**

2. **Enable static website hosting**

3. **Upload build:**
   ```bash
   npm run build
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

4. **Configure bucket policy:**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

### CloudFront Distribution

1. **Create distribution**
2. **Origin:** Your S3 bucket
3. **Default root object:** `index.html`
4. **Error pages:**
   - 404 → `/index.html` (for SPA routing)
   - 403 → `/index.html`

## 🔐 Environment Variables

Per deploy con variabili d'ambiente:

### Netlify
```bash
netlify env:set API_URL https://api.example.com
```

### Vercel
```bash
vercel env add API_URL production
```

### GitHub Pages
Non supporta env vars lato server, usa build-time:

```javascript
// vite.config.js
export default defineConfig({
  define: {
    'import.meta.env.API_URL': JSON.stringify(process.env.API_URL)
  }
});
```

## ✅ Post-Deploy Checklist

Dopo ogni deploy, verifica:

- [ ] ✅ PWA installabile (Chrome DevTools → Application)
- [ ] ✅ Service Worker attivo
- [ ] ✅ Offline mode funzionante
- [ ] ✅ Manifest.json accessibile
- [ ] ✅ Icone caricate correttamente
- [ ] ✅ HTTPS abilitato
- [ ] ✅ Routing funziona (refresh su /library)
- [ ] ✅ Performance Lighthouse > 90
- [ ] ✅ No errori console
- [ ] ✅ Test su mobile reale
- [ ] ✅ Dark mode funziona
- [ ] ✅ Database funziona (add/edit/delete)
- [ ] ✅ Import/Export funziona
- [ ] ✅ Grafici si caricano

## 📊 Monitoring

### Setup Analytics

```javascript
// main.jsx
if (import.meta.env.PROD) {
  // Google Analytics
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
}
```

### Error Tracking (Sentry)

```bash
npm install @sentry/react
```

```javascript
// main.jsx
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: "your-sentry-dsn",
    environment: "production",
  });
}
```

## 🔄 CI/CD Pipeline

### Example: GitHub Actions + Netlify

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: 18

    - name: Install
      run: npm ci

    - name: Build
      run: npm run build

    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      with:
        args: deploy --prod --dir=dist
```

## 💡 Tips & Best Practices

1. **Use CDN** - Netlify/Vercel hanno CDN global built-in
2. **Enable Compression** - Gzip/Brotli per file statici
3. **Cache Strategy** - Aggressive caching per assets, no-cache per HTML
4. **Monitor Performance** - Usa Lighthouse CI
5. **Staging Environment** - Test su preview prima di prod
6. **Rollback Ready** - Mantieni le vecchie build
7. **Health Checks** - Setup uptime monitoring

---

**Buon deploy! 🚀**
