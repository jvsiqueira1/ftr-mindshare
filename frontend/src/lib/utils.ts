import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error && error.message ? error.message : fallback
}

export function getInitials(name?: string): string {
    if (!name) return ""

    return name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

export function formatRelativeDate(date: Date | string): string {
    const now = new Date()
    const past = new Date(date)
    const diffInMs = now.getTime() - past.getTime()
    const diffInSeconds = Math.floor(diffInMs / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInSeconds < 60) {
        return "Agora"
    }

    if (diffInMinutes < 60) {
        return `Há ${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`
    }

    if (diffInHours < 24) {
        return `Há ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`
    }

    if (diffInDays === 1) {
        return "Ontem"
    }

    return `Há ${diffInDays} ${diffInDays === 1 ? "dia" : "dias"}`
}
