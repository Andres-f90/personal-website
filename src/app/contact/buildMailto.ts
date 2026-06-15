export type MailtoParams = {
  to: string
  name: string
  subject: string
  message: string
}

// Build a mailto: URL. Uses encodeURIComponent (not URLSearchParams) so spaces
// become %20 and newlines %0A — URLSearchParams would encode spaces as "+",
// which many mail clients render literally in the body.
export function buildMailto({ to, name, subject, message }: MailtoParams): string {
  const body = `Name: ${name}\n\n${message}`
  const query = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  return `mailto:${to}?${query}`
}
