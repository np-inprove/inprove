// Reference: https://github.com/pilcrowOnPaper/lucia/blob/main/packages/lucia/src/scrypt/pbkdf.ts

import { subtle } from 'node:crypto'

export async function pbkdf2(password: Uint8Array,
  salt: Uint8Array,
  options: {
    c: number
    dkLen: number
  }) {
  const pwKey = await subtle.importKey(
    'raw',
    password,
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const keyBuffer = await subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt,
      iterations: options.c,
    },
    pwKey,
    options.dkLen * 8,
  )

  return new Uint8Array(keyBuffer)
}
