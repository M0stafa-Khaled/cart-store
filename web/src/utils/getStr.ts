export const getString = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;
