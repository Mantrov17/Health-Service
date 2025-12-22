// __tests__/formatPhoneNumber.test.ts
import { formatPhoneNumber } from "../shared/formatPhoneNumber";

describe("formatPhoneNumber", () => {
  // Тесты для пустых значений
  test("returns empty string for null input", () => {
    expect(formatPhoneNumber(null as any)).toBe("");
  });

  test("returns empty string for undefined input", () => {
    expect(formatPhoneNumber(undefined as any)).toBe("");
  });

  test("returns empty string for empty string", () => {
    expect(formatPhoneNumber("")).toBe("");
  });

  test("returns empty string for string with only spaces", () => {
    expect(formatPhoneNumber("   ")).toBe("");
  });

  // Тесты для односимвольных номеров
  test("handles single digit '7' correctly", () => {
    expect(formatPhoneNumber("7")).toBe("+7");
  });

  test("handles single digit '8' correctly", () => {
    expect(formatPhoneNumber("8")).toBe("+7");
  });

  test("handles single digit '1' correctly", () => {
    expect(formatPhoneNumber("1")).toBe("+71");
  });

  test("handles single digit '9' correctly", () => {
    expect(formatPhoneNumber("9")).toBe("+99999999999");
  });

  // Тесты для коротких номеров (2-4 цифры)
  test("formats 2-digit number correctly", () => {
    expect(formatPhoneNumber("71")).toBe("+7 (1");
  });

  test("formats 3-digit number correctly", () => {
    expect(formatPhoneNumber("712")).toBe("+7 (12");
  });

  test("formats 4-digit number correctly", () => {
    expect(formatPhoneNumber("7123")).toBe("+7 (123");
  });

  // Тесты для номеров средней длины (5-7 цифр)
  test("formats 5-digit number correctly", () => {
    expect(formatPhoneNumber("71234")).toBe("+7 (123) 4");
  });

  test("formats 6-digit number correctly", () => {
    expect(formatPhoneNumber("712345")).toBe("+7 (123) 45");
  });

  test("formats 7-digit number correctly", () => {
    expect(formatPhoneNumber("7123456")).toBe("+7 (123) 456");
  });

  // Тесты для номеров почти полной длины (8-9 цифр)
  test("formats 8-digit number correctly", () => {
    expect(formatPhoneNumber("71234567")).toBe("+7 (123) 456-7");
  });

  test("formats 9-digit number correctly", () => {
    expect(formatPhoneNumber("712345678")).toBe("+7 (123) 456-78");
  });

  // Тесты для полных номеров (10+ цифр)
  test("formats 10-digit number starting with 7 correctly", () => {
    expect(formatPhoneNumber("7123456789")).toBe("+7 (123) 456-78-9");
  });

  test("formats 11-digit number starting with 7 correctly", () => {
    expect(formatPhoneNumber("71234567890")).toBe("+7 (123) 456-78-90");
  });

  test("formats 11-digit number starting with 8 correctly", () => {
    expect(formatPhoneNumber("81234567890")).toBe("+7 (123) 456-78-90");
  });

  test("formats 11-digit number starting with 1 correctly", () => {
    expect(formatPhoneNumber("12345678901")).toBe("+7 (234) 567-89-01");
  });

  test("formats 12-digit number correctly (ignores extra digits)", () => {
    expect(formatPhoneNumber("712345678901")).toBe("+7 (123) 456-78-90");
  });

  // Тесты для номеров с нецифровыми символами
  test("handles dashes in phone number", () => {
    expect(formatPhoneNumber("7-123-456-78-90")).toBe("+7 (123) 456-78-90");
  });

  test("handles spaces in phone number", () => {
    expect(formatPhoneNumber("7 123 456 78 90")).toBe("+7 (123) 456-78-90");
  });

  test("handles parentheses and spaces", () => {
    expect(formatPhoneNumber("(7) 123-456-78-90")).toBe("+7 (123) 456-78-90");
  });

  test("handles dots in phone number", () => {
    expect(formatPhoneNumber("7.123.456.78.90")).toBe("+7 (123) 456-78-90");
  });

  test("handles mixed non-digit characters", () => {
    expect(formatPhoneNumber("+7(123) 456-78-90 ext. 123")).toBe(
      "+7 (123) 456-78-90"
    );
  });

  // Тесты для международных форматов
  test("handles international format with +7 prefix", () => {
    expect(formatPhoneNumber("+71234567890")).toBe("+7 (123) 456-78-90");
  });

  test("handles international format with +8 prefix", () => {
    expect(formatPhoneNumber("+81234567890")).toBe("+7 (123) 456-78-90");
  });

  test("handles international format with +1 prefix", () => {
    expect(formatPhoneNumber("+11234567890")).toBe("+7 (123) 456-78-90");
  });

  // Тесты для номеров с пробелами в начале и конце
  test("trims spaces at the beginning", () => {
    expect(formatPhoneNumber("   71234567890")).toBe("+7 (123) 456-78-90");
  });

  test("trims spaces at the end", () => {
    expect(formatPhoneNumber("71234567890   ")).toBe("+7 (123) 456-78-90");
  });

  test("trims spaces at both ends", () => {
    expect(formatPhoneNumber("   71234567890   ")).toBe("+7 (123) 456-78-90");
  });

  // Тесты для edge cases
  test("handles very long number (takes only first 11 digits after cleaning)", () => {
    expect(formatPhoneNumber("71234567890123456789")).toBe(
      "+7 (123) 456-78-90"
    );
  });

  test("handles number with all zeros", () => {
    expect(formatPhoneNumber("00000000000")).toBe("+7 (000) 000-00-00");
  });

  test("handles number with all same digits", () => {
    expect(formatPhoneNumber("77777777777")).toBe("+7 (777) 777-77-77");
  });

  test("handles number with special characters only", () => {
    expect(formatPhoneNumber("()-+ .")).toBe("");
  });
});
