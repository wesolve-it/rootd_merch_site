/**
 * Registry aller Bereiche, die im Tina-Editor live aktualisiert werden.
 * Die Route /tina-island/[name] rendert anhand dieser Einträge neu.
 */
import type { IslandRegistry } from '@tinacms/astro/experimental';
import type { QueryResult } from '@tinacms/astro/data';
import type { HomeQuery, SettingsQuery } from '../../tina/__generated__/types';
import type { Home, Settings } from './data';
import { getHome, getSettings } from './data';
import HomeBody from '../components/HomeBody.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

export const islands: IslandRegistry = {
  home: {
    fetch: () => getHome(),
    component: HomeBody,
    wrapper: { tag: 'main' },
    propsFromData: (data) => ({
      home: (data as QueryResult<HomeQuery>).data?.home as Home | undefined,
    }),
  },
  header: {
    fetch: () => getSettings(),
    component: Header,
    wrapper: { tag: 'header' },
    propsFromData: (data) => ({
      settings: (data as QueryResult<SettingsQuery>).data?.settings as Settings | undefined,
    }),
  },
  footer: {
    fetch: () => getSettings(),
    component: Footer,
    wrapper: { tag: 'footer' },
    propsFromData: (data) => ({
      settings: (data as QueryResult<SettingsQuery>).data?.settings as Settings | undefined,
    }),
  },
};
