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
