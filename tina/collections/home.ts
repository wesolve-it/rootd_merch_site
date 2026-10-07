import type { Collection, TinaField } from 'tinacms';

const show: TinaField = {
  name: 'show',
  label: 'Bereich anzeigen',
  type: 'boolean',
};

const kicker: TinaField = {
  name: 'kicker',
  label: 'Dachzeile',
  description: 'Kleine Zeile über der Überschrift.',
  type: 'string',
};

const heading: TinaField = {
  name: 'heading',
  label: 'Überschrift',
  type: 'string',
};

const textarea = (name: string, label: string, description?: string): TinaField => ({
  name,
  label,
  description,
  type: 'string',
  ui: { component: 'textarea' },
});

export const HomeCollection: Collection = {
  name: 'home',
  label: 'Startseite',
  path: 'content/pages',
  format: 'json',
  ui: {
    router: () => '/',
    allowedActions: { create: false, delete: false },
  },
  fields: [
    {
      name: 'hero',
      label: 'Einstieg (Hero)',
      type: 'object',
      fields: [
        heading,
        { name: 'subheading', label: 'Unterzeile', type: 'string' },
        { name: 'trustLabel', label: 'Vertrauenssignal', description: 'Kurzer Hinweis wie „Design & Druck aus einer Hand“.', type: 'string' },
        { name: 'ctaLabel', label: 'Button-Text', type: 'string' },
        { name: 'secondaryCtaLabel', label: 'Zweiter Button', description: 'Verlinkt zur Projektgalerie.', type: 'string' },
        { name: 'image', label: 'Hintergrundbild', type: 'image' },
      ],
    },
    {
      name: 'customers',
      label: 'Kundenlogos',
      type: 'object',
      fields: [
        show,
        kicker,
        heading,
        {
          name: 'logos',
          label: 'Logos',
          type: 'object',
          list: true,
          ui: { itemProps: (item) => ({ label: item?.name }) },
          fields: [
            {
              name: 'name',
              label: 'Name des Kunden',
              description: 'Wird als Bildbeschreibung für Screenreader und Google verwendet.',
              type: 'string',
              required: true,
            },
            { name: 'image', label: 'Logo', type: 'image' },
            {
              name: 'size',
              label: 'Größe',
              description: 'Damit wirken unterschiedlich geformte Logos gleich groß.',
              type: 'string',
              options: [
                { value: 'sm', label: 'Klein' },
                { value: 'md', label: 'Mittel' },
                { value: 'lg', label: 'Groß' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'services',
      label: 'Leistungen',
      type: 'object',
      fields: [
        show,
        kicker,
        heading,
        {
          name: 'items',
          label: 'Leistungen',
          type: 'object',
          list: true,
          ui: { itemProps: (item) => ({ label: item?.title }) },
          fields: [
            { name: 'icon', label: 'Icon', type: 'image' },
            { name: 'title', label: 'Titel', type: 'string' },
            textarea('text', 'Text'),
          ],
        },
      ],
    },
    {
      name: 'testimonials',
      label: 'Kundenstimmen',
      type: 'object',
      fields: [
        show,
        kicker,
        heading,
        {
          name: 'items',
          label: 'Stimmen',
          type: 'object',
          list: true,
          ui: { itemProps: (item) => ({ label: item?.author }) },
          fields: [
            { name: 'logo', label: 'Logo', type: 'image' },
            { name: 'image', label: 'Person oder Projekt (optional)', type: 'image' },
            textarea('quote', 'Zitat'),
            { name: 'author', label: 'Name & Funktion', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'projects',
      label: 'Realisierte Projekte',
      type: 'object',
      fields: [
        show,
        heading,
        textarea('text', 'Text'),
        {
          name: 'images',
          label: 'Bilder',
          type: 'object',
          list: true,
          ui: { itemProps: (item) => ({ label: item?.alt }) },
          fields: [
            { name: 'image', label: 'Bild', type: 'image' },
            {
              name: 'alt',
              label: 'Bildbeschreibung',
              description: 'Was ist auf dem Bild zu sehen? Z. B. „Hoodie TSV Neunhof“.',
              type: 'string',
            },
            { name: 'customer', label: 'Kunde/Verein', type: 'string' },
            { name: 'product', label: 'Produkt', type: 'string' },
            { name: 'finish', label: 'Veredelung', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'pricing',
      label: 'Preise',
      type: 'object',
      fields: [
        show,
        kicker,
        heading,
        textarea('intro', 'Einleitung'),
        {
          name: 'items',
          label: 'Produkte',
          type: 'object',
          list: true,
          ui: { itemProps: (item) => ({ label: item?.product }) },
          fields: [
            { name: 'product', label: 'Produkt', type: 'string', required: true },
            textarea('description', 'Beschreibung'),
            { name: 'image', label: 'Bild (optional)', type: 'image' },
            {
              name: 'fromPrice',
              label: 'Ab-Preis in €',
              description: 'Wird groß als „ab … €“ angezeigt. Leer lassen = günstigste Staffel.',
              type: 'number',
            },
            { name: 'unit', label: 'Einheit', description: 'Z. B. „pro Stück“.', type: 'string' },
            {
              name: 'tiers',
              label: 'Staffelpreise',
              type: 'object',
              list: true,
              ui: {
                itemProps: (item) => ({
                  label: item?.minQuantity ? `ab ${item.minQuantity} Stück: ${item.price ?? '–'} €` : 'Neue Staffel',
                }),
              },
              fields: [
                { name: 'minQuantity', label: 'Ab Menge (Stück)', type: 'number', required: true },
                { name: 'price', label: 'Preis pro Stück in €', type: 'number', required: true },
              ],
            },
          ],
        },
        textarea('footnote', 'Hinweis unter den Preisen', 'Z. B. „Alle Preise inkl. MwSt., zzgl. Versand.“'),
      ],
    },
    {
      name: 'process',
      label: 'Projektablauf',
      type: 'object',
      fields: [
        show,
        kicker,
        heading,
        {
          name: 'steps',
          label: 'Schritte',
          type: 'object',
          list: true,
          ui: { itemProps: (item) => ({ label: item?.title }) },
          fields: [
            { name: 'title', label: 'Titel', type: 'string' },
            textarea('text', 'Text'),
          ],
        },
        { name: 'ctaLabel', label: 'Button-Text', type: 'string' },
      ],
    },
    {
      name: 'faq',
      label: 'Häufige Fragen',
      type: 'object',
      fields: [
        show,
        kicker,
        heading,
        {
          name: 'items',
          label: 'Fragen',
          type: 'object',
          list: true,
          ui: { itemProps: (item) => ({ label: item?.question }) },
          fields: [
            { name: 'question', label: 'Frage', type: 'string', required: true },
            textarea('answer', 'Antwort'),
          ],
        },
      ],
    },
    {
      name: 'inquiry',
      label: 'Anfrageformular',
      type: 'object',
      fields: [
        show,
        kicker,
        heading,
        textarea('intro', 'Einleitung'),
        { name: 'privacyUrl', label: 'Datenschutz-Link', type: 'string' },
      ],
    },
  ],
};
