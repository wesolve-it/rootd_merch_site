import type { Collection } from 'tinacms';

export const SettingsCollection: Collection = {
  name: 'settings',
  label: 'Allgemeine Einstellungen',
  path: 'content/settings',
  format: 'json',
  ui: {
    global: true,
    allowedActions: { create: false, delete: false },
  },
  fields: [
    {
      name: 'seo',
      label: 'Suchmaschinen (SEO)',
      type: 'object',
      fields: [
        {
          name: 'title',
          label: 'Seitentitel',
          description: 'Wird im Browser-Tab und bei Google angezeigt.',
          type: 'string',
          required: true,
        },
        {
          name: 'description',
          label: 'Beschreibung',
          description: 'Kurzer Text für Google-Suchergebnisse und geteilte Links (ca. 150 Zeichen).',
          type: 'string',
          ui: { component: 'textarea' },
        },
      ],
    },
    { name: 'logo', label: 'Logo', type: 'image' },
    {
      name: 'email',
      label: 'Kontakt-E-Mail',
      description: 'Wird für alle „Anfragen“-Buttons und im Footer verwendet.',
      type: 'string',
      required: true,
    },
    {
      name: 'footer',
      label: 'Footer',
      type: 'object',
      fields: [
        { name: 'company', label: 'Firmenname', type: 'string' },
        {
          name: 'addressLines',
          label: 'Adresszeilen',
          description: 'Eine Zeile pro Eintrag, z. B. Inhaber, Straße, PLZ und Ort.',
          type: 'string',
          list: true,
        },
        { name: 'linksHeading', label: 'Überschrift Links', type: 'string' },
        {
          name: 'links',
          label: 'Links',
          type: 'object',
          list: true,
          ui: { itemProps: (item) => ({ label: item?.label }) },
          fields: [
            { name: 'label', label: 'Text', type: 'string', required: true },
            { name: 'url', label: 'Adresse (URL)', type: 'string', required: true },
          ],
        },
        { name: 'emailPrefix', label: 'Text vor der E-Mail-Adresse', type: 'string' },
      ],
    },
  ],
};
