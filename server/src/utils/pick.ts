// Copies only the listed keys from a request body. Anything not listed (ids,
// authorship, counters, internal flags) is dropped rather than written.
export const pickFields = (
  source: Record<string, unknown>,
  fields: readonly string[]
): Record<string, unknown> =>
  Object.fromEntries(
    fields.filter((field) => field in source).map((field) => [field, source[field]])
  );
