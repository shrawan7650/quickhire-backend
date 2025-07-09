export function safeJsonParse<T = any>(str: string): T | string {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}
