# Merchseite Rootd

Onepager für [rooted-merch.de](https://www.rooted-merch.de) – gebaut mit [Astro](https://astro.build), [Tailwind CSS v4](https://tailwindcss.com) und [TinaCMS](https://tina.io) für die Inhaltspflege durch den Kunden.

## Lokale Entwicklung

Voraussetzung: Node.js 22 oder neuer.

```sh
npm install
npm run dev
```

- Seite: http://localhost:4321
- Editor: http://localhost:4321/admin/index.html (lokaler Modus, speichert direkt in die Dateien unter `content/`)

## Struktur

| Pfad | Inhalt |
|---|---|
| `content/pages/home.json` | Alle Texte, Listen und Bilder der Startseite |
| `content/settings/settings.json` | Seitentitel, SEO, Logo, Kontakt-E-Mail, Footer |
| `public/uploads/` | Bilder (Tina-Medienbibliothek) |
| `tina/collections/` | Tina-Schema – legt fest, welche Felder im Editor bearbeitbar sind |
| `src/components/sections/` | Ein Astro-Component pro Seitenbereich |
| `src/lib/islands.ts` | Bereiche, die im Editor live aktualisiert werden |

Neues Feld hinzufügen: im Schema unter `tina/collections/` ergänzen, `npm run dev` neu starten (generiert die Typen in `tina/__generated__/`), dann im Component verwenden und mit `data-tina-field={tinaField(obj, 'feld')}` für Klick-zum-Bearbeiten markieren.

Jeder Bereich hat einen Schalter „Bereich anzeigen“. Der Preisbereich ist so lange ausgeblendet, bis echte Preise eingetragen sind.

## Build & Deployment

- `npm run build` – Produktions-Build gegen Tina Cloud (benötigt `PUBLIC_TINA_CLIENT_ID` und `TINA_TOKEN`, siehe `.env.example`)
- `npm run build:local` – Build ohne Tina Cloud, z. B. zum Testen

Hosting: Netlify (`netlify.toml`). Alle Seiten sind statisch, nur `/tina-island/*` (Live-Vorschau im Editor) läuft als Netlify Function. Speichert der Kunde im Editor, committet Tina Cloud auf `main` und Netlify deployt automatisch.

### Einmalige Einrichtung

1. **Tina Cloud** ([app.tina.io](https://app.tina.io)): Projekt anlegen, GitHub-Repo `wesolve-it/rootd_merch_site` verbinden, Branch `main`, Site-URL `https://www.rooted-merch.de` eintragen. Client-ID und einen Read-Only-Token kopieren. Kunden unter „Users“ als Editor einladen.
2. **Netlify**: Unter *Site configuration → Environment variables* `PUBLIC_TINA_CLIENT_ID` und `TINA_TOKEN` anlegen. Build-Einstellungen kommen aus `netlify.toml`.
