/**
 * Datenlader für Tina. `requestWithMetadata()` sorgt dafür, dass im
 * Tina-Editor ungespeicherte Änderungen live einfließen und `tinaField()`
 * die Felder zuordnen kann.
 */
import { requestWithMetadata } from '@tinacms/astro/data';
import client from '../../tina/__generated__/client';

export const getSettings = () =>
  requestWithMetadata(client.queries.settings({ relativePath: 'settings.json' }));

export const getHome = () =>
  requestWithMetadata(client.queries.home({ relativePath: 'home.json' }), { priority: 'primary' });

export type Settings = Awaited<ReturnType<typeof getSettings>>['data']['settings'];
export type Home = Awaited<ReturnType<typeof getHome>>['data']['home'];

/** Entfernt die `null`-Einträge, die Tina in Listen liefern kann. */
export const compact = <T>(list?: (T | null | undefined)[] | null): T[] =>
  (list ?? []).filter((item): item is T => item != null);
