const PLACEHOLDERS = ["/placeholders/woman.png", "/placeholders/man.png"] as const;

export const placeholderPhoto = (seed: string): string => {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return PLACEHOLDERS[hash % PLACEHOLDERS.length];
};
