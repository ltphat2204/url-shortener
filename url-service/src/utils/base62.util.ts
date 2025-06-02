const BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
export function toBase62(num: number): string {
  if (num === 0) return BASE62_CHARS[0];
  let base62 = "";
  while (num > 0) {
    base62 = BASE62_CHARS[num % 62] + base62;
    num = Math.floor(num / 62);
  }
  return base62;
}