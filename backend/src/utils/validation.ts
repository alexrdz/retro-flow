export interface ValidationError {
  field: string;
  message: string;
}

export function validateRequiredString(value: any, fieldName: string, maxLength: number = 500): ValidationError | null {
    if (value === undefined || value === null) {
      return { field: fieldName, message: `${fieldName} is required` };
    }

    if (typeof value !== 'string') {
      return { field: fieldName, message: `${fieldName} must be a string` };
    }

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return { field: fieldName, message: `${fieldName} cannot be empty` };
    }

    if (trimmed.length > maxLength) {
      return { field: fieldName, message: `${fieldName} must be ${maxLength} characters or less` };
    }

    return null;
}


export function validateOptionalString(value: any, fieldName: string, maxLength: number = 500): ValidationError | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    if (typeof value !== 'string') {
      return { field: fieldName, message: `${fieldName} must be a string` };
    }

    if (value.trim().length > maxLength) {
      return { field: fieldName, message: `${fieldName} must be ${maxLength} characters or less` };
    }

    return null;
}


export function validateNumber(value: any, fieldName: string, min?: number, max?: number): ValidationError | null {
    if (value === undefined || value === null) {
      return { field: fieldName, message: `${fieldName} is required` };
    }

    const num = Number(value);
    if (isNaN(num)) {
      return { field: fieldName, message: `${fieldName} must be a number` };
    }

    if (min !== undefined && num < min) {
      return { field: fieldName, message: `${fieldName} must be at least ${min}` };
    }

    if (max !== undefined && num > max) {
      return { field: fieldName, message: `${fieldName} must be at most ${max}` };
    }

    return null;
}


export function sanitizeString(value: string, maxLength: number = 500): string {
    return value.trim().slice(0, maxLength);
}


export function validateEnum<T extends string>(value: any, fieldName: string, allowedValues: T[]): ValidationError | null {
  if (!allowedValues.includes(value)) {
    return {
      field: fieldName,
      message: `${fieldName} must be one of: ${allowedValues.join(', ')}`
    };
  }
  return null;
}
