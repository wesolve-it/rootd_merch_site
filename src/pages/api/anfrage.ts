import type { APIRoute } from 'astro';

export const prerender = false;

const json = (status: number, message: string) =>
  new Response(JSON.stringify({ message }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const clean = (value: FormDataEntryValue | null, max = 2000) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character] ?? character);

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return json(403, 'Diese Anfrage wurde aus Sicherheitsgründen abgelehnt.');
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, 'Die Formulardaten konnten nicht gelesen werden.');
  }

  if (clean(form.get('website'), 200)) {
    return json(200, 'Vielen Dank! Wir melden uns so bald wie möglich.');
  }

  const startedAt = Number(clean(form.get('startedAt'), 20));
  if (startedAt && Date.now() - startedAt < 1500) {
    return json(429, 'Bitte wartet einen Moment und sendet die Anfrage erneut.');
  }

  const organisation = clean(form.get('organisation'), 120);
  const name = clean(form.get('name'), 120);
  const email = clean(form.get('email'), 200);
  const product = clean(form.get('product'), 120);
  const quantity = clean(form.get('quantity'), 20);
  const deadline = clean(form.get('deadline'), 20);
  const message = clean(form.get('message'));
  const privacy = clean(form.get('privacy'), 20);

  if (!organisation || !name || !email || !product || privacy !== 'accepted') {
    return json(422, 'Bitte füllt alle Pflichtfelder aus und bestätigt die Datenschutzhinweise.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(422, 'Bitte gebt eine gültige E-Mail-Adresse ein.');
  }
  if (quantity && (!/^\d+$/.test(quantity) || Number(quantity) < 1 || Number(quantity) > 100000)) {
    return json(422, 'Bitte prüft die angegebene Stückzahl.');
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO_EMAIL;
  const from = import.meta.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error('Inquiry form is missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL.');
    return json(503, 'Das Formular ist gerade nicht verfügbar. Bitte schreibt uns direkt per E-Mail.');
  }

  const rows = [
    ['Organisation', organisation],
    ['Ansprechpartner:in', name],
    ['E-Mail', email],
    ['Produkt', product],
    ['Stückzahl', quantity || 'Nicht angegeben'],
    ['Wunschtermin', deadline || 'Nicht angegeben'],
    ['Nachricht', message || 'Keine zusätzliche Nachricht'],
  ];
  const html = `<h1>Neue Projektanfrage</h1>${rows
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong><br>${escapeHtml(value).replace(/\n/g, '<br>')}</p>`)
    .join('')}`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Projektanfrage von ${organisation.replace(/[\r\n]/g, ' ')}`,
        html,
      }),
    });
    if (!response.ok) {
      console.error('Resend rejected inquiry:', response.status, await response.text());
      return json(502, 'Die Anfrage konnte gerade nicht zugestellt werden. Bitte versucht es erneut oder schreibt uns per E-Mail.');
    }
  } catch (error) {
    console.error('Inquiry delivery failed:', error);
    return json(502, 'Die Anfrage konnte gerade nicht zugestellt werden. Bitte versucht es erneut oder schreibt uns per E-Mail.');
  }

  return json(200, 'Vielen Dank! Wir melden uns persönlich bei euch.');
};
