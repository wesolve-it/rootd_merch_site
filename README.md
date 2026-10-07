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

Hosting: Netlify (`netlify.toml`). Die Inhaltsseiten sind statisch; `/tina-island/*` (Live-Vorschau im Editor) und `/api/anfrage` laufen als Netlify Functions. Speichert der Kunde im Editor, committet Tina Cloud auf `main` und Netlify deployt automatisch.

Das Anfrageformular versendet über [Resend](https://resend.com). Dafür müssen die Absenderdomain verifiziert und diese Variablen gesetzt sein:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL` (z. B. `ROOTED MERCH <anfrage@rooted-merch.de>`)
- `CONTACT_TO_EMAIL`

Ohne diese Variablen zeigt das Formular eine verständliche Fehlermeldung und verweist auf den direkten E-Mail-Kontakt.

### Analytics mit Umami

Umami ist zentral im Seitenlayout eingebunden. Das Tracking wird nur ausgegeben, wenn eine Website-ID gesetzt ist, und durch `data-domains` auf `rooted-merch.de` sowie `www.rooted-merch.de` beschränkt. Lokale Entwicklung und Netlify-Deploy-Previews fließen daher nicht in die Statistik ein. Zusätzlich respektiert der Tracker die Do-Not-Track-Einstellung des Browsers und erfasst die Core Web Vitals.

Die Website-ID ist für das Netlify-Deployment bereits in `netlify.toml` hinterlegt. Für abweichende Umgebungen stehen diese Variablen zur Verfügung:

- `PUBLIC_UMAMI_WEBSITE_ID`: ID aus dem Umami-Tracking-Code
- `PUBLIC_UMAMI_SCRIPT_URL`: optional; nur bei Self-Hosting abweichend von `https://cloud.umami.is/script.js`

Nach einer Änderung der Variablen ist ein neues Netlify-Deployment erforderlich.

Erfasste Conversion-Events:

- `inquiry_cta_click` mit `location`: Klick auf einen Anfrage-CTA
- `inquiry_submit_success`: Anfrage wurde vom Server erfolgreich angenommen
- `email_click` mit `location`: Klick auf eine Kontakt-E-Mail-Adresse
- `projects_view`: mindestens 50 Prozent des Projektbereichs waren sichtbar

Formularinhalte und andere personenbezogene Angaben werden nicht als Event-Daten übertragen.

### Einmalige Einrichtung

1. **Tina Cloud** ([app.tina.io](https://app.tina.io)): Projekt anlegen, GitHub-Repo `wesolve-it/rootd_merch_site` verbinden, Branch `main`, Site-URL `https://www.rooted-merch.de` eintragen. Client-ID und einen Read-Only-Token kopieren. Kunden unter „Users“ als Editor einladen.
2. **Netlify**: Unter *Site configuration → Environment variables* die Tina-, Formular- und Umami-Variablen aus `.env.example` anlegen. Build-Einstellungen kommen aus `netlify.toml`.
