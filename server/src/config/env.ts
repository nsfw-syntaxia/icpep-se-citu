export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length < 16) {
    throw new Error(
      "JWT_SECRET must be set to a random string of at least 16 characters.",
    );
  }
  return secret;
};

export const getDefaultPassword = (): string =>
  process.env.DEFAULT_PASSWORD || "123456";
