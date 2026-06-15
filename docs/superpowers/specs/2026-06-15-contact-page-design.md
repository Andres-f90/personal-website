# Contact Page Design

**Date:** 2026-06-15
**Route:** `/contact`
**Status:** Approved

## Purpose

Turn the placeholder `/contact` page (currently `<div>Contact</div>`) into a
focused way for visitors to reach the site owner. The page is for contact
methods only — biographical "what I do" content stays on the About/Experience
pages, which are out of scope here.

## Stack & Style

- Next.js 14 (App Router) + Tailwind CSS.
- Match the site's existing gray/white aesthetic.
- Reuse the footer's circular social-icon pattern (`src/app/components/footer/footer.tsx`)
  for visual consistency.

## Layout

Single centered column (consistent with the footer's `max-w-lg sm:mx-auto sm:text-center`).

1. **Header** — `Get in touch` heading plus a one-line invitation, e.g.
   "Have a question or want to work together? Here's how to reach me." No bio.
2. **Direct contact rows** — tappable:
   - Email → `mailto:andresf.cifuentes@icloud.com`, displayed as the address.
   - Phone → `tel:+573193662235`, displayed as `+57 319 366 2235`.
3. **Social buttons** — circular-icon style reused from the footer, each opening
   in a new tab (`target="_blank" rel="noopener noreferrer"`):
   - LinkedIn → `https://www.linkedin.com/in/andres-felipe-cifuentes-vargas-46708a1b3`
   - GitHub → `https://github.com/Andresf-90`
   - Instagram → `https://www.instagram.com/kersonomics`
   - No QR code embedded (a clickable IG link replaces it for web use).
4. **Message form** (mailto-based, no backend):
   - Fields: Name, Subject, Message.
   - On submit, build a `mailto:andresf.cifuentes@icloud.com?subject=...&body=...`
     URL and open the visitor's email client pre-filled.
   - The body includes the visitor's name; subject maps to the Subject field.
   - A small hint tells the visitor the button opens their email app.

## Components & Isolation

- `src/app/contact/contact.tsx` — the page; composes header, contact rows,
  social buttons, and the form.
- A local `socialLinks` array (same shape as the footer's) keeps icons/links
  consistent. Defined locally for now (no shared module extraction in scope).
- The form is a `"use client"` component because it needs an `onSubmit` handler
  to construct the mailto URL.
- A pure helper, `buildMailto({ to, name, subject, message })`, returns the
  encoded mailto URL. Isolated so it can be unit-tested without the DOM.

## Error Handling

- HTML5 `required` validation on form fields; empty fields block submit.
- mailto cannot "fail" from our side — delivery is handed to the visitor's email
  client. If the visitor has no mail client configured, the link does nothing;
  this is an accepted limitation of the mailto approach.

## Testing

- Unit-test `buildMailto` for correct percent-encoding of subject and body
  (spaces, newlines, special characters).
- Verify the page visually with `npm run dev`.

## Out of Scope

- About/Experience page content.
- Any server-side / API form submission (Formspree, Resend) — mailto only for now.
- Embedding the Instagram QR image.
