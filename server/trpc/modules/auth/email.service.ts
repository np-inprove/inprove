// Will be polyfilled, alls good
import { getRandomValues } from 'node:crypto'
import { generateScryptHash, validateScryptHash } from './crypto.service'

function getRandomIntInclusive(min: number, max: number) {
  const randomBuffer = new Uint32Array(1)

  getRandomValues(randomBuffer)

  const randomNumber = randomBuffer[0] / (0xFFFFFFFF + 1)

  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(randomNumber * (max - min + 1)) + min
}

export function createVfnToken() {
  return getRandomIntInclusive(0, 1000000).toString().padStart(6, '0')
}

export async function createTokenHash(token: string, email: string) {
  return await generateScryptHash(token, email)
}

export async function compareHash(token: string, email: string, hash: string) {
  return await validateScryptHash(token, email, hash)
}
