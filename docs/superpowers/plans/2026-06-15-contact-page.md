# Contact Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder `/contact` page with a contact page showing direct contact methods, social links, and a mailto-based message form.

**Architecture:** A `"use client"` page component (`contact.tsx`) renders the header, tappable email/phone rows, footer-style social icon buttons, and a Name/Subject/Message form. On submit, a pure helper `buildMailto` constructs a percent-encoded `mailto:` URL and the browser opens the visitor's email client. No backend.

**Tech Stack:** Next.js 14 (App Router), React 18, Tailwind CSS, TypeScript, Vitest (added for the helper unit test).

---

## File Structure

- Create: `src/app/contact/buildMailto.ts` — pure mailto-URL builder.
- Create: `src/app/contact/buildMailto.test.ts` — unit tests for the builder.
- Modify: `src/app/contact/contact.tsx` — the contact page UI + form (currently a placeholder).
- Modify: `package.json` — add Vitest dev dependency and `test` scripts.
- Unchanged: `src/app/contact/page.tsx` — already re-exports `Contact`, no edit needed.

---

## Task 1: Add Vitest test infrastructure

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Vitest**

Run:
```bash
npm install -D vitest
```
Expected: `vitest` added under `devDependencies`, install completes without errors.

- [ ] **Step 2: Add test scripts to package.json**

In `package.json`, update the `"scripts"` block to include `test` and `test:watch`:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
```

- [ ] **Step 3: Verify Vitest runs**

Run:
```bash
npm test
```
Expected: Vitest starts and reports "No test files found" (no tests exist yet). This confirms the runner is wired up.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add vitest test runner"
```

---

## Task 2: buildMailto helper (TDD)

**Files:**
- Create: `src/app/contact/buildMailto.ts`
- Test: `src/app/contact/buildMailto.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/app/contact/buildMailto.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { buildMailto } from './buildMailto'

describe('buildMailto', () => {
  it('percent-encodes subject and body and prefixes the name', () => {
    const url = buildMailto({
      to: 'andresf.cifuentes@icloud.com',
      name: 'Jane Doe',
      subject: 'Hello there',
      message: 'Line one\nLine two',
    })

    expect(url).toBe(
      'mailto:andresf.cifuentes@icloud.com?subject=Hello%20there&body=Name%3A%20Jane%20Doe%0A%0ALine%20one%0ALine%20two'
    )
  })

  it('escapes special characters (& and =) in subject and body', () => {
    const url = buildMailto({
      to: 'a@b.com',
      name: 'A&B',
      subject: 'S=1',
      message: 'x',
    })

    expect(url).toContain('subject=S%3D1')
    expect(url).toContain('body=Name%3A%20A%26B')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm test
```
Expected: FAIL — cannot resolve `./buildMailto` (module does not exist yet).

- [ ] **Step 3: Write minimal implementation**

Create `src/app/contact/buildMailto.ts`:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npm test
```
Expected: PASS — both tests green.

- [ ] **Step 5: Commit**

```bash
git add src/app/contact/buildMailto.ts src/app/contact/buildMailto.test.ts
git commit -m "feat: add buildMailto helper for contact form"
```

---

## Task 3: Contact page UI + form

**Files:**
- Modify: `src/app/contact/contact.tsx`

- [ ] **Step 1: Replace the placeholder with the full page**

Replace the entire contents of `src/app/contact/contact.tsx` with:

```tsx
"use client"

import { useState } from "react"
import { buildMailto } from "./buildMailto"

const EMAIL = "andresf.cifuentes@icloud.com"
const PHONE_DISPLAY = "+57 319 366 2235"
const PHONE_TEL = "+573193662235"

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/andres-felipe-cifuentes-vargas-46708a1b3',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.com/Andresf-90',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/kersonomics',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
]

const Contact = () => {
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    window.location.href = buildMailto({ to: EMAIL, name, subject, message })
  }

  return (
    <main className="text-gray-600 px-4 py-12 max-w-screen-xl mx-auto md:px-8">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-800">Get in touch</h1>
        <p className="mt-3 text-[15px] leading-relaxed">
          Have a question or want to work together? Here&apos;s how to reach me.
        </p>
      </div>

      <div className="max-w-lg mx-auto mt-8 space-y-3">
        <a
          href={`mailto:${EMAIL}`}
          className="block border rounded-lg px-4 py-3 hover:bg-gray-50 text-gray-700"
        >
          ✉️ {EMAIL}
        </a>
        <a
          href={`tel:${PHONE_TEL}`}
          className="block border rounded-lg px-4 py-3 hover:bg-gray-50 text-gray-700"
        >
          📞 {PHONE_DISPLAY}
        </a>
      </div>

      <ul className="flex items-center justify-center space-x-4 mt-8">
        {socialLinks.map((item, idx) => (
          <li
            key={idx}
            className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-50"
          >
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.name}
              className="text-gray-500 hover:text-gray-800"
            >
              {item.icon}
            </a>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-10 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 hover:bg-gray-700"
        >
          Send
        </button>
        <p className="text-xs text-gray-400 text-center">
          This opens your email app with the message pre-filled.
        </p>
      </form>
    </main>
  )
}

export default Contact
```

- [ ] **Step 2: Verify the unit tests still pass**

Run:
```bash
npm test
```
Expected: PASS — `buildMailto` tests still green (unaffected by the UI change).

- [ ] **Step 3: Verify lint passes**

Run:
```bash
npm run lint
```
Expected: No errors for `src/app/contact/contact.tsx`.

- [ ] **Step 4: Verify visually**

Run:
```bash
npm run dev
```
Then open http://localhost:3000/contact. Confirm:
- Header "Get in touch" and the invitation line render.
- Email and phone rows are clickable.
- LinkedIn, GitHub, Instagram icon buttons render and open in new tabs.
- Filling the form and clicking "Send" opens the email client with subject and body pre-filled (body starts with "Name: ...").

- [ ] **Step 5: Commit**

```bash
git add src/app/contact/contact.tsx
git commit -m "feat: build contact page with info, socials, and mailto form"
```

---

## Self-Review Notes

- **Spec coverage:** Header/invitation (Task 3), email + phone tappable rows (Task 3), LinkedIn/GitHub/Instagram footer-style buttons with real URLs (Task 3), mailto message form (Task 3), `buildMailto` helper isolated and unit-tested (Task 2), no QR / no backend (out of scope, honored). `page.tsx` already re-exports `Contact`, so no change needed.
- **Placeholder scan:** No TBD/TODO; every code step contains complete code.
- **Type consistency:** `buildMailto`'s `MailtoParams` ({ to, name, subject, message }) matches the call site in `contact.tsx`.
