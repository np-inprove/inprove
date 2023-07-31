// Reference: https://github.com/pilcrowOnPaper/lucia/blob/main/packages/lucia/src/scrypt/utils.ts

export function u32(arr: Uint8Array) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4))
}

export async function nextTick() {}

export function checkOpts<T1 extends object, T2 extends object>(
  defaults: T1,
  opts?: T2,
): T1 & T2 {
  const merged = Object.assign(defaults, opts)
  return merged as T1 & T2
}

export async function asyncLoop(iters: number,
  tick: number,
  cb: (i: number) => void) {
  let ts = Date.now()
  for (let i = 0; i < iters; i++) {
    cb(i)
    const diff = Date.now() - ts
    if (diff >= 0 && diff < tick)
      continue
    await nextTick()
    ts += diff
  }
}
