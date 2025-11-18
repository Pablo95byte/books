# PWA Icons

Questa cartella contiene le icone per la Progressive Web App.

## Come generare le icone

Puoi usare uno dei seguenti metodi:

### Metodo 1: Online (Consigliato)
1. Vai su https://www.pwabuilder.com/imageGenerator
2. Carica un'immagine quadrata (512x512px minimo, meglio 1024x1024px)
3. Scarica il pacchetto di icone
4. Copia tutti i file `icon-*.png` in questa cartella

### Metodo 2: Usando realfavicongenerator.net
1. Vai su https://realfavicongenerator.net/
2. Carica la tua immagine
3. Configura le impostazioni
4. Scarica e estrai le icone
5. Rinomina i file secondo questo schema:
   - icon-72x72.png
   - icon-96x96.png
   - icon-128x128.png
   - icon-144x144.png
   - icon-152x152.png
   - icon-192x192.png
   - icon-384x384.png
   - icon-512x512.png

### Metodo 3: Usando ImageMagick (CLI)
Se hai ImageMagick installato, usa questo script:

```bash
#!/bin/bash
# Partendo da un'immagine 1024x1024 chiamata icon-source.png

convert icon-source.png -resize 72x72 icon-72x72.png
convert icon-source.png -resize 96x96 icon-96x96.png
convert icon-source.png -resize 128x128 icon-128x128.png
convert icon-source.png -resize 144x144 icon-144x144.png
convert icon-source.png -resize 152x152 icon-152x152.png
convert icon-source.png -resize 192x192 icon-192x192.png
convert icon-source.png -resize 384x384 icon-384x384.png
convert icon-source.png -resize 512x512 icon-512x512.png
```

## Icone necessarie

Le seguenti dimensioni sono richieste per la PWA:

- **72x72** - Android small
- **96x96** - Android medium
- **128x128** - Android large
- **144x144** - Android extra large
- **152x152** - iOS
- **192x192** - Android standard (richiesto)
- **384x384** - Android extra large
- **512x512** - Android maskable (richiesto)

## Nota temporanea

Fino a quando non generi le tue icone personalizzate, l'app userà icone placeholder.
Per il corretto funzionamento della PWA, genera e aggiungi le icone in questa cartella.
