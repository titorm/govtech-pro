/**
 * Formatting utilities for Brazilian standards
 */

export function formatCurrency(
  value: number,
  currency: string = "BRL"
): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

export function formatCNPJ(cnpj: string): string {
  const cleanCNPJ = cnpj.replace(/\D/g, "");
  if (cleanCNPJ.length !== 14) return cnpj;

  return cleanCNPJ.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5"
  );
}

export function formatPhone(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, "");

  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  return phone;
}

export function formatCEP(cep: string): string {
  const cleanCEP = cep.replace(/\D/g, "");
  if (cleanCEP.length !== 8) return cep;

  return cleanCEP.replace(/(\d{5})(\d{3})/, "$1-$2");
}

export function formatRG(rg: string): string {
  const cleanRG = rg.replace(/\D/g, "");

  if (cleanRG.length === 7) {
    return cleanRG.replace(/(\d{1})(\d{3})(\d{3})/, "$1.$2.$3");
  } else if (cleanRG.length === 8) {
    return cleanRG.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2.$3");
  } else if (cleanRG.length === 9) {
    return cleanRG.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
  }

  return rg;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minuto${minutes !== 1 ? "s" : ""}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hora${hours !== 1 ? "s" : ""}`;
  }

  return `${hours}h ${remainingMinutes}min`;
}

export function formatInitials(name: string): string {
  return name
    .split(" ")
    .filter((part) => part.length > 2) // Skip prepositions
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function formatNameForDisplay(name: string): string {
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => {
      // Don't capitalize prepositions
      const prepositions = ["de", "da", "do", "das", "dos", "e"];
      if (prepositions.includes(word)) return word;

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();
}

export function formatAddress(address: {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}): string {
  const parts = [
    `${address.street}, ${address.number}`,
    address.complement,
    address.neighborhood,
    `${address.city} - ${address.state}`,
    formatCEP(address.zipCode),
  ].filter(Boolean);

  return parts.join(", ");
}
