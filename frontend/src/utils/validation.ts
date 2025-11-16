export function sanitizeText(input: string, maxLength: number = 500): string {
    return input.trim().slice(0, maxLength)
  }

export function isRequired(value: string): boolean {
  return value.trim().length > 0
}

export function isWithinMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength
}

export function stripHtml(input: string): string {
  const div = document.createElement('div')
  div.textContent = input
  return div.textContent || ''
}
