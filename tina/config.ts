import { defineConfig } from 'tinacms';
import { HomeCollection } from './collections/home';
import { SettingsCollection } from './collections/settings';

// Netlify setzt HEAD auf den gebauten Branch
const branch = process.env.GITHUB_BRANCH || process.env.HEAD || 'main';

export default defineConfig({
  branch,
  clientId: process.env.PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [HomeCollection, SettingsCollection],
  },
});
