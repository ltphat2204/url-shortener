import { customAlphabet } from 'nanoid';
const BASE62_CHARS =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function generateShortCode(): string {
  const shortCodeLength: number = process.env.short_code_length
    ? parseInt(process.env.short_code_length)
    : 7;
  const nanoid = customAlphabet(BASE62_CHARS, shortCodeLength);
  return nanoid();
}
