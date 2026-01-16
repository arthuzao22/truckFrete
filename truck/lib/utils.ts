// FreteConnect 2.0 - Utility Functions
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind classes with proper override
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency to BRL
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value)
}

/**
 * Format date to pt-BR
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(date))
}

/**
 * Format datetime to pt-BR
 */
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date))
}

/**
 * Format weight (kg to tons if > 1000kg)
 */
export function formatWeight(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} ton`
  }
  return `${kg.toFixed(0)} kg`
}

/**
 * Format volume
 */
export function formatVolume(m3: number): string {
  return `${m3.toFixed(2)} m³`
}

/**
 * Format distance
 */
export function formatDistance(km: number): string {
  return `${km.toFixed(0)} km`
}

/**
 * Format CPF/CNPJ
 */
export function formatCpfCnpj(value: string): string {
  const cleaned = value.replace(/\D/g, "")
  
  if (cleaned.length === 11) {
    // CPF: 000.000.000-00
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  } else if (cleaned.length === 14) {
    // CNPJ: 00.000.000/0000-00
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  }
  
  return value
}

/**
 * Format phone
 */
export function formatPhone(value: string): string {
  const cleaned = value.replace(/\D/g, "")
  
  if (cleaned.length === 11) {
    // Celular: (00) 00000-0000
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  } else if (cleaned.length === 10) {
    // Fixo: (00) 0000-0000
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
  }
  
  return value
}

/**
 * Format plate (Mercosul)
 */
export function formatPlate(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7)
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth radius in km
  const dLat = deg2rad(lat2 - lat1)
  const dLng = deg2rad(lng2 - lng1)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return distance
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Get relative time (há X minutos/horas/dias)
 */
export function getRelativeTime(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  
  if (diffSec < 60) return "agora mesmo"
  if (diffMin < 60) return `há ${diffMin} minuto${diffMin > 1 ? "s" : ""}`
  if (diffHour < 24) return `há ${diffHour} hora${diffHour > 1 ? "s" : ""}`
  if (diffDay < 7) return `há ${diffDay} dia${diffDay > 1 ? "s" : ""}`
  
  return formatDate(past)
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + "..."
}

/**
 * Sleep function for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Generate random color for avatar
 */
export function generateAvatarColor(seed: string): string {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-red-500"
  ]
  
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(" ")
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Validate CPF
 */
export function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "")
  
  if (cleaned.length !== 11) return false
  if (/^(\d)\1+$/.test(cleaned)) return false
  
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i)
  }
  let rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== parseInt(cleaned.charAt(9))) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i)
  }
  rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== parseInt(cleaned.charAt(10))) return false
  
  return true
}

/**
 * Validate CNPJ
 */
export function isValidCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, "")
  
  if (cleaned.length !== 14) return false
  if (/^(\d)\1+$/.test(cleaned)) return false
  
  let length = cleaned.length - 2
  let numbers = cleaned.substring(0, length)
  const digits = cleaned.substring(length)
  let sum = 0
  let pos = length - 7
  
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(0))) return false
  
  length = length + 1
  numbers = cleaned.substring(0, length)
  sum = 0
  pos = length - 7
  
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(1))) return false
  
  return true
}
