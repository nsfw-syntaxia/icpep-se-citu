import { describe, it, expect, afterEach } from "vitest";
import { getJwtSecret, getDefaultPassword } from "../config/env";

const original = { ...process.env };
afterEach(() => {
  process.env = { ...original };
});

describe("getJwtSecret", () => {
  it("returns the configured secret", () => {
    process.env.JWT_SECRET = "a-secret-that-is-long-enough";
    expect(getJwtSecret()).toBe("a-secret-that-is-long-enough");
  });

  it("refuses to run without a secret", () => {
    delete process.env.JWT_SECRET;
    expect(() => getJwtSecret()).toThrow(/JWT_SECRET/);
  });

  it("refuses a short secret", () => {
    process.env.JWT_SECRET = "short";
    expect(() => getJwtSecret()).toThrow(/JWT_SECRET/);
  });
});

describe("getDefaultPassword", () => {
  it("uses DEFAULT_PASSWORD when set", () => {
    process.env.DEFAULT_PASSWORD = "Chapter#2026";
    expect(getDefaultPassword()).toBe("Chapter#2026");
  });

  it("falls back when unset", () => {
    delete process.env.DEFAULT_PASSWORD;
    expect(getDefaultPassword()).toBe("123456");
  });
});
