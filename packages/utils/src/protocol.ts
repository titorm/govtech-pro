/**
 * Protocol number generation and validation utilities
 */

export function generateProtocolNumber(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `${year}${timestamp.toString().slice(-6)}${random}`;
}

export function formatProtocolNumber(protocolNumber: string): string {
  if (protocolNumber.length !== 13) return protocolNumber;

  // Format: YYYY.XXXXXX.XXX
  return `${protocolNumber.slice(0, 4)}.${protocolNumber.slice(
    4,
    10
  )}.${protocolNumber.slice(10)}`;
}

export function validateProtocolNumber(protocolNumber: string): boolean {
  const cleanNumber = protocolNumber.replace(/\D/g, "");

  // Must have 13 digits
  if (cleanNumber.length !== 13) return false;

  // Year must be valid (between 2020 and current year + 1)
  const year = parseInt(cleanNumber.slice(0, 4));
  const currentYear = new Date().getFullYear();

  return year >= 2020 && year <= currentYear + 1;
}

export function extractYearFromProtocol(protocolNumber: string): number {
  const cleanNumber = protocolNumber.replace(/\D/g, "");
  return parseInt(cleanNumber.slice(0, 4));
}

export function generateProtocolBarcode(protocolNumber: string): string {
  // Generate a simple barcode representation
  const cleanNumber = protocolNumber.replace(/\D/g, "");
  let barcode = "";

  for (const digit of cleanNumber) {
    // Simple encoding: each digit becomes a pattern of bars
    const patterns = {
      "0": "||  ||",
      "1": "| || |",
      "2": "|| | |",
      "3": "|  |||",
      "4": "|||  |",
      "5": "| ||| ",
      "6": "|||| |",
      "7": "| ||||",
      "8": "|||| |",
      "9": "||||  ",
    };
    barcode += patterns[digit as keyof typeof patterns] || "||||||";
  }

  return barcode;
}
