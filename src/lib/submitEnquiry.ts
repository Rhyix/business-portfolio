import { company } from '../data/company'

/**
 * Contact form delivery, via Web3Forms.
 *
 * Everything provider-specific lives in this file — the endpoint, the payload
 * shape, the response contract — so `ContactForm` only ever sees a value it
 * can render. Swapping provider means rewriting this module and nothing else.
 *
 * Why a managed endpoint rather than a function of our own: the deployment
 * host is still undecided, and this is the only arrangement that delivers real
 * mail without one. It also means the site ships no private credential — see
 * the note on the access key in `src/vite-env.d.ts`.
 */

const ENDPOINT = 'https://api.web3forms.com/submit'

/** Long enough for a slow connection, short enough that the form never hangs. */
const TIMEOUT_MS = 15_000

const accessKey = (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? '').trim()

export interface EnquiryValues {
  name: string
  email: string
  organisation: string
  projectType: string
  message: string
}

/**
 * Why the enquiry did not go through. The caller maps each of these to copy;
 * the raw provider response never reaches the visitor.
 */
export type EnquiryFailure =
  | 'missing-config'
  | 'network'
  | 'rejected'
  | 'malformed'
  | 'unexpected'

export type EnquiryResult = { ok: true } | { ok: false; reason: EnquiryFailure }

/** Whether an access key is present to deliver with. */
function isDeliveryConfigured(): boolean {
  return accessKey.length > 0
}

/** Narrows the provider's JSON without trusting its shape. */
function readSuccessFlag(body: unknown): boolean | null {
  if (typeof body !== 'object' || body === null) return null
  const { success } = body as { success?: unknown }
  return typeof success === 'boolean' ? success : null
}

/**
 * Posts one enquiry and reports what actually happened.
 *
 * `honeypot` carries the hidden field straight through to the provider rather
 * than being judged here: Web3Forms rejects a filled `botcheck` itself, and
 * dropping it locally would mean either reporting a success that never
 * happened or inventing an error — the first is the fake success this form
 * exists to avoid, so the provider decides.
 *
 * The visitor's address is used only as `replyto`. It is metadata for the
 * reply, never a credential, and nothing here trusts it for anything else.
 */
export async function submitEnquiry(
  values: EnquiryValues,
  honeypot: string,
): Promise<EnquiryResult> {
  if (!isDeliveryConfigured()) {
    // Names the missing variable for whoever is deploying, which the visitor-
    // facing copy deliberately does not. Nothing secret is printed, and this
    // only ever runs on a site that has not been configured yet.
    console.error(
      'Contact form: VITE_WEB3FORMS_ACCESS_KEY is not set, so the enquiry was not sent. See .env.example.',
    )
    return { ok: false, reason: 'missing-config' }
  }

  const organisation = values.organisation.trim()

  // Keys other than the provider's own reserved ones become labelled lines in
  // the email body, which is why these read as prose rather than field names.
  const payload = {
    access_key: accessKey,
    subject: `AETEX enquiry — ${values.projectType}`,
    from_name: values.name,
    replyto: values.email,
    botcheck: honeypot,
    Name: values.name,
    Email: values.email,
    Organisation: organisation || 'Not provided',
    'Project type': values.projectType,
    Message: values.message,
    'Submitted (UTC)': new Date().toISOString(),
    Source: `${company.name} website contact form`,
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    let response: Response
    try {
      response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
    } catch {
      // Offline, DNS failure, blocked request, or our own timeout.
      return { ok: false, reason: 'network' }
    }

    let body: unknown
    try {
      body = await response.json()
    } catch {
      return { ok: false, reason: 'malformed' }
    }

    const success = readSuccessFlag(body)
    if (success === null) return { ok: false, reason: 'malformed' }
    if (!success || !response.ok) return { ok: false, reason: 'rejected' }

    return { ok: true }
  } catch {
    return { ok: false, reason: 'unexpected' }
  } finally {
    clearTimeout(timeout)
  }
}
