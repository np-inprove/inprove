import scrypt from './scrypt/index.js'

export async function generateScryptHash(s: string, salt: string): Promise<string> {
  const key = await hashWithScrypt(s.normalize('NFKC'), salt)
  return `s2:${key}`
}

async function hashWithScrypt(s: string,
  salt: string,
  blockSize = 16): Promise<string> {
  const keyUint8Array = await scrypt(
    new TextEncoder().encode(s),
    new TextEncoder().encode(salt),
    {
      N: 16384,
      r: blockSize,
      p: 1,
      dkLen: 64,
    },
  )
  return convertUint8ArrayToHex(keyUint8Array)
}

export async function validateScryptHash(s: string, salt: string, hash: string): Promise<boolean> {
  const arr = hash.split(':')
  const [version, key] = arr
  if (version === 's2') {
    const targetKey = await hashWithScrypt(s.normalize('NFKC'), salt)
    const result = constantTimeEqual(targetKey, key)
    return result
  }
  return false
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length)
    return false

  const aUint8Array = new TextEncoder().encode(a)
  const bUint8Array = new TextEncoder().encode(b)

  let c = 0
  for (let i = 0; i < a.length; i++)
    c |= aUint8Array[i] ^ bUint8Array[i] // ^: XOR operator

  return c === 0
}

export function convertUint8ArrayToHex(arr: Uint8Array): string {
  return [...arr].map(x => x.toString(16).padStart(2, '0')).join('')
}
