import type { ClassValue } from 'clsx'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names using clsx and merges them with tailwind-merge.
 * @param {...any} inputs
 * @returns {string} The combined and merged class names.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
